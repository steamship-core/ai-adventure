import GAME_INFO from "@/lib/game-info";
import { TypographyH1 } from "../ui/typography/TypographyH1";
import { TypographyP } from "../ui/typography/TypographyP";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import {
  CreationActions,
  CreationContainer,
  CreationContent,
  useTypeWriter,
} from "./components";
import { useState } from "react";

const CharacterCreationTheme = ({
  onContinue,
  isCurrent,
  onFocus,
}: {
  onContinue: (value: string) => any;
  isCurrent: boolean;
  onFocus: () => any;
}) => {
  const { currentText, isFinished } = useTypeWriter({
    text: `Set the theme of the adventure. This will determine the setting and genre of the story you will be playing.`,
  });
  const [value, setValue] = useState("");
  return (
    <CreationContent isCurrent={isCurrent} onClick={onFocus}>
      <TypographyP>{currentText}</TypographyP>
      <CreationActions isFinished={isFinished}>
        <Input
          className="w-full"
          placeholder="Fantasy, steampunk, pirate/high-seas, viking, etc.."
          onFocus={onFocus}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onContinue(value);
          }}
        >
          Set Theme
        </Button>
      </CreationActions>
    </CreationContent>
  );
};

export default CharacterCreationTheme;
