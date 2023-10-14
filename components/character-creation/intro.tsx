import GAME_INFO from "@/lib/game-info";
import { Button } from "../ui/button";
import { TypographyP } from "../ui/typography/TypographyP";
import { useTypeWriter } from "./hooks/use-typewriter";
import { CreationActions, CreationContent } from "./shared/components";

const CharacterCreationIntro = ({
  onContinue,
  isCurrent,
}: {
  onContinue: () => any;
  isCurrent: boolean;
}) => {
  const { currentText, isFinished } = useTypeWriter({
    text: `${GAME_INFO.description} Let's get started by creating your character.`,
  });

  return (
    <CreationContent isCurrent={isCurrent}>
      <TypographyP>{currentText}</TypographyP>
      <CreationActions isFinished={isFinished}>
        <Button onClick={onContinue} disabled={!isFinished} className="w-full">
          Start
        </Button>
      </CreationActions>
    </CreationContent>
  );
};

export default CharacterCreationIntro;
