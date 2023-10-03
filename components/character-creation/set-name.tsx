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

const CharacterCreationName = ({
  onContinue,
  isCurrent,
  onFocus,
}: {
  onContinue: (value: string) => any;
  isCurrent: boolean;
  onFocus: () => any;
}) => {
  const { currentText, isFinished } = useTypeWriter({
    text: `Choose a name for your character. This can be anything you want!`,
  });
  const [value, setValue] = useState("");

  return (
    <CreationContent isCurrent={isCurrent} onClick={onFocus}>
      <TypographyP>{currentText}</TypographyP>
      <CreationActions isFinished={isFinished}>
        <Input
          className="w-full"
          placeholder="Professor Chaos"
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
          Set Name
        </Button>
      </CreationActions>
    </CreationContent>
  );
};

export default CharacterCreationName;
