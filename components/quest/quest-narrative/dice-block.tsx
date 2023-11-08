import { recoilContinuationState } from "@/components/providers/recoil";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { Block } from "@/lib/streaming-client/src";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { BlockContainer } from "./block-container";

const RollingDie = ({
  required,
  rolled,
  success,
  disableAnimation,
}: {
  required: number;
  rolled: number;
  success: boolean;
  disableAnimation: boolean;
}) => {
  const [num, setNum] = useState(disableAnimation ? rolled : 1);
  const [showStatus, setShowStatus] = useState(
    disableAnimation ? required > rolled : false
  );
  const [, setContinuationState] = useRecoilState(recoilContinuationState);

  useEffect(() => {
    if (disableAnimation) {
      return;
    }
    const interval = setInterval(() => {
      setNum(Math.floor(Math.random() * 20) + 1);
    }, 50);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setNum(rolled);
      setContinuationState(true);
    }, 2000);
    const statusTimeout = setTimeout(() => {
      setShowStatus(true);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      clearTimeout(statusTimeout);
    };
  }, []);

  return (
    <BlockContainer className="flex flex-col items-center justify-center">
      <TypographyLarge>Dice Roll</TypographyLarge>
      <TypographyMuted className="font-bold">
        Required: {required}
      </TypographyMuted>
      <div className="relative bg-foreground rounded-md mt-2 h-20 aspect-square text-center flex items-center justify-center">
        <TypographyLarge className="text-6xl text-background">
          {num}
        </TypographyLarge>
        {showStatus && !success && (
          <div className="w-full absolute top-0 left-0 bg-background/40 h-full flex items-center justify-center">
            <XIcon className="text-red-600" size={50} />
          </div>
        )}
      </div>
    </BlockContainer>
  );
};

export const DiceRollBlock = ({
  block,
  disableAnimation,
}: {
  block: Block;
  disableAnimation: boolean;
}) => {
  let resultJson = null;
  try {
    resultJson = JSON.parse(block.text!) as {
      required: number;
      rolled: number;
      success: boolean;
    };
  } catch (e) {
    return null;
  }

  if (!resultJson) {
    return null;
  }

  const required = Math.floor(resultJson.required * 20) + 1;
  const rolled = Math.floor(resultJson.rolled * 20) + 1;

  return (
    <RollingDie
      required={required}
      rolled={rolled}
      success={resultJson.success}
      disableAnimation={disableAnimation}
    />
  );
};
