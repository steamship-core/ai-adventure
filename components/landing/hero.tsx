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
      "https://ai-adventure.steamship.com/_next/image?url=%2Fexamples%2Fbighead.png&w=3840&q=75",
  },
  {
    alt: "Scout the Explorer",
    title: "Paws of Honor",
    adventureId: "64515f03-d6e8-4e5a-870c-b70cc112783a",
    description:
      "Adventure with your animal companions to become the Goodest Boy.",
    image:
      "https://ai-adventure.steamship.com/_next/image?url=https%3A%2F%2Fywo4zgeb2hydwgmk.public.blob.vercel-storage.com%2Ff961185e-be73-4d50-b69f-beef09979206-57ff4ceb-6b62-47d9-904b-df5f2d94f13b-DALL%25C2%25B7E%25202023-11-16%252017.24.49%2520-%2520A%2520playful%2520and%2520adventurous%2520dog%2C%2520resembling%2520a%2520Beagle%2C%2520with%2520alert%2C%2520bright%2520eyes%2520and%2520a%2520joyful%2520demeanor.%2520This%2520dog%2520sports%2520a%2520colorful%2520kerchief%2520around%2520its%2520neck-3xWDwxkrmxsLt5fj8YKBTeu90Wy6mm.png&w=3840&q=75",
  },
  {
    alt: "Mr. Meatball",
    title: "Mr. Meatball's Saucy Escape",
    adventureId: "48113aac-1560-47b2-ba49-37bd196a0f00",
    description:
      "Mr. Meatball finds himself accidentally rolled out of the kitchen of a busy Italian restaurant and must navigate his way back while avoiding hungry pets, cleaning obstacles, and the perilous outdoors.",
    image:
      "https://ai-adventure.steamship.com/_next/image?url=https%3A%2F%2Fywo4zgeb2hydwgmk.public.blob.vercel-storage.com%2F48113aac-1560-47b2-ba49-37bd196a0f00-5eb0a62b-cc82-415b-884b-3afdf8601137-steamshipmax_a_cartoon_meatball_with_legs_and_arms_in_an_italia_a83b27d5-a387-4bf5-83b4-3a169e6bcc3a-HZpIACMaqug002MG9kOD4k3yAgfPso.png&w=1920&q=75",
  },
  {
    alt: "Christine",
    title: "Evil Science",
    adventureId: "d1bc9af7-9e32-470b-b1e6-7513f784fa99",
    description: "Just another day in the lab.. trying to take over the world.",
    image:
      "https://ai-adventure.steamship.com/_next/image?url=https%3A%2F%2Fywo4zgeb2hydwgmk.public.blob.vercel-storage.com%2Fd1bc9af7-9e32-470b-b1e6-7513f784fa99-8269ad03-6d70-443c-a2dd-102eac67e5b1-00004-1233466080-ZeL2u8Prlpob0nlgBgHNeHphG4L5oo.png&w=3840&q=75",
  },
  {
    alt: "Sir Reginald Honeywhisker",
    title: "The Unbearable Curse of Bear-ness",
    adventureId: "c44ba9fb-cd76-48e3-ba70-c936417eef67",
    description:
      "A curse has turned an entire town into bears.. What will you do?",
    image:
      "https://ai-adventure.steamship.com/_next/image?url=https%3A%2F%2Fywo4zgeb2hydwgmk.public.blob.vercel-storage.com%2Ff961185e-be73-4d50-b69f-beef09979206-059176b0-f1d8-435f-9769-2afb16ed386e-DALL%25C2%25B7E%25202023-11-10%252012.19.54%2520-%2520A%2520large%2C%2520fluffy%2520bear%2520dressed%2520in%2520a%2520knight%27s%2520armor%2C%2520struggling%2520to%2520hold%2520a%2520tiny%2520sword%2520and%2520shield%2520with%2520his%2520large%2C%2520bear%2520paws.%2520The%2520bear%2520has%2520an%2520expression%2520of%2520-1hYtf2KuEuFH2t2nk2oM6YQ5Ceqcu6.png&w=3840&q=75",
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
