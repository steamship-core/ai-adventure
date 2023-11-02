import { Adventure } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { TypographySmall } from "../ui/typography/TypographySmall";

const AdventureListElement = ({ adventure }: { adventure: Adventure }) => (
  <Link
    href={`/adventures/${adventure.id}`}
    className="rounded-md border-foreground/20 border overflow-hidden hover:border-indigo-600"
  >
    <div className="relative aspect-video ">
      <Image src={adventure.image || "/adventurer.png"} fill alt="Adventurer" />
    </div>
    <div className="pb-2 px-4 flex flex-col">
      <div>
        <TypographySmall className="text-muted-foreground">
          Quest
        </TypographySmall>
        <TypographyLarge>{adventure.name || "Epic Quest"}</TypographyLarge>
      </div>
      <div>
        <TypographySmall className="text-muted-foreground">
          Description
        </TypographySmall>
        <TypographyLarge className="line-clamp-3">
          {adventure.shortDescription}
        </TypographyLarge>
      </div>
    </div>
  </Link>
);

export default AdventureListElement;
