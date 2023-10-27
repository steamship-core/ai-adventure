"use client";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyH3 } from "@/components/ui/typography/TypographyH3";
import { TypographyP } from "@/components/ui/typography/TypographyP";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function SharedQuest() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const itemImage = searchParams.get("itemImage");
  const name = searchParams.get("name");
  const itemName = searchParams.get("itemName") as string;

  return (
    <>
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
              <Image
                alt="Quest Item"
                src={itemImage || ""}
                height={512}
                width={512}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
