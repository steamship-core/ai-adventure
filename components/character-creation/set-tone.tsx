import { TypographyP } from "../ui/typography/TypographyP";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { CreationActions, CreationContent } from "./shared/components";
import { useEffect, useRef, useState } from "react";
import { useTypeWriter } from "./hooks/use-typewriter";

const TEXT = `What is the tone of the story? Serious, silly, dark, light, etc..`;

const CharacterCreationTone = ({
  onContinue,
  isCurrent,
  onFocus,
}: {
  onContinue: (value: string) => any;
  isCurrent: boolean;
  onFocus: () => any;
}) => {
  const { currentText, isFinished } = useTypeWriter({
    text: TEXT,
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

  useEffect(() => {
    if (isCurrent) {
      ref.current?.focus();
    }
  }, [isCurrent]);

  return (
    <CreationContent isCurrent={isCurrent} onClick={onFocus}>
      <div>
        <TypographyP>{currentText}</TypographyP>
      </div>
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
            placeholder="Serious, silly, dark, light, etc.."
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

export default CharacterCreationTone;
