import InventorySheet from "@/components/inventory-sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import prisma from "@/lib/db";
import { UserButton, auth } from "@clerk/nextjs";
import {
  ActivityIcon,
  BadgeDollarSignIcon,
  CompassIcon,
  FootprintsIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const ContentBox = ({ children }: { children: ReactNode }) => (
  <div>
    <div className="bg-background/50 px-4 py-2 rounded-sm">{children}</div>
  </div>
);

export default async function CampPages() {
  const { userId } = auth();

  const agent = await prisma.agents.findFirst({
    where: {
      ownerId: userId!,
    },
  });

  if (!agent) {
    redirect("/play/character-creation");
  }

  return (
    <main className="h-[100dvh] p-2 md:p-6 pt-0 relative">
      <Image
        fill
        sizes="100vw"
        src="/campfire.png"
        alt="background"
        className="object-cover -z-10"
      />
      <div className="h-full flex flex-col">
        <div className="w-full flex items-center justify-end pt-6 pb-2 gap-3 max-w-5xl w-full mx-auto">
          <Button variant="link" size="sm" asChild>
            <Link
              target="_blank"
              href="https://github.com/steamship-core/ai-adventure"
            >
              <StarIcon className="w-4 h-4 mr-2" /> Star
            </Link>
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
        <div className="flex flex-col flex-grow justify-between max-w-5xl w-full mx-auto">
          <ContentBox>
            <div className="flex justify-between">
              <div className="flex gap-4">
                <div className="rounded-full overflow-hidden h-8 w-8 md:h-18 md:w-18 border border-yellow-600 shadow-sm shadow-primary">
                  <Image
                    src={"/orc.png"}
                    height={1024}
                    width={1024}
                    alt="Character"
                  />
                </div>
                <div className="w-28 sm:w-44 lg:w-56">
                  <TypographyLarge>Sir Orc</TypographyLarge>
                  <Progress
                    value={33}
                    className="h-2 border border-foreground/20"
                  />
                  <TypographyMuted>Explorer</TypographyMuted>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <TypographySmall className="flex items-center">
                  <ActivityIcon size={16} className="mr-2 text-indigo-400" />
                  100/100
                </TypographySmall>
                <TypographySmall className="flex items-center">
                  <BadgeDollarSignIcon
                    size={16}
                    className="mr-2 text-yellow-400"
                  />
                  100
                </TypographySmall>
              </div>
            </div>
          </ContentBox>
          <ContentBox>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/play/quest/1">
                  <CompassIcon className="mr-2" size={16} />
                  Go on an adventure
                </Link>
              </Button>
              <Button variant="outline">
                <FootprintsIcon className="mr-2" size={16} />
                Send on an adventure
              </Button>
              <InventorySheet buttonText="View Inventory" />
            </div>
          </ContentBox>
        </div>
      </div>
    </main>
  );
}
