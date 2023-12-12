import Editor from "@/components/editor/editor";
import { getAdventure } from "@/lib/adventure/adventure.server";
import { getSchema } from "@/lib/agent/agentSteamship.server";
import prisma from "@/lib/db";
import {
  DEPRECATEDSettingGroups,
  SettingGroup,
} from "@/lib/editor/DEPRECATED-editor-options";
import { getRequiredFields } from "@/lib/editor/get-required-fields";
import { getVersion } from "@/lib/get-version";
import { getNonNullMetadata } from "@/lib/metadata";
import { auth } from "@clerk/nextjs";
import { Metadata, ResolvingMetadata } from "next";
import { log } from "next-axiom";
import { redirect } from "next/navigation";

export async function generateMetadata(
  {
    params,
  }: {
    params: { section: string };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params

  // section is the name of the section formatted as word-word or word
  // replace the dashes with spaces and capitalize the first letter of each word
  const section = params.section
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
  let ret = await getNonNullMetadata(parent);
  ret = {
    ...ret,
    title: `${section} - AI Adventure Editor` as any,
  };
  return ret as Metadata;
}

export default async function EditorPage({
  params,
}: {
  params: { adventureId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const adventure = await getAdventure(params.adventureId, true);
  if (!adventure) {
    log.error("No adventure");
    throw new Error("no adventure");
  }
  if (adventure.creatorId != userId) {
    log.error(
      `User ${userId} does not have permission to edit ${adventure.id}`
    );
    redirect("/adventures");
  }

  if (!adventure) {
    redirect("/adventures");
  }

  const agentVersionParts = adventure.agentVersion.split("@");
  const agentVersion = agentVersionParts.length > 1 ? agentVersionParts[1] : "";

  let settingGroups: SettingGroup[] = [];
  if (agentVersion?.startsWith("1.")) {
    settingGroups = DEPRECATEDSettingGroups;
  } else {
    const responseJson = await getSchema(adventure.devAgent?.agentUrl!);
    settingGroups = responseJson.settingGroups;
  }

  const requiredSettings = getRequiredFields(settingGroups);

  const allSettingsFilled =
    adventure.agentConfig &&
    requiredSettings.every((setting) => {
      // @ts-ignore
      return adventure.agentConfig?.[setting.name];
    });

  const version = getVersion(agentVersion);

  // if version is greater than 2.1.6
  if (version.major >= 2 && version.minor >= 1 && !allSettingsFilled) {
    if (version.major === 2 && version.minor === 1) {
      if (version.patch >= 6) {
        redirect(`/adventures/${adventure.id}/initialize`);
      }
    } else {
      redirect(`/adventures/${adventure.id}/initialize`);
    }
  }

  const userApproval = await prisma.userApprovals.findFirst({
    where: {
      userId: userId,
    },
  });

  let devConfig = {
    ...((adventure.agentDevConfig as any) || {}),
    adventure_name: adventure.name, // Backwards compatible
    name: adventure.name,
    adventure_description: adventure.description, // Backwards compatible
    description: adventure.description,
    adventure_short_description: adventure.shortDescription, // Backwards compatible
    short_description: adventure.shortDescription,
    adventure_image: adventure.image, // Backwards compatible
    image: adventure.image,
    tags: adventure.tags,
    adventure_public: adventure.public,
    adventure_public_requested: adventure.publicRequested,
    game_engine_version: adventure.agentVersion,
    gameEngineVersionAvailable: process.env.STEAMSHIP_AGENT_VERSION,
  };

  return (
    <>
      <Editor
        adventureId={adventure.id}
        devConfig={devConfig}
        isUserApproved={userApproval?.isApproved || false}
        isGenerating={adventure?.state == "generating"}
        isGeneratingTaskId={adventure?.stateTaskId}
        stateUpdatedAt={adventure?.stateUpdatedAt}
        settingGroups={settingGroups}
      />
    </>
  );
}
