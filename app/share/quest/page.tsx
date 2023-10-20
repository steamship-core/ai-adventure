"use client";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyH3 } from "@/components/ui/typography/TypographyH3";
import { TypographyP } from "@/components/ui/typography/TypographyP";
import Head from "next/head";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

export default function ShareQuest() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const itemUrl = searchParams.get("itemUrl");
  const name = searchParams.get("name");
  const itemName = searchParams.get("itemName");
  const pathname = usePathname();
  console.log(
    `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}?${searchParams.toString()}`
  );

  return (
    <>
      <Head>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@GetSteamship" />
        <meta name="twitter:creator" content="@GetSteamship" />
        <meta
          property="og:url"
          content={`${
            process.env.NEXT_PUBLIC_BASE_URL
          }${pathname}?${searchParams.toString()}`}
        />
        <meta property="og:title" content={title!} />
        <meta property="og:description" content={description!} />
        <meta property="og:image" content={itemUrl!} />
      </Head>
      <div className="max-w-lg mx-auto flex justify-center items-center h-full">
        <div className="flex flex-col gap-2">
          <div>
            <TypographyH1>A quest by {name}</TypographyH1>
            <TypographyH3 className="mt-4">{title}</TypographyH3>
            <TypographyP>{description}</TypographyP>
            <TypographyP>
              On their adventure, they found something incredible:
            </TypographyP>
          </div>
          <div className="mt-4">
            <TypographyH3 className="mb-2">{itemName}</TypographyH3>
            <div className="w-44">
              <Image alt="Quest Item" src={itemUrl!} height={512} width={512} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
