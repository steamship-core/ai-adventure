import { TypographyP } from "../ui/typography/TypographyP";
import { Button } from "../ui/button";
import { CreationActions, CreationContent } from "./utils/components";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { useTypeWriter } from "./utils/use-typewriter";

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
  const [didFocus, setDidFocus] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

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
          <Textarea
            ref={ref}
            className="w-full disabled:cursor-default"
            placeholder="Born to a noble family, your character has always had everything they wanted... until now."
            onFocus={onFocus}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!isFinished}
            autoFocus
          />
          <Button disabled={value.length < 1} className="w-full" type="submit">
            Set Background
          </Button>
        </form>
      </CreationActions>
    </CreationContent>
  );
};

export default CharacterCreationBackground;
