export const dynamic = "force-static";

import EditorSection from "@/components/landing/editor-section";
import LandingFooter from "@/components/landing/footer";
import LandingHero from "@/components/landing/hero";
import OpenSource from "@/components/landing/open-source-section";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import prisma from "@/lib/db";
import { cn } from "@/lib/utils";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const font = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

const getFeaturedAdventures = async () =>
  prisma.adventure.findMany({
    where: {
      featured: true,
    },
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
  });

export default async function Home() {
  const featuredAdventures = await getFeaturedAdventures();

  return (
    <div
      id="main-container"
      className={cn("h-full flex flex-col", font.className)}
    >
      <LandingHero />
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Embark on Epic Journeys
          </h2>
          <TypographyMuted className="mt-6 text-lg leading-8">
            Dive into a treasure trove of player-crafted quests and sagas, where
            every story unfolds a new adventure. Experience the boundless
            creativity of a community that breathes life into diverse,
            enchanting worlds. From mystical lands to futuristic odysseys,
            discover adventures that spark your imagination and challenge your
            wits.
          </TypographyMuted>
          <ul className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {featuredAdventures.map((adventure) => (
              <li key={adventure.name} className="group rounded-2xl">
                <Link href={`/adventures/${adventure.id}`}>
                  <div className="aspect-[3/2] w-full rounded-2xl overflow-hidden relative group-hover:scale-105 transition-all">
                    <Image
                      className="object-cover"
                      src={adventure.image || "/adventurer.png"}
                      alt="Adventure Image"
                      fill
                      sizes="768px"
                    />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight">
                    {adventure.name}
                  </h3>
                  <TypographyMuted className="text-base leading-7">
                    {adventure.shortDescription}
                  </TypographyMuted>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <EditorSection />
      <OpenSource />
      <LandingFooter />
    </div>
  );
}
