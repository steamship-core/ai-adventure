import { Adventure } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { TypographySmall } from "../ui/typography/TypographySmall";

const Element = ({ adventure }: { adventure: Adventure }) => (
  <>
    <div className="relative aspect-video ">
      <Image src={adventure.image || "/adventurer.png"} fill alt="Adventurer" />
    </div>
    <div className="py-2 px-4 flex flex-col">
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
  </>
);

const AdventureListElement = ({
  adventure,
  link = true,
}: {
  adventure: Adventure;
  link?: boolean;
}) => {
  if (link) {
    return (
      <Link
        href={`/adventures/${adventure.id}`}
        className="rounded-md border-foreground/20 border overflow-hidden hover:border-indigo-600"
      >
        <Element adventure={adventure} />{" "}
      </Link>
    );
  }
  return (
    <div className="h-full text-left rounded-md border-foreground/20 border overflow-hidden hover:border-indigo-600">
      <Element adventure={adventure} />{" "}
    </div>
  );
};

export default AdventureListElement;
