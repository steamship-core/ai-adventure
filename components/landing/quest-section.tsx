import prisma from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { PinContainer } from "../ui/3d-pin";
import { TypographyH4 } from "../ui/typography/TypographyH4";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { GradientText } from "../ui/typography/gradient-text";
import SectionContainer from "./section-container";

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

export default async function QuestSection() {
  const featuredAdventures = await getFeaturedAdventures();

  return (
    <SectionContainer>
      <div>
        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-center">
          Embark on <GradientText>Epic Journeys</GradientText>
        </h2>
        <TypographyMuted className="mt-6 text-lg leading-8 text-center max-w-3xl mx-auto">
          Dive into a treasure trove of player-crafted quests and sagas, where
          every story unfolds a new adventure. Experience the boundless
          creativity of a community that breathes life into diverse, enchanting
          worlds. From mystical lands to futuristic odysseys, discover
          adventures that spark your imagination and challenge your wits.
        </TypographyMuted>
        <ul className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {featuredAdventures.map((adventure) => (
            <li key={adventure.name} className="group rounded-2xl">
              <div className="flex md:hidden flex-col">
                <TypographyH4>{adventure.name}</TypographyH4>
                <TypographyMuted className="line-clamp-3">
                  {adventure.shortDescription}
                </TypographyMuted>
              </div>
              <PinContainer
                title={adventure.name}
                href={`/adventures/${adventure.id}`}
              >
                <Link href={`/adventures/${adventure.id}`}>
                  <div className="aspect-[3/2] h-full rounded-2xl overflow-hidden relative group-hover:scale-105 transition-all">
                    <Image
                      className="object-cover"
                      src={adventure.image || "/adventurer.png"}
                      alt="Adventure Image"
                      fill
                      sizes="768px"
                    />
                  </div>
                </Link>
              </PinContainer>
            </li>
          ))}
        </ul>
      </div>
    </SectionContainer>
  );
}
