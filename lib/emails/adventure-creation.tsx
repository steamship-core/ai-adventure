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

interface AdventureMilestoneEmailProps {
  title?: string;
  username?: string;
  adventureId?: string;
  adventureName?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const AdventureMilestoneEmail = ({
  title = `Your Adventure is being played!`,
  username = "zenorocha",
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
              Hey {username} 👋
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

export default AdventureMilestoneEmail;
