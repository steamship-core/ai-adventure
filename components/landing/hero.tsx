"use client";
import { useUser } from "@clerk/nextjs";
import { MoveRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { TypographyLarge } from "../ui/typography/TypographyLarge";

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="group relative aspect-[2/3] w-full rounded-xl bg-gray-900/5 overflow-hidden shadow-lg">
    {children}
  </div>
);

const CardDescription = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="absolute bottom-0 left-0 w-full">
    <div className="backdrop-blur-sm p-2 bg-background/40 text-xs">
      <div className="font-bold">{title}</div>
      <div className="h-0 group-hover:mt-2 group-hover:h-[13rem] transition-all invisible group-hover:visible">
        {description}
      </div>
    </div>
  </div>
);

export default function LandingHero() {
  const { user } = useUser();

  return (
    <div className="bg-background">
      <nav className="w-full flex justify-between px-4 md:px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <Image
            src="/android-chrome-512x512.png"
            width={42}
            height={42}
            alt="Steamship Logo"
          />
          <TypographyLarge>AI Adventure</TypographyLarge>
        </div>
        <Button variant="link">
          <Link href={user ? "/adventures" : "/sign-in"} className="flex">
            {user ? (
              "View Adventures"
            ) : (
              <>
                Login <MoveRightIcon size={20} className="ml-2" />
              </>
            )}
          </Link>
        </Button>
      </nav>
      <main>
        <div className="relative isolate">
          <div
            className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
            aria-hidden="true"
          >
            <div
              className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
              }}
            />
          </div>
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <h1 className="text-4xl font-bold tracking-tigh md:text-6xl">
                    Where AI and Imagination Merge
                  </h1>
                  <p className="relative mt-6 text-lg leading-8 sm:max-w-md lg:max-w-none">
                    Step into a universe of player-crafted epics. Or, wield the
                    power of AI to script your own legendary saga.
                  </p>
                  <div className="mt-10 flex items-center gap-x-6">
                    <Link
                      href="/adventures"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Explore Adventures
                    </Link>
                  </div>
                </div>
                <div className="mt-14 flex justify-end gap-8 sm:-mt-36 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <div className="relative">
                      <Card>
                        <Image
                          src="/characters/eldora.png"
                          alt="Eldora"
                          fill
                          className="object-cover"
                        />
                        <CardDescription
                          title="Mystic Blades of the Sorceress Guard"
                          description=" A quest that combines magical prowess with martial
                              combat, where the wizard warrior must retrieve
                              ancient enchanted weapons to save her realm from a
                              dark sorcery."
                        />
                      </Card>
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <Card>
                        <Image
                          src="/characters/gnome.png"
                          alt="Gnome"
                          fill
                          className="object-cover"
                        />
                        <CardDescription
                          title="Gizmos and Gadgets: The Great Tinkertown Heist"
                          description="A lighthearted, puzzle-filled escapade where the
                              gnome uses their wits and inventions to outsmart
                              rivals in a race to uncover a legendary gadget in
                              the heart of Tinkertown."
                        />
                      </Card>
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <Card>
                        <Image
                          src="/characters/space-person.png"
                          alt="Space Person"
                          fill
                          className="object-cover"
                        />
                        <CardDescription
                          title="Stars Beyond: The Orion Enigma"
                          description="A thrilling space opera, where the Galactic Operative travels across star systems, facing interstellar intrigue and unknown cosmic threats to unravel the mysteries of the Orion Enigma."
                        />
                      </Card>
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <Card>
                        <Image
                          src="/characters/detective.png"
                          alt="Detective"
                          fill
                          className="object-cover"
                        />
                        <CardDescription
                          title="Shadows over Bridgetown: The Whispering Culprit"
                          description="A gripping mystery where the detective unravels a series of cryptic clues leading to the heart of a deep conspiracy in the mist-covered streets of Bridgetown."
                        />
                      </Card>
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <Card>
                        <Image
                          src="/characters/zara.png"
                          alt="Zara"
                          fill
                          className="object-cover"
                        />
                        <CardDescription
                          title="Lionheart's Roar: Quest for the Jungle Crown"
                          description="A vibrant and humorous journey through a cartoon
                              jungle, where the lion girl overcomes various
                              challenges to find the mythical Jungle Crown and
                              become the queen of the wilds."
                        />
                      </Card>
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
