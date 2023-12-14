import { TypographyH2 } from "@/components/ui/typography/TypographyH2";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import prisma from "@/lib/db";
import { Tags } from "@prisma/client";

// set Adventure to features in SQL
export default async function AdventurePage({
  params,
}: {
  params: { tagName: string };
}) {
  const tags: Tags[] = (await prisma.tags.findMany({
    orderBy: {
      name: "asc",
    },
  })) as Tags[];

  return (
    <div className="flex flex-col gap-6 p-4 px-4 md:px-6 py-8">
      <div className="flex flex-col justify-between">
        <TypographyH2 className="border-none">Tags</TypographyH2>
        <TypographyMuted className="text-lg">
          Click on a tag to browse adventures
        </TypographyMuted>
      </div>
      {tags ? (
        <ul>
          {tags.map((tag: Tags) => {
            return (
              <li key={tag.name}>
                <a
                  className="underline"
                  href={`/adventures/tagged/${tag.name}`}
                >
                  {tag.name}
                </a>{" "}
                ({tag.count})
              </li>
            );
          })}
        </ul>
      ) : (
        <div>No tags yet!</div>
      )}
    </div>
  );
}
