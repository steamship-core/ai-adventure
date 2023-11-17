import { createAgent } from "@/lib/agent/agent.server";
import prisma from "@/lib/db";
import AdventureMilestoneEmail from "@/lib/emails/adventure-creation";
import { auth, currentUser } from "@clerk/nextjs";
import { log } from "next-axiom";
import { redirect } from "next/navigation";
import { Resend } from "resend";

const countMap = {
  1: "🚀 Exciting News: Someone Played Your Adventure for the First Time!",
  5: "🌟 Milestone Alert: Your Adventure has been Played 5 Times!",
  10: "🔟 Celebrating 10 Plays of Your Adventure – Thank You!",
  25: "✨ 25 Plays and Counting: Your Adventure is a Hit!",
  50: "🎉 50 Times Over: Your Adventure is Thriving!",
  100: "💯 Congrats! Your Adventure Has Been Played 100 Times!",
  250: "🌟 250 Plays Milestone: Your Adventure is a Community Star!",
  500: "🎇 Half a Thousand Plays: Your Adventure Captivates the Crowd!",
  1000: "🎇 Half a Thousand Plays: Your Adventure Captivates the Crowd!",
};

export default async function AdventurePage({
  params,
  searchParams,
}: {
  params: { adventureId: string };
  searchParams: { [key: string]: string };
}) {
  const { userId } = auth();
  if (!userId) throw new Error("no user");
  const user = await currentUser();

  const isDevelopment = searchParams["isDevelopment"] === "true";
  const adventure = await prisma.adventure.findUnique({
    where: {
      id: params.adventureId,
    },
  });
  if (!adventure) {
    log.error("No Adventure - redirecting to /adventures");
    redirect("/adventures");
  }
  const agent = await createAgent(userId, params.adventureId, isDevelopment);

  if (!agent) {
    log.error("No agent - redirecting to /adventures");
    redirect("/adventures");
  }

  if (adventure.creatorId !== userId) {
    const resend = new Resend(process.env.RESEND_KEY);

    // Count the agents for this adventure and not the creator
    const count = await prisma.agents.count({
      where: {
        AND: {
          adventureId: params.adventureId,
          ownerId: { not: adventure.creatorId },
        },
      },
    });

    let userName = "";
    const email = user?.emailAddresses[0].emailAddress;
    if (email) {
      if (user?.firstName) {
        userName = user.firstName;
      } else {
        userName = email.split("@")[0];
      }
      // if count exists in countMap, send email
      const emailSubject = countMap[count as keyof typeof countMap];
      if (emailSubject) {
        await resend.emails.send({
          from: "AI Adventure <updates@updates.ai-adventure.steamship.com>",
          to: email,
          subject: emailSubject,
          react: (
            <AdventureMilestoneEmail
              username={userName}
              title={countMap[1]}
              adventureId={adventure.id}
              adventureName={adventure.name}
            />
          ),
        });
      }
    }
  }
  const search = new URLSearchParams(searchParams);
  redirect(`/play/${agent.handle}/character-creation?${search.toString()}`);
}
