import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyH2 } from "@/components/ui/typography/TypographyH2";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import { getAgents } from "@/lib/agent/agent.server";
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import { log } from "next-axiom";
import Image from "next/image";

export default async function CampPage() {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const agents = await getAgents(userId);
  return (
    <div className="flex flex-col gap-6">
      <TypographyH1>AI Adventures</TypographyH1>
      <TypographyH2>Find an Adventure</TypographyH2>
      <div>
        <Button>Create a new adventure</Button>
      </div>
      <TypographyH2>Your Adventures</TypographyH2>
      <div className="grid grid-cols-4 gap-4">
        {agents.map((agent) => (
          <a
            key={agent.agentUrl}
            href={agent.agentUrl}
            className="rounded-md border-foreground/20 border overflow-hidden "
          >
            <div className="relative aspect-video ">
              <Image src={"/adventurer.png"} fill alt="Adventurer" />
            </div>
            <div className="p-4 flex flex-col">
              <div>
                <TypographySmall className="text-muted-foreground">
                  Quest
                </TypographySmall>
              </div>
              <div>
                <TypographySmall className="text-muted-foreground">
                  Started at
                </TypographySmall>
                <TypographyLarge>
                  {format(agent.createdAt, "MMM d, yyyy")}
                </TypographyLarge>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
