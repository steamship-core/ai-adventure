import { TypographyH1 } from "../ui/typography/TypographyH1";
import { Button } from "../ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import {
  CreationActions,
  CreationContainer,
  CreationContent,
  useTypeWriter,
} from "./components";
import { TypographyP } from "../ui/typography/TypographyP";
import { useState } from "react";

const CharacterCreationAppearance = ({
  onContinue,
  isCurrent,
  onFocus,
}: {
  onContinue: (value: string) => any;
  isCurrent: boolean;
  onFocus: () => any;
}) => {
  const { currentText, isFinished } = useTypeWriter({
    text: `Describe your character's appearence. An image will be generated based on your description - so be as detailed as you want!`,
  });
  const [value, setValue] = useState("");

  return (
    <CreationContent isCurrent={isCurrent} onClick={onFocus}>
      <TypographyP>{currentText}</TypographyP>
      <CreationActions isFinished={isFinished}>
        <Textarea
          className="w-full"
          placeholder="An old, wise, wizard with a long white beard and a pointy hat."
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
          Set Appearance
        </Button>
      </CreationActions>
    </CreationContent>
  );
};

export default CharacterCreationAppearance;
