import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ActivityIcon } from "lucide-react";
import { log } from "next-axiom";
import { TypographySmall } from "../ui/typography/TypographySmall";

export const SummaryStats = async () => {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }
  const energy = await prisma.userEnergy.findFirst({
    where: {
      userId,
    },
  });

  return (
    <div className="flex flex-col items-end gap-2" id="stats">
      <TypographySmall className="flex items-center">
        <ActivityIcon size={16} className="mr-2 text-indigo-400" />
        {energy?.energy || 0}
      </TypographySmall>
    </div>
  );
};
