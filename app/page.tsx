"use client";
import { MainCTA } from "@/components/landing/header";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/typography/TypographyH2";
import { TypographyH3 } from "@/components/ui/typography/TypographyH3";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
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
    genre: "Fantasy",
    tone: "Serious",
    description:
      "Eldora has shimmering silver hair that cascades down to her mid-back, and her eyes are a striking shade of violet. Her fair skin is almost luminescent under the moonlight. She wears an intricately designed robe with embroidered runes, and she's often seen with a staff that has a crystal orb atop, filled with a swirling blue mist.",
    background:
      "Eldora comes from the hidden city of Lumeria, built atop the ancient trees of the Whispering Forest. She's well versed in ancient magics and protective spells. Eldora is on a quest to find and restore the lost artifacts of her ancestors that were stolen from her city.",
    motivation:
      "Eldora is driven by a deep-seated need to restore her ancestral artifacts, as they not only hold significant historical importance to her people but also provide the key to preserving the balance of magic in the Whispering Forest. To Eldora, the artifacts represent her lineage, her connection to the ancient wisdom of the High Elves, and the protection of her homeland. The theft of these artifacts not only disrupted the serenity of Lumeria but threatened the very existence of the magical creatures and the forest's sanctity. She feels a personal responsibility to retrieve them and restore harmony.",
  },
  {
    image: "/kael.png",
    name: "Kael Xyron",
    class: "Bounty Hunter",
    genre: "Futuristic",
    tone: "Serious",
    description:
      "Kael has a lean build, with one mechanical arm and an ocular implant that gives him enhanced targeting and vision. His attire is a mix of durable synthetic fabrics and armored plates, and he sports a cloak that has in-built stealth tech.",
    background:
      "Originally a soldier in the Intergalactic Federation, Kael suffered severe injuries in an ambush. After being revived and enhanced with cybernetic parts, he became a bounty hunter. Now, he travels between galaxies, capturing fugitives and occasionally getting involved in larger conspiracies.",
    motivation:
      "Before his transformation into a cyborg, Kael had a sense of duty and purpose serving the Intergalactic Federation. Post his cybernetic enhancement, he struggled with his identity, feeling like he no longer belonged to the world of the organic or the mechanical. By becoming a bounty hunter, he initially sought a way to channel his skills and find a new purpose. However, deeper down, Kael hopes that by helping maintain order in the galaxies and pursuing justice, even in this grey profession, he can find redemption for the perceived loss of his humanity and past mistakes.",
  },
  {
    image: "/nox.png",
    name: "Nox Umbra",
    class: "Keeper of Secrets",
    genre: "Mystery",
    tone: "Serious",
    description:
      "Nox is cloaked in shadows, with only his pale hands and a hint of his face visible beneath his hooded cloak. His eyes are like bottomless pits, revealing nothing yet seeing everything.",
    background:
      "No one knows where Nox comes from or what his true intentions are. He's often seen at crossroads, graveyards, and places of power. Rumors say he collects secrets and stories from those he encounters, trading them for knowledge or artifacts of power.",
    motivation:
      "Nox is an enigma, driven by an insatiable thirst for the unknown, the forgotten, and the hidden. To him, knowledge is power, but not in the way most perceive. He doesn't seek power to control or dominate but rather to understand the intricacies of existence, realms, and the universe's darkest mysteries. Every secret he acquires, every story he collects, adds to his vast library of esoteric wisdom. He believes that with enough knowledge, he might unlock an even greater mystery that has eluded beings for eons—perhaps the nature of existence itself or a truth that binds all realms.",
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
      <MainCTA />
      <div className="relative flex-col pb-2 w-full h-1/2 bg-gradient-to-b text-center from-transparent via-background/50 to-background flex items-center justify-end">
        <div className="absolute right-4 top-4">
          <UserButton />
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
          <Link href="/play">
            {user ? "Continute Your Journey" : "Create your Character"}
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
