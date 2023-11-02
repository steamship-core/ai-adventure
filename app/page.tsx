import AdventureListElement from "@/components/adventures/adventure-list-element";
import { MainCTA } from "@/components/landing/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TypographyH2 } from "@/components/ui/typography/TypographyH2";
import { TypographyH3 } from "@/components/ui/typography/TypographyH3";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import prisma from "@/lib/db";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import {
  CircleDollarSignIcon,
  FingerprintIcon,
  StarIcon,
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
  <div className="">{children}</div>
);

const Title = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="flex flex-col items-center justify-center w-full text-center mb-16">
    <TypographyH3 className="text-xl md:text-3xl">{title}</TypographyH3>
    <TypographyMuted className="text-lg md:text-xl mt-4 max-w-lg">
      {subtitle}
    </TypographyMuted>
  </div>
);

const Actions = ({ children }: { children: ReactNode }) => (
  <div className="w-full flex items-center justify-center mb-24 gap-2">
    {children}
  </div>
);

export default async function Home() {
  const featuredAdventures = await prisma.adventure.findMany({
    where: {
      featured: true,
    },
    take: 3,
    orderBy: {
      createdAt: "asc",
    },
  });
  await prisma.adventure.update({
    where: {
      id: "715bb9c0-2c5d-48a5-9024-05be3674e6d4",
    },
    data: {
      featured: true,
    },
  });
  return (
    <main id="main-container" className={cn("h-full ", font.className)}>
      <MainCTA />
      <div className="relative flex-col pb-2 w-full h-1/2 bg-gradient-to-b text-center from-transparent via-background/50 to-background flex items-center justify-end">
        <div className="absolute right-4 top-4">
          <div className="flex gap-2 items-center justify-center">
            <Button asChild>
              <a
                href="https://github.com/steamship-core/ai-adventure"
                target="_blank"
                className="flex items-center justify-center"
              >
                <StarIcon size={16} className="mr-2" /> Star
              </a>
            </Button>
            <UserButton />
          </div>
        </div>
        <div className="pb-12 px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl leading-6 font-bold mb-4">
            Fantasy Unbounded
          </h1>
          <TypographyH2 className="border-none font-normal text-2xl md:text-4xl lg:text-5xl">
            Let AI Be Your Dungeon Master.
          </TypographyH2>
        </div>
      </div>
      <div className="w-full flex items-center justify-center flex-col bg-background pb-8">
        <Button
          asChild
          className="bg-indigo-600 hover:bg-indigo-800 text-white py-6 text-large mt-8 font-bold"
        >
          <Link href="/adventures">Begin Your Adventure</Link>
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
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-32">
          <Section>
            <Title
              title="Choose Your Adventure"
              subtitle="Select from a variety of adventures created by the community."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredAdventures.map((adventure) => (
                <Dialog key={adventure.id}>
                  <DialogTrigger>
                    <AdventureListElement adventure={adventure} link={false} />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Coming soon!</DialogTitle>
                      <DialogDescription>
                        We&apos;re working hard to bring fully customizable
                        quests. Stay tuned! For now, while we are in beta, all
                        adventures are versions of our demo adventure. Create an
                        adventure at our{" "}
                        <Link href="/adventure" className="text-blue-600">
                          adventures page.
                        </Link>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
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
                  href="https://github.com/steamship-core/ai-adventure"
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
        </div>
      </div>
    </main>
  );
}
