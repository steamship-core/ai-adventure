import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main
      className="flex h-[100dvh] flex-col items-center justify-center p-6 md:p-24 relative"
      id="main-container"
    >
      <UserButton afterSignOutUrl="/" />
      <TypographyH1>AI Adventure</TypographyH1>
      <Button asChild>
        <Link href="/play">Get Started</Link>
      </Button>
    </main>
  );
}
