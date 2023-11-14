import Link from "next/link";
import { TypographyMuted } from "../ui/typography/TypographyMuted";

export default function EditorSection() {
  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start">
          <div className="lg:pr-4 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-indigo-400">
                Craft your story
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight  sm:text-4xl">
                A robust adventure editor
              </p>
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
              <figure className="mt-16 border-l border-gray-200 pl-8 text-gray-600">
                <blockquote className="text-base leading-7">
                  <p>
                    “Vel ultricies morbi odio facilisi ultrices accumsan donec
                    lacus purus. Lectus nibh ullamcorper ac dictum justo in
                    euismod. Risus aenean ut elit massa. In amet aliquet eget
                    cras. Sem volutpat enim tristique.”
                  </p>
                </blockquote>
                <figcaption className="mt-6 flex gap-x-4 text-sm leading-6">
                  <img
                    src="https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
                    alt=""
                    className="h-6 w-6 flex-none rounded-full"
                  />
                  <div>
                    <span className="font-semibold text-gray-900">
                      Maria Hill
                    </span>{" "}
                    – Marketing Manager
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
          <img
            src="/editor-screenshot.png"
            alt="Product screenshot"
            className="max-w-none rounded-xl shadow-xl shadow-muted ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:ml-0"
            width={2432}
            height={1442}
          />
        </div>
      </div>
    </div>
  );
}
