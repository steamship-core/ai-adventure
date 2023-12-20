import Image from "next/image";
import Link from "next/link";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { GradientText } from "../ui/typography/gradient-text";
import SectionContainer from "./section-container";

export default function EditorSection() {
  return (
    <SectionContainer>
      <div className="overflow-hidden py-12">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start">
          <div className="lg:pr-4 lg:pt-4">
            <div className="lg:max-w-lg">
              <span className="text-base font-semibold leading-7 text-indigo-400">
                Craft your story
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight  sm:text-4xl">
                A robust <GradientText>adventure editor</GradientText>
              </h2>
              <TypographyMuted className="mt-6 text-lg leading-8">
                Create your own adventures with our powerful editor. Use our AI
                to generate a story, or write your own. Then, share your
                adventure with the world.
              </TypographyMuted>
              <div className="mt-8">
                <Link
                  href="/adventures/create"
                  className="inline-flex rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
          <div>
            <Image
              src="/editor-screenshot.png"
              alt="Product screenshot"
              className="h-[34rem] w-auto max-w-none rounded-xl shadow-xl shadow-muted ring-1 ring-gray-400/10 sm:h-[44rem]  sm:w-auto md:-ml-4 lg:ml-0"
              width={2432}
              height={1442}
            />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
