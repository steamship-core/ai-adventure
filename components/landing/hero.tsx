"use client";
import { useUser } from "@clerk/nextjs";
import { MoveRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

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
        </div>
        <div className="flex items-center gap-2">
          <Button variant="link" asChild>
            <Link href="https://steamship.com/discord">
              <svg
                fill="currentColor"
                viewBox="0 -28.5 256 256"
                className="h-6 w-6"
              >
                <path
                  d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                  fillRule="nonzero"
                ></path>
              </svg>
            </Link>
          </Button>
          <Button variant={user ? "outline" : "link"}>
            <Link href={user ? "/adventures" : "/sign-in"} className="flex">
              {user ? (
                "Adventures"
              ) : (
                <>
                  Login <MoveRightIcon size={20} className="ml-2" />
                </>
              )}
            </Link>
          </Button>
        </div>
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
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-32 md:pt-36 sm:pt-60 lg:px-8 lg:pt-32">
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
                <div className="mt-14 flex justify-center gap-8 sm:-mt-36 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto hidden sm:block w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
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
                  <div className="w-40 sm:w-44 flex-none space-y-8 sm:pt-52 lg:pt-36">
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
                  <div className="w-40 sm:w-44 flex-none space-y-8 pt-32 sm:pt-0">
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
