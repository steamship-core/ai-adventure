import prisma from "@/lib/db";

const Stat = ({ title, value }: { title: string; value: number }) => {
  if (value === 0) return null;
  return (
    <div className="flex gap-2 rounded-md px-4 py-2 items-center bg-gradient-to-br from-muted/50 to-transparent">
      <div className="flex flex-col">
        <div className="w-full text-center">
          <b>{value}</b>
        </div>
        <span className="text-sm text-muted-foreground">{title}</span>
      </div>
    </div>
  );
};

export const AdventureStats = async ({
  adventureId,
}: {
  adventureId: string;
}) => {
  const adventuresPlayed = await prisma.agents.count({
    where: {
      adventureId,
    },
  });

  const snippets = await prisma.narrativeSnippet.count({
    where: {
      adventureId,
    },
  });

  const reactions = await prisma.reactions.count({
    where: {
      adventureId,
    },
  });
  return (
    <div className="flex gap-2">
      <Stat title="Total plays" value={adventuresPlayed} />
      <Stat title="Snippets saved" value={snippets} />
      <Stat title="Reactions" value={reactions} />
    </div>
  );
};
