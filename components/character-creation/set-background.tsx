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
import { Textarea } from "../ui/textarea";

const CharacterCreationBackground = ({
  onContinue,
  isCurrent,
  onFocus,
}: {
  onContinue: (value: string) => any;
  isCurrent: boolean;
  onFocus: () => any;
}) => {
  const { currentText, isFinished } = useTypeWriter({
    text: `Set the background of your character. Is your character a noble, a peasant, a thief - maybe a wizard or a knight?`,
  });
  const [value, setValue] = useState("");

  return (
    <CreationContent isCurrent={isCurrent} onClick={onFocus}>
      <TypographyP>{currentText}</TypographyP>
      <CreationActions isFinished={isFinished}>
        <Textarea
          className="w-full"
          placeholder="Born to a noble family, your character has always had everything they wanted... until now."
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
          Set Background
        </Button>
      </CreationActions>
    </CreationContent>
  );
};

export default CharacterCreationBackground;
