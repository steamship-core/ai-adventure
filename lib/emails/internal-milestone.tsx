import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Resend } from "resend";

interface AdventureMilestoneEmailProps {
  title?: string;
  numAdventures: number;
}

const defaultTitle = `Holy cow would you look at that!`

export const InternalMilestoneEmail = ({
  title = defaultTitle,
  numAdventures = 0,
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
              {title} {numAdventures} Adventures played!!
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hey there! 👋
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              We just reached a milestone of {numAdventures} Adventures played!
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export async function sendInternalMilestoneEmail(numAdventures: number) {
  const resend = new Resend(process.env.RESEND_KEY);
  const reactContent = <InternalMilestoneEmail numAdventures={numAdventures} />;

  await resend.emails.send({
    from: "AI Adventure <updates@ai-adventure.steamship.com>",
    to: "max@steamship.com",
    subject: defaultTitle,
    react: reactContent,
  });
}
