import { useEffect, useRef, useState } from "react";
import Typewriter from "typewriter-effect";
import { Button } from "../ui/button";
import { TypographyP } from "../ui/typography/TypographyP";
import { CreationActions, CreationContent } from "./shared/components";

const CharacterCreationIntro = ({
  onContinue,
  isCurrent,
  completedSteps,
}: {
  onContinue: () => any;
  isCurrent: boolean;
  completedSteps: Set<number>;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const text = `Let's get started by creating your character.`;
  const [isFinished, setIsFinished] = useState(false);

  const isCompletedAnimation = completedSteps.has(0) ? true : isFinished;

  useEffect(() => {
    if (isCurrent && isCompletedAnimation) {
      ref.current?.focus();
    }
  }, [isCurrent, isCompletedAnimation]);

  console.log("Render completedSteps", completedSteps);

  return (
    <CreationContent isCurrent={isCurrent}>
      {!completedSteps.has(0) ? (
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .changeDelay(20)
              .typeString(text)
              .callFunction(() => {
                setIsFinished(true);
              })
              .start();
          }}
        />
      ) : (
        <TypographyP>{text}</TypographyP>
      )}
      <CreationActions isFinished={isCompletedAnimation}>
        <Button
          ref={ref}
          onClick={onContinue}
          disabled={!isCompletedAnimation}
          className="w-full"
        >
          Start
        </Button>
      </CreationActions>
    </CreationContent>
  );
};

export default CharacterCreationIntro;
