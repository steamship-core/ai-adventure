import { recoilContinuationState } from "@/components/providers/recoil";
import { TypographyH4 } from "@/components/ui/typography/TypographyH4";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { Block } from "@/lib/streaming-client/src";
import { cn } from "@/lib/utils";
import { Player } from "@lottiefiles/react-lottie-player";
import { PointerIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
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
  const [doneRolling, setDoneRolling] = useState(
    disableAnimation ? true : false
  );
  const [clickedRollDie, setClickedRollDie] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const [, setContinuationState] = useRecoilState(recoilContinuationState);

  useEffect(() => {
    if (!disableAnimation) {
      setContinuationState(false);
    }
  }, []);

  const rollDie = () => {
    if (doneRolling) return;
    const interval = setInterval(() => {
      setNum(Math.floor(Math.random() * 20) + 1);
    }, 50);
    setClickedRollDie(true);
    setTimeout(() => {
      clearInterval(interval);
      setNum(rolled);
      setShowSuccessAnimation(rolled >= required);
      setContinuationState(true);
      setDoneRolling(true);
    }, 2000);
    setTimeout(() => {
      setShowStatus(true);
    }, 3000);
  };

  const isTwenty = num === 20 && rolled === 20;
  const isOne = num === 1 && rolled === 1;

  return (
    <BlockContainer
      className="flex flex-col items-center justify-center py-8"
      noTransform={num === 20}
    >
      <TypographyH4>Dice Roll</TypographyH4>
      <TypographyMuted className="text-center">
        Click on the die to roll!
        <br />
        You must roll a <b>{required} or higher </b> to succeed.
      </TypographyMuted>
      <button
        className={cn(
          "relative rounded-md mt-2 aspect-square text-center flex items-center justify-center py-2 hover:cursor-pointer"
        )}
        disabled={clickedRollDie || disableAnimation}
        onClick={() => {
          rollDie();
        }}
      >
        <DTwenty
          className={cn(
            "h-56 w-56 fill-white",
            isTwenty && doneRolling && "fill-cyan-500",
            isOne && doneRolling && "fill-red-500"
          )}
        />

        {!clickedRollDie && !disableAnimation && (
          <div className="absolute -z-20 h-3/4 aspect-square rounded-full bg-indigo-600 m-auto left-0 right-0 top-0 bottom-0 animate-ping duration-2000" />
        )}
        <TypographyLarge
          className={cn(
            "text-4xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-2",
            isTwenty && doneRolling && "text-cyan-500",
            isOne && doneRolling && "text-red-500"
          )}
        >
          {num}
        </TypographyLarge>
        {showStatus && !success && (
          <div className="w-full absolute top-0 left-0 bg-background/40 h-full flex items-center justify-center">
            <XIcon className="text-red-600" size={50} />
          </div>
        )}
      </button>
      {!clickedRollDie && !disableAnimation && (
        <div className="absolute bottom-0 animate-bounce duration-2000">
          <PointerIcon />
        </div>
      )}
      {showSuccessAnimation && (
        <div className="absolute">
          <Player
            autoplay
            loop={false}
            src="/success-lottie.json"
            className="h-72 w-72"
            keepLastFrame
          />
        </div>
      )}
      {!disableAnimation && isTwenty && (
        <div className="static top-0 left-0">
          <Confetti numberOfPieces={3000} recycle={false} />
        </div>
      )}
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

const DTwenty = ({ className }: { className: string }) => (
  <svg
    width="1200pt"
    height="1200pt"
    version="1.1"
    viewBox="0 0 1200 1200"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="m1056.2 276.96-395.4-226.8c-15.719-9-33.359-13.559-50.879-13.559-16.922 0-33.961 4.1992-49.32 12.602l-415.2 228c-17.641 9.7188-31.441 24.121-40.68 41.16h-0.48047l0.12109 0.60156c-7.8008 14.52-12.121 30.961-12.121 48v485.16c0 37.32 20.398 71.762 53.039 89.762l415.2 228c15.359 8.3984 32.281 12.602 49.32 12.602 17.641 0 35.16-4.5586 50.879-13.559l395.4-226.8c31.801-18.238 51.48-52.078 51.48-88.801l0.003906-487.57c0-36.723-19.562-70.562-51.363-88.801zm-430.68-208.44c7.0781 1.5586 13.922 4.0781 20.281 7.6797l395.4 226.8c12 6.8398 21.48 17.039 27.84 28.922l-451.8 24.719-2.1602-3.2383zm427.2 294.36-149.52 434.16-267.12-411.36zm-455.16 24.602c0.83984 0.12109 1.5586 0.12109 2.3984 0.12109h1.5586l288.36 444.12-593.88-6.7188zm-314.04 402.72-137.28-438.36 416.76 32.879zm-123.72-486.6 415.2-228c6.4805-3.6016 13.32-6 20.52-7.4414l-10.441 284.52-2.3984 3.6016-443.88-35.039c5.7617-7.082 12.84-13.082 21-17.641zm-37.441 548.64v-476.28l139.56 445.56-3.8398 5.6406-132.36 46.559c-2.1562-6.8398-3.3594-14.039-3.3594-21.48zm37.441 63.363c-7.3203-4.0781-13.68-9.3594-19.078-15.359l129.24-45.48 12.602 0.12109 279.72 281.88zm165.6-60.242 538.8 6.1211-254.28 280.56zm715.8 60.84-387.72 222.36 250.68-276.72 10.801 0.12109 135.84 47.398c-2.8789 2.5195-6.1211 4.9219-9.6016 6.8398zm36.363-62.758c0 10.922-2.6406 21.48-7.1992 30.961l-142.8-49.922-3.6016-5.5195 153.6-446.28z" />
  </svg>
);
