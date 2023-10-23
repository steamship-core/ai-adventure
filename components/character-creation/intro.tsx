import GAME_INFO from "@/lib/game-info";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { TypographyP } from "../ui/typography/TypographyP";
import { useTypeWriter } from "./hooks/use-typewriter";
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
  const text = `${GAME_INFO.description} Let's get started by creating your character.`;
  const { currentText, isFinished } = useTypeWriter({
    text,
  });

  const isCompletedAnimation = completedSteps.has(0) ? true : isFinished;

  useEffect(() => {
    if (isCurrent && isCompletedAnimation) {
      ref.current?.focus();
    }
  }, [isCurrent, isCompletedAnimation]);

  return (
    <CreationContent isCurrent={isCurrent}>
      <TypographyP>{completedSteps?.has(0) ? text : currentText}</TypographyP>
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
