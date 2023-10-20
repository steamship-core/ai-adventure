"use client";
import { MainCTA } from "@/components/landing/header";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/typography/TypographyH2";
import { TypographyH3 } from "@/components/ui/typography/TypographyH3";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import { track } from "@vercel/analytics/react";
import {
  CircleDollarSignIcon,
  FingerprintIcon,
  StarIcon,
  VenetianMaskIcon,
  WandIcon,
  ZapIcon,
} from "lucide-react";
import { Cinzel } from "next/font/google";
import Head from "next/head";
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
    image: "/programmer.png",
    name: "Pro Grammer",
    class: "Build an AI Game",
    genre: "Realistic",
    tone: "Serious",
    description:
      "Pro Gramer a tall lanky man with unruly hair. He wears round, wire-rimmed glasses and a black hoodie.",
    background:
      "Pro Gramer grew up in the bustling tech hub of Austin, Texas, where innovation thrived amidst local cafes and live music venues. Son to a software engineer and a novelist, Sebastian was exposed early on to a world where logical coding and imaginative storytelling converged. His weekends were spent at coding bootcamps, and his evenings buried in fantasy novels or playing the latest indie game. By the time he was 16, he had developed his first game, a simple quest that combined his love for Tolkien-esque lore with rudimentary AI. Opting out of the traditional college path, Sebastian chose to travel and learn from diverse tech communities globally, gathering a myriad of experiences and insights that would later fuel his ambition to revolutionize the gaming industry.",
    motivation:
      "His motivation stems from a profound belief that gaming can be more than just a pastime; it can be a deeply personal and transformative experience. He's driven by the idea that AI can craft a new frontier in gaming, where stories aren't just told but evolve dynamically based on player decisions. Recalling the sense of wonder he felt playing games as a child and the disappointment in predictable storylines as he grew older, Sebastian aims to create a world where every game session is as unpredictable and unique as life itself. He envisions a platform where players not only play a game but also co-create it, blending their choices with AI's imaginative prowess. For Sebastian, it's not just about entertainment; it's about pioneering a new age of storytelling and ensuring that each player's journey is genuinely their own.",
  },
  {
    image: "/sarah.png",
    name: "Lawyer Sarah Suit",
    class: "Sue everyone",
    genre: "Realistic",
    tone: "Serious",
    description:
      "Suit is a tall, lean woman with icy blue eyes and a sharp jawline. She wears a black suit with a white shirt and a red tie. She has a long, black ponytail and a stern expression.",
    background:
      "Earning her stripes at Northwestern University's School of Law, Sarah quickly rose through the ranks, distinguishing herself with her razor-sharp wit and a unique ability to dissect complex cases. Her name became synonymous with tenacity, as she championed cases ranging from corporate fraud to pro bono work for underserved communities. While her colleagues know her for her legendary closing statements, the world outside the courtroom admires Sarah for her collection of colorful, bespoke suits, each reflecting the vibrancy of her character and the spirit of her city.",
    motivation:
      "Sarah's primary motivation is to sue every single person in the world. She's a lawyer, and she's very good at it.",
  },
  {
    image: "/meatball.png",
    name: "Mr. Meatball",
    class: "Be the Biggest Meatball",
    genre: "Fantasy",
    tone: "Silly",
    description:
      "Mr. Meatball is a staggering 600ft tall giant meatball. He has short, stubby legs, a round body, and a large, smiling face. He wears a chef's hat.",
    background: `In the rolling valleys of the Fettuccine Foothills, a grand sorcerer chef, in an attempt to create the most delicious dish, accidentally combined rare magical herbs with a giant pot of meatball mixture. This arcane culinary experiment gave rise to Mr. Meatball. At first, the villagers were terrified, but Mr. Meatball's gentle nature and love for songs, dance, and good company made him a beloved figure in the region.

      Growing up wasn't easy for Mr. Meatball. Due to his size, he often felt isolated, accidentally causing minor tremors when he danced or laughed too hard. With time, he learned the art of being gentle, careful, and making sure his presence brought more joy than disruption.`,
    motivation:
      "Mr. Meatball desires nothing more than to spread joy, make friends, and perhaps, find a purpose big enough for his massive size. Although he's content with the occasional visit to nearby towns for festivals where he's the star attraction, he harbors a deep-seated wish to find others like him, or at least learn why he was brought into existence. Guided by his boundless curiosity, Mr. Meatball seeks adventure, hoping to uncover the deeper mysteries of his origin and to perhaps find a place where he truly fits in – both figuratively and literally.",
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
  <div className="">{children}</div>
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
  const { user } = useUser();
  return (
    <main id="main-container" className={cn("h-full ", font.className)}>
      <Head>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@GetSteamship" />
        <meta name="twitter:creator" content="@GetSteamship" />
        <meta property="og:url" content="https://ai-adventure.steamship.com" />
        <meta property="og:title" content="AI Adventure" />
        <meta
          property="og:description"
          content="Fantasy Unbounded. Let AI Be your Dungeon Master"
        />
        <meta property="og:image" content="/adventurer.png" />
      </Head>
      <MainCTA />
      <div className="relative flex-col pb-2 w-full h-1/2 bg-gradient-to-b text-center from-transparent via-background/50 to-background flex items-center justify-end">
        <div className="absolute right-4 top-4">
          <div className="flex gap-2 items-center justify-center">
            <Button asChild>
              <a
                href="https://github.com/steamship-packages/ai-adventure"
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
          <Link href="/character-creation">
            {user ? "Continue Your Journey" : "Create your Character"}
          </Link>
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
              title="Select a Character"
              subtitle="Pick from one of three templates"
            />
            <div className="grid grid-cols-1 md:grid-cols-3">
              {characters.map((character, i) => {
                const searchParams = new URLSearchParams();
                searchParams.set("genre", character.genre);
                searchParams.set("tone", character.tone);
                searchParams.set("background", character.background);
                searchParams.set("motivation", character.motivation);
                searchParams.set("description", character.description);
                searchParams.set("name", character.name);
                return (
                  <div key={i} className="p-6 w-full">
                    <a
                      href={`/character-creation?${searchParams.toString()}`}
                      className="flex h-full text-center w-full relative rounded-md aspect-[1/1] md:aspect-[1/1.5]  overflow-hidden border border-foreground/20 hover:border-indigo-500"
                      onClick={() => {
                        track("Character Selected", {
                          character: character.name,
                        });
                      }}
                    >
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
                    </a>
                  </div>
                );
              })}
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
        </div>
      </div>
    </main>
  );
}
