import ErrorReport from "@/components/error/error-report";
import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import Image from "next/image";
import Link from "next/link";

export default async function ErrorPage({ params }: { params: {} }) {
  return (
    <main className="w-full h-full">
      <div className="h-full flex flex-col justify-between max-w-xl mx-auto p-6 gap-2 overflow-auto">
        <div className="flex flex-col gap-2 h-[80%] overflow-hidden">
          <Image
            src={"/error-message.png"}
            width={728}
            height={416}
            alt="Adventurer"
            className="rounded-xl"
          />
          <TypographyH1>An error occurred..</TypographyH1>
          <Button asChild className="mt-8">
            <Link href="/adventures">Go back home</Link>
          </Button>
          <br />
          <ErrorReport />
        </div>
      </div>
    </main>
  );
}
