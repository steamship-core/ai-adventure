import { TypographyP } from "../ui/typography/TypographyP";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { CreationActions, CreationContent } from "./utils/components";
import { useEffect, useRef, useState } from "react";
import { useTypeWriter } from "./utils/use-typewriter";

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
  const [didFocus, setDidFocus] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFinished && !didFocus) {
      ref.current?.focus();
      setDidFocus(true);
    }
  }, [didFocus, isFinished]);

  return (
    <CreationContent isCurrent={isCurrent} onClick={onFocus}>
      <TypographyP>{currentText}</TypographyP>
      <CreationActions isFinished={isFinished}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onContinue(value);
          }}
          className="flex gap-2 flex-col"
        >
          <Input
            ref={ref}
            className="w-full disabled:cursor-default"
            placeholder="Fantasy, steampunk, pirate/high-seas, viking, etc.."
            onFocus={onFocus}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!isFinished}
            autoFocus
          />
          <Button disabled={value.length < 1} className="w-full" type="submit">
            Set Theme
          </Button>
        </form>
      </CreationActions>
    </CreationContent>
  );
};

export default CharacterCreationTheme;
