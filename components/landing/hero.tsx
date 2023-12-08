import Link from "next/link";
import PlayAsCharacterCard from "../adventures/play-character-card";
import Nav from "./nav";

const FeaturedCharacters = [
  {
    alt: "Bighead",
    title: "Rogue's Combinator",
    adventureId: "b5829716-c680-4b31-9b8d-128ef030aeda",
    description:
      "Found a company, raise capital, but watch out for your own greatest enemy: yourself",
    image:
      "https://api.steamship.com/api/v1/block/6B9545A8-B1B8-4017-A7C7-4F14A93E803F/raw",
  },
  {
    alt: "Scout the Explorer",
    title: "Paws of Honor",
    adventureId: "64515f03-d6e8-4e5a-870c-b70cc112783a",
    description:
      "Adventure with your animal companions to become the Goodest Boy.",
    image:
      "https://ywo4zgeb2hydwgmk.public.blob.vercel-storage.com/f961185e-be73-4d50-b69f-beef09979206-f671acd7-bc7a-40ec-afa9-d7689afc0bad-steamshipmax_The_image_features_a_picturesque_fantasy_medieval__7869fce2-9260-4612-adae-a2a27e25258f-YAoz38dAZrJvcwKwpKuxxqiTbhotga.png",
  },
  {
    alt: "Mr. Meatball",
    title: "Mr. Meatball's Saucy Escape",
    adventureId: "48113aac-1560-47b2-ba49-37bd196a0f00",
    description:
      "Mr. Meatball finds himself accidentally rolled out of the kitchen of a busy Italian restaurant and must navigate his way back while avoiding hungry pets, cleaning obstacles, and the perilous outdoors.",
    image:
      "https://ywo4zgeb2hydwgmk.public.blob.vercel-storage.com/48113aac-1560-47b2-ba49-37bd196a0f00-5eb0a62b-cc82-415b-884b-3afdf8601137-steamshipmax_a_cartoon_meatball_with_legs_and_arms_in_an_italia_a83b27d5-a387-4bf5-83b4-3a169e6bcc3a-HZpIACMaqug002MG9kOD4k3yAgfPso.png",
  },
  {
    alt: "Christine",
    title: "Evil Science",
    adventureId: "d1bc9af7-9e32-470b-b1e6-7513f784fa99",
    description: "Just another day in the lab.. trying to take over the world.",
    image:
      "https://ywo4zgeb2hydwgmk.public.blob.vercel-storage.com/d1bc9af7-9e32-470b-b1e6-7513f784fa99-3a4bfb93-51da-4ac5-8382-348d130aec11-00026-3364392659-4xaddWFkgXrCjvIl6AQk6Pe7nXuPEw.png",
  },
  {
    alt: "Sir Reginald Honeywhisker",
    title: "The Unbearable Curse of Bear-ness",
    adventureId: "c44ba9fb-cd76-48e3-ba70-c936417eef67",
    description:
      "A curse has turned an entire town into bears.. What will you do?",
    image:
      "https://ywo4zgeb2hydwgmk.public.blob.vercel-storage.com/f961185e-be73-4d50-b69f-beef09979206-2eaa99b8-16ed-474f-a87b-7edb93bc9925-steamshipmax_a_quaint_town_where_all_the_inhabitants_are_bears__04c4eb77-d509-4cf9-be39-1d725bf850a5-TLUS3q0AUPoA9DKhwFSMapfNfN5gVH.png",
  },
];

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
                  <h2 className="relative mt-6 text-lg leading-8 sm:max-w-md lg:max-w-none">
                    Step into a universe of player-crafted epics. Or, wield the
                    power of AI to script your own legendary saga.
                  </h2>
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
                      <PlayAsCharacterCard {...FeaturedCharacters[0]} />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="w-40 sm:w-44 flex-none space-y-8 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <PlayAsCharacterCard {...FeaturedCharacters[1]} />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <PlayAsCharacterCard {...FeaturedCharacters[2]} />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="w-40 sm:w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <PlayAsCharacterCard {...FeaturedCharacters[3]} />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <PlayAsCharacterCard {...FeaturedCharacters[4]} />
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
