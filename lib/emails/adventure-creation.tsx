import { clerkClient } from "@clerk/nextjs/server";
import { Adventure } from "@prisma/client";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Resend } from "resend";

interface AdventureMilestoneEmailProps {
  title?: string;
  adventureId?: string;
  adventureName?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_WEB_BASE_URL
  ? process.env.NEXT_PUBLIC_WEB_BASE_URL
  : "";

export const AdventureMilestoneEmail = ({
  title = `Your Adventure is being played!`,
  adventureId = "123",
  adventureName = "My Adventure",
}: AdventureMilestoneEmailProps) => {
  const previewText = title;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src="https://ai-adventure.steamship.com/android-chrome-512x512.png"
                width="40"
                height="37"
                alt="Vercel"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              {title}
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hey there! 👋
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Your adventure
              <strong>
                <Link
                  href={`${baseUrl}/adventures/${adventureId}`}
                  className="text-blue-600 no-underline mx-1"
                >
                  {adventureName}
                </Link>
              </strong>
              is gaining attention!
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Thanks for making AI Adventure a great place with your engaging
              stories. Keep up the fantastic work!
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded px-2 py-4 text-white text-[12px] font-semibold no-underline text-center"
                href={`${baseUrl}/adventures/${adventureId}`}
              >
                Checkout your adventure
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

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

export async function sendAdventureMilestoneEmail(
  adventure: Adventure,
  count: number
) {
  const resend = new Resend(process.env.RESEND_KEY);
  const emailSubject = countMap[count as keyof typeof countMap];
  if (emailSubject) {
    const owner = await clerkClient.users.getUser(adventure.creatorId);
    const ownerEmail = owner.emailAddresses[0].emailAddress;
    if (ownerEmail) {
      const reactContent = (
        <AdventureMilestoneEmail
          title={emailSubject}
          adventureId={adventure.id}
          adventureName={adventure.name}
        />
      );

      await resend.emails.send({
        from: "AI Adventure <updates@ai-adventure.steamship.com>",
        to: ownerEmail,
        subject: emailSubject,
        react: reactContent,
      });
    }
  }
}
