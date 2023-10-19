import { MainCTA } from "@/components/landing/header";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/typography/TypographyH2";
import { TypographyH3 } from "@/components/ui/typography/TypographyH3";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  CircleDollarSignIcon,
  FingerprintIcon,
  VenetianMaskIcon,
  WandIcon,
  ZapIcon,
} from "lucide-react";
import { Cinzel } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import "./globals.css";

const font = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const characters = [
  {
    image: "/eldora.png",
    name: "Eldora Brightwing",
    class: "Enchantress",
  },
  {
    image: "/kael.png",
    name: "Kael Xyron",
    class: "Bounty Hunter",
  },
  {
    image: "/nox.png",
    name: "Nox Umbra",
    class: "Keeper of Secrets",
  },
];

const features = [
  {
    name: "On the fly generation",
    description:
      "Everything is generated on the fly. No need to wait for a DM to create your adventure. This includes the story, images, and audio.",
    emoji: "🪄",
    icon: WandIcon,
  },
  {
    name: "Swappable Models",
    description:
      "Bring your own LLMs and Stable Diffusion + LORA Generators. Quickly custimize your adventure by swapping out models by editing a single file.",
    emoji: "🎭",
    icon: VenetianMaskIcon,
  },
  {
    name: "Payment Ready",
    description:
      "Stripe Integration is built in. You can charge your players to play your adventure.",
    emoji: "💰",
    icon: CircleDollarSignIcon,
  },
  {
    name: "Authentication Solved",
    description:
      "Simple integration setup with Clerk means you can focus on building your adventure, not authentication.",
    emoji: "🔑",
    icon: FingerprintIcon,
  },
];

const Section = ({ children }: { children: ReactNode }) => (
  <div className="my-36">{children}</div>
);

const Title = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="flex flex-col items-center justify-center w-full text-center mb-16">
    <TypographyH3 className="text-xl md:text-3xl">{title}</TypographyH3>
    <TypographyMuted className="text-lg md:text-2xl mt-4 max-w-md">
      {subtitle}
    </TypographyMuted>
  </div>
);

const Actions = ({ children }: { children: ReactNode }) => (
  <div className="w-full flex items-center justify-center mb-24 gap-2">
    {children}
  </div>
);

export default function Home() {
  return (
    <main id="main-container" className={cn("h-full ", font.className)}>
      <MainCTA />
      <div className="flex-col pb-12 w-full h-1/3 md:h-1/2 bg-gradient-to-b px-6 md:px-12 text-center from-transparent via-background/50 to-background flex items-center justify-end">
        <h1 className="text-4xl md:text-6xl lg:text-7xl leading-6 font-bold mb-4">
          Fantasy Unbounded
        </h1>
        <TypographyH2 className="border-none font-normal text-2xl md:text-4xl lg:text-5xl">
          Let AI Be Your Dungeon Master.
        </TypographyH2>
        <Button
          asChild
          className="bg-indigo-600 hover:bg-indigo-800 text-white py-6 text-large mt-8"
        >
          <Link href="/play">Create your Character</Link>
        </Button>
        <div className="w-full text-center flex items-center justify-center mt-4">
          <TypographySmall>
            <ZapIcon
              size={16}
              className="fill-yellow-600 inline text-yellow-600"
            />{" "}
            by{" "}
            <a
              href="https://steamship.com"
              target="_blank"
              className="underline"
            >
              Steamship
            </a>
          </TypographySmall>
        </div>
      </div>
      <div className="bg-background py-12 md:py-32 flex flex-col px-6 md:px-12">
        <div className="max-w-4xl mx-auto w-full">
          <Section>
            <Title
              title="Get started with a pre-generated character"
              subtitle="Pick from one of three templates"
            />
            <div className="grid grid-cols-1 md:grid-cols-3">
              {characters.map((character, i) => (
                <div key={i} className="p-6">
                  <button className="relative rounded-md overflow-hidden w-full aspect-[1/1] md:aspect-[1/1.5] border border-foreground/20 hover:border-indigo-500">
                    <Image
                      fill
                      src={character.image}
                      alt="Nox Umbra"
                      className="object-cover z-10"
                    />
                    <div className="z-20 absolute bottom-0 left-0 bg-background/80 w-full">
                      <div className="w-full">
                        <TypographySmall>{character.name}</TypographySmall>
                        <TypographyMuted>{character.class}</TypographyMuted>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </Section>
          <Section>
            <Title
              title="Create your own AI Adventure"
              subtitle="AI Adventure is open source. Fork the project and make it your
                own."
            />
            <Actions>
              <Button asChild>
                <a
                  href="https://github.com/steamship-packages/ai-adventure"
                  target="_blank"
                  className="flex items-center justify-center gap-2"
                >
                  <Image
                    src="/github.png"
                    width={24}
                    height={24}
                    alt="Github"
                  />
                  View on Github
                </a>
              </Button>
            </Actions>
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <div>
                    <div className="absolute mt-3 left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg text-2xl bg-indigo-600 text-center">
                      <feature.icon />
                    </div>
                    <TypographySmall>{feature.name}</TypographySmall>
                  </div>
                  <TypographyMuted className="mt-2">
                    {feature.description}
                  </TypographyMuted>
                </div>
              ))}
            </dl>
          </Section>
          <Section>
            <Title
              title="Powered by Steamship"
              subtitle="Steamship is a platform for building AI-powered applications."
            />
            <Actions>
              <Button asChild>
                <a
                  href="https://www.steamship.com/"
                  target="_blank"
                  className="flex items-center justify-center gap-2"
                >
                  Start Building
                </a>
              </Button>
              <Button asChild variant="link">
                <a
                  href="https://docs.steamship.com/agent-guidebook"
                  target="_blank"
                  className="flex items-center justify-center gap-2"
                >
                  Learn more <ArrowRightIcon />
                </a>
              </Button>
            </Actions>
          </Section>
        </div>
      </div>
    </main>
  );
}
