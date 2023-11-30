import Link from "next/link";
import PlayAsCharacterCard from "../adventures/play-character-card";
import Nav from "./nav";

export default function LandingHero() {
  return (
    <div className="bg-background">
      <Nav />
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
                    Where Imagination and AI Merge
                  </h1>
                  <p className="relative mt-6 text-lg leading-8 sm:max-w-md lg:max-w-none">
                    Step into a universe of player-crafted epics. Or, wield the
                    power of AI to script your own legendary saga.
                  </p>
                  <div className="mt-10 flex items-center gap-x-6">
                    <Link
                      href="/adventures"
                      style={{
                        transform: "translate(10px)",
                      }}
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Explore Adventures
                    </Link>
                  </div>
                </div>
                <div className="mt-14 flex justify-center gap-8 sm:-mt-36 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto hidden sm:block w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <div className="relative">
                      <PlayAsCharacterCard
                        characterName="Eldora"
                        adventureName="Mystic Blades of the Sorceress Guard"
                        image="/characters/eldora.png"
                        adventureDescription="A quest that combines magical prowess with martial
                        combat, where the wizard warrior must retrieve
                        ancient enchanted weapons to save her realm from a
                        dark sorcery."
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="w-40 sm:w-44 flex-none space-y-8 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <PlayAsCharacterCard
                        characterName="Gnome"
                        adventureName="Gizmos and Gadgets: The Great Tinkertown Heist"
                        image="/characters/gnome.png"
                        adventureDescription="A lighthearted, puzzle-filled escapade where the
                        gnome uses their wits and inventions to outsmart
                        rivals in a race to uncover a legendary gadget in
                        the heart of Tinkertown."
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <PlayAsCharacterCard
                        characterName="Space Person"
                        adventureName="Stars Beyond: The Orion Enigma"
                        image="/characters/space-person.png"
                        adventureDescription="A thrilling space opera, where the Galactic Operative travels across star systems, facing interstellar intrigue and unknown cosmic threats to unravel the mysteries of the Orion Enigma."
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="w-40 sm:w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <PlayAsCharacterCard
                        characterName="Detective"
                        adventureName="Shadows over Bridgetown: The Whispering Culprit"
                        image="/characters/detective.png"
                        adventureDescription="A gripping mystery where the detective unravels a series of cryptic clues leading to the heart of a deep conspiracy in the mist-covered streets of Bridgetown."
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <PlayAsCharacterCard
                        characterName="Zara"
                        adventureName="Lionheart's Roar: Quest for the Jungle Crown"
                        image="/characters/zara.png"
                        adventureDescription="A vibrant and humorous journey through a cartoon
                        jungle, where the lion girl overcomes various
                        challenges to find the mythical Jungle Crown and
                        become the queen of the wilds."
                      />
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
