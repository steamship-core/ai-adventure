import GAME_INFO from "@/lib/game-info";
import { TypographyH1 } from "../ui/typography/TypographyH1";
import { TypographyP } from "../ui/typography/TypographyP";
import { Button } from "../ui/button";
import {
  CreationActions,
  CreationContainer,
  CreationContent,
  useTypeWriter,
} from "./components";

const CharacterCreationIntro = ({
  onContinue,
  isCurrent,
}: {
  onContinue: () => any;
  isCurrent: boolean;
}) => {
  const { currentText, isFinished } = useTypeWriter({
    text: `${GAME_INFO.name} ${GAME_INFO.description} To get started, answer a few questions about your character.`,
  });

  return (
    <CreationContent isCurrent={isCurrent}>
      <TypographyP>{currentText}</TypographyP>
      <CreationActions isFinished={isFinished}>
        <Button onClick={onContinue} className="w-full">
          Start
        </Button>
      </CreationActions>
    </CreationContent>
  );
};

export default CharacterCreationIntro;
