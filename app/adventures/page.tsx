import { CreateAdventureButton } from "@/components/adventures/create-adventure-button";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyH2 } from "@/components/ui/typography/TypographyH2";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import { getAdventures } from "@/lib/adventure/adventure.server";
import { getAgents } from "@/lib/agent/agent.server";
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import { ArrowRightIcon } from "lucide-react";
import { log } from "next-axiom";
import Image from "next/image";
import Link from "next/link";

export default async function AdventuresPage() {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const adventures = await getAdventures(3);

  const agents = await getAgents(userId);

  return (
    <div className="flex flex-col gap-6 p-4 px-4 md:px-6 py-8">
      <TypographyH1>AI Adventures</TypographyH1>
      {/* <div>
        <CreateAdventureButton />
      </div> */}
      <div>
        <TypographyH2 className="border-none">Your Adventures</TypographyH2>
        <TypographyMuted className="text-lg">
          Continue an adventure you have already started
        </TypographyMuted>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <Link
            key={agent.agentUrl}
            href={`/play/${agent.handle}/camp`}
            className="rounded-md border-foreground/20 border overflow-hidden hover:border-indigo-600"
          >
            <div className="p-4 flex gap-4 bg-muted">
              <div>
                <div className="relative w-24 h-24 rounded-md overflow-hidden">
                  <Image
                    src={"/adventurer.png"}
                    fill
                    alt="Adventurer"
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <TypographyLarge>
                  {agent?.Adventure?.name || "Epic Quest"}
                </TypographyLarge>
                <TypographyMuted>
                  {agent?.Adventure?.description ||
                    "An epic quest filled with danger and adventure"}
                </TypographyMuted>
              </div>
            </div>
            <div className=" p-4 flex flex-col">
              <div>
                <TypographySmall className="text-muted-foreground">
                  Started at
                </TypographySmall>
                <TypographyLarge>
                  {format(agent.createdAt, "MMM d, yyyy")}
                </TypographyLarge>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div>
        <TypographyH2 className="border-none">Find an Adventure</TypographyH2>
        <TypographyMuted className="text-lg">
          Discover adventures created by the community. Or{" "}
          <CreateAdventureButton />{" "}
        </TypographyMuted>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {adventures.map((adventure) => (
          <Link
            key={adventure.id}
            href={`/adventures/${adventure.id}`}
            className="rounded-md border-foreground/20 border overflow-hidden hover:border-indigo-600"
          >
            <div className="relative aspect-video ">
              <Image src={"/adventurer.png"} fill alt="Adventurer" />
            </div>
            <div className="pb-2 px-4 flex flex-col">
              <div>
                <TypographySmall className="text-muted-foreground">
                  Quest
                </TypographySmall>
                <TypographyLarge>
                  {adventure.name || "Epic Quest"}
                </TypographyLarge>
              </div>
              <div>
                <TypographySmall className="text-muted-foreground">
                  Description
                </TypographySmall>
                <TypographyLarge className="line-clamp-3">
                  {adventure.description}
                </TypographyLarge>
              </div>
            </div>
          </Link>
        ))}
        <Link
          href={`/adventures/all`}
          className="rounded-md border-foreground/20 border overflow-hidden hover:border-indigo-600 flex justify-center items-center"
        >
          <TypographyLarge>See All Adventures</TypographyLarge>
          <ArrowRightIcon size={24} className="ml-2" />
        </Link>
      </div>
    </div>
  );
}
