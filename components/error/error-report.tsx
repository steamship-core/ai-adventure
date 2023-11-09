"use client";

import { TypographyH2 } from "@/components/ui/typography/TypographyH2";
import { TypographyP } from "@/components/ui/typography/TypographyP";
import Link from "next/link";

import { useSearchParams } from "next/navigation";

const ErrorReport = () => {
  const searchParams = useSearchParams();
  const whatHappened = searchParams.get("whatHappened");
  let whatYouCanDo = searchParams.get("whatYouCanDo");
  let technicalDetails = searchParams.get("technicalDetails");

  if (!technicalDetails) {
    technicalDetails = "No technical details were available.";
  }

  try {
    let j = JSON.parse(technicalDetails);
    technicalDetails = JSON.stringify(j, null, 2);
  } catch {}

  return (
    <>
      {whatHappened && (
        <>
          <TypographyH2>What happened</TypographyH2>
          <TypographyP>{whatHappened}</TypographyP>
          <br />
        </>
      )}
      <>
        <TypographyH2>What you can do</TypographyH2>
        {whatYouCanDo && <TypographyP>{whatYouCanDo}</TypographyP>}
        <TypographyP>
          It is always helpful to report it to us in our{" "}
          <Link href="https://steamship.com/discord">Discord</Link>
        </TypographyP>
        <br />
      </>
      {technicalDetails && (
        <>
          <TypographyH2>Technical Details</TypographyH2>
          <p className="mt-2">{technicalDetails}</p>
          <br />
        </>
      )}
    </>
  );
};

export default ErrorReport;
