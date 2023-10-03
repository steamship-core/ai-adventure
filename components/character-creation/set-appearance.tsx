import { Button } from "../ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CreationActions, CreationContent } from "./utils/components";
import { TypographyP } from "../ui/typography/TypographyP";
import { useEffect, useRef, useState } from "react";
import { useTypeWriter } from "./utils/use-typewriter";

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
            placeholder="An old, wise, wizard with a long white beard and a pointy hat."
            onFocus={onFocus}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!isFinished}
            autoFocus
          />
          <Button disabled={value.length < 1} className="w-full" type="submit">
            Set Appearance
          </Button>
        </form>
      </CreationActions>
    </CreationContent>
  );
};

export default CharacterCreationAppearance;
