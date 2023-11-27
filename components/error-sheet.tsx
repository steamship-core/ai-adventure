"use client";

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { recoilErrorModalState } from "./providers/recoil";
import { Button } from "./ui/button";
import { Sheet, SheetContent } from "./ui/sheet";
import { TypographyH3 } from "./ui/typography/TypographyH3";
import { TypographyH4 } from "./ui/typography/TypographyH4";
import { TypographyLarge } from "./ui/typography/TypographyLarge";
import { TypographyP } from "./ui/typography/TypographyP";

export const ErrorSheet = ({}: {}) => {
  const [error, setError] = useRecoilState(recoilErrorModalState);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (error) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [error]);

  const dismiss = () => {
    setError(undefined);
  };

  return (
    <Sheet open={open}>
      <SheetContent
        side="bottom"
        className="w-100% h-[100dvh] flex flex-col pb-4 overflow-y-auto"
      >
        <div className="flex flex-col gap-4 md:max-w-xl md:mx-auto">
          <div className="flex items-center justify-center flex-col w-full gap-2 relative">
            <TypographyH3>Uh oh..</TypographyH3>
            <TypographyLarge>We just hit a bump in the road.</TypographyLarge>
          </div>
          <div className="flex items-start justify-start flex-col w-full relative">
            {error?.title && (
              <>
                <TypographyH4 className="mt-4">Error Title</TypographyH4>
                <TypographyP className="mt-0">{error?.title}</TypographyP>
              </>
            )}
            {error?.message && (
              <>
                <TypographyH4 className="mt-4">Error Message</TypographyH4>
                <TypographyP className="mt-0">{error?.message}</TypographyP>
              </>
            )}
            {error?.details && (
              <>
                <TypographyH4 className="mt-4">Error Details</TypographyH4>
                <TypographyP className="mt-0">{error?.details}</TypographyP>
              </>
            )}
          </div>

          <Button className="mt-4 w-full" onClick={dismiss}>
            Dismiss
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
