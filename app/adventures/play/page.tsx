import AdventureInstanceDropdown from "@/components/adventures/adventure-instance-dropdown";
import AdventureTag from "@/components/adventures/adventure-tag";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/typography/TypographyH2";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import { getAgents } from "@/lib/agent/agent.server";
import prisma from "@/lib/db";
import { getSteamshipClient } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import { Metadata } from "next";
import { log } from "next-axiom";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Play Adventures - AI Adventure",
  description:
    "Continue an adventure you have already started. Dive back into the story and continue your journey.",
};

export default async function AdventuresPage() {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const agents = await getAgents(userId);
  async function deleteAgent(agentId: number) {
    "use server";
    const agent = await prisma.agents.findUnique({
      where: {
        id: agentId,
        ownerId: userId!,
      },
    });

    if (!agent) {
      return;
    }

    const deletedAgent = await prisma.agents.delete({
      where: {
        id: agentId,
        ownerId: userId!,
      },
    });
    if (!deletedAgent) {
      return;
    }
    const steamship = await getSteamshipClient();
    await steamship.workspace.delete({ handle: agent.handle });
  }

  return (
    <div className="flex flex-col gap-6 p-4 px-4 md:px-6 py-8">
      <div className="flex flex-col justify-between">
        <TypographyH2 className="border-none">
          Continue An Adventure
        </TypographyH2>
        <TypographyMuted className="text-lg">
          Continue an adventure you have already started
        </TypographyMuted>
      </div>
      {agents.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {agents.map((agent) => {
              if (!agent?.handle) {
                // Note: Some old database rows seem to lack this.
                return null;
              }
              return (
                <Link
                  key={agent.agentUrl}
                  href={`/play/${agent.handle}/camp`}
                  className="rounded-md border-foreground/20 border overflow-hidden hover:border-indigo-600"
                >
                  <div className="p-4 flex flex-col gap-4 bg-muted">
                    <div>
                      <div className="relative w-full aspect-video rounded-md overflow-hidden">
                        <Image
                          src={agent.Adventure?.image || "/adventurer.png"}
                          fill
                          alt="Adventurer"
                          className="object-cover"
                          sizes="460px"
                        />
                      </div>
                    </div>
                    <div>
                      <TypographyLarge>
                        {agent?.Adventure?.name || "Epic Quest"}{" "}
                      </TypographyLarge>
                      <TypographyMuted className="line-clamp-1">
                        {agent?.Adventure?.description ||
                          "An epic quest filled with danger and adventure"}
                      </TypographyMuted>
                    </div>
                  </div>
                  <div className="p-4 flex flex-1 justify-between flex-col">
                    <div className=" flex justify-between items-center">
                      <div>
                        <TypographySmall className="text-muted-foreground">
                          Started at
                        </TypographySmall>
                        <TypographyLarge>
                          {format(agent.createdAt, "MMM d, yyyy")}
                        </TypographyLarge>
                      </div>
                      <AdventureInstanceDropdown
                        agentId={agent.id}
                        deleteAgent={deleteAgent}
                      />
                    </div>
                    <div className="flex mt-2 flex-wrap gap-2">
                      {agent.Adventure?.tags.map((tag) => (
                        <AdventureTag key={tag} tag={tag} />
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
      {agents.length === 0 && (
        <div className="flex flex-col w-full items-center justify-center gap-6 p-4 px-4 md:px-6 py-8">
          <TypographyH2 className="border-none">
            You haven&apos;t started any adventures yet
          </TypographyH2>
          <TypographyMuted className="text-lg">
            Head over to the Discover page to find an adventure to start
          </TypographyMuted>
          <Button className="mt-2" asChild>
            <Link href="/adventures">Discover Adventures</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
