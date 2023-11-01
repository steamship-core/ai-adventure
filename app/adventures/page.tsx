import AdventureInstanceDropdown from "@/components/adventures/adventure-instance-dropdown";
import { CreateAdventureButton } from "@/components/adventures/create-adventure-button";
import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyH2 } from "@/components/ui/typography/TypographyH2";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import {
  getAdventures,
  getAdventuresForUser,
} from "@/lib/adventure/adventure.server";
import { getAgents } from "@/lib/agent/agent.server";
import prisma from "@/lib/db";
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

  const adventures = await getAdventures(4);
  const adventureTemplates = await getAdventuresForUser(userId);
  const agents = await getAgents(userId);

  async function deleteAgent(agentId: number) {
    "use server";
    // ...
    await prisma.agents.delete({
      where: {
        id: agentId,
        ownerId: userId!,
      },
    });
  }

  return (
    <div className="flex flex-col gap-6 p-4 px-4 md:px-6 py-8">
      <TypographyH1>AI Adventures</TypographyH1>
      {agents.length > 0 && (
        <>
          <div>
            <TypographyH2 className="border-none">Your Adventures</TypographyH2>
            <TypographyMuted className="text-lg">
              Continue an adventure you have already started
            </TypographyMuted>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent) => (
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
                      />
                    </div>
                  </div>
                  <div>
                    <TypographyLarge>
                      {agent?.Adventure?.name || "Epic Quest"}
                    </TypographyLarge>
                    <TypographyMuted className="line-clamp-1">
                      {agent?.Adventure?.description ||
                        "An epic quest filled with danger and adventure"}
                    </TypographyMuted>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center">
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
              </Link>
            ))}
          </div>
        </>
      )}

      {adventureTemplates.length > 0 && (
        <>
          <div>
            <TypographyH2 className="border-none">
              Your Adventure Templates
            </TypographyH2>
            <TypographyMuted className="text-lg">
              Edit an adventure template you have already created
            </TypographyMuted>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {adventureTemplates.map((adventureTemplate) => (
              <Link
                key={adventureTemplate.id}
                href={`/adventures/${adventureTemplate.id}`}
                className="rounded-md border-foreground/20 border overflow-hidden hover:border-indigo-600"
              >
                <div className="p-4 flex flex-col gap-4 bg-muted">
                  <div>
                    <div className="relative w-full aspect-video rounded-md overflow-hidden">
                      <Image
                        src={adventureTemplate.image || "/adventurer.png"}
                        fill
                        alt="Adventurer"
                      />
                    </div>
                  </div>
                  <div>
                    <TypographyLarge>
                      {adventureTemplate.name || "Epic Quest"}
                    </TypographyLarge>
                    <TypographyMuted className="line-clamp-1">
                      {adventureTemplate.description ||
                        "An epic quest filled with danger and adventure"}
                    </TypographyMuted>
                  </div>
                </div>
                <div className=" p-4 flex flex-col">
                  <div>
                    <TypographySmall className="text-muted-foreground">
                      Created at
                    </TypographySmall>
                    <TypographyLarge>
                      {format(adventureTemplate.createdAt, "MMM d, yyyy")}
                    </TypographyLarge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
      <div className="mt-12">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="col-span-2 lg:col-span-2">
            <TypographyH2 className="border-none">
              Find an Adventure
            </TypographyH2>
            <TypographyMuted className="text-lg">
              Discover adventures created by the community. You can also create
              your own adventure and share it with the world.
            </TypographyMuted>
            <div className="mt-4 flex flex-col gap-2 md:gap-6 md:w-1/2">
              <CreateAdventureButton />
              <Button asChild variant="outline">
                <Link href={`/adventures/all`}>
                  See All Adventures{" "}
                  <ArrowRightIcon size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
          {adventures.map((adventure) => (
            <Link
              key={adventure.id}
              href={`/adventures/${adventure.id}`}
              className="rounded-md border-foreground/20 border overflow-hidden hover:border-indigo-600"
            >
              <div className="relative aspect-video ">
                <Image
                  src={adventure.image || "/adventurer.png"}
                  fill
                  alt="Adventurer"
                />
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
                    {adventure.shortDescription}
                  </TypographyLarge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
