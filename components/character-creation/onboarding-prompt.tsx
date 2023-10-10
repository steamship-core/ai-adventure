import { Button } from "../ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CreationActions, CreationContent } from "./shared/components";
import { TypographyP } from "../ui/typography/TypographyP";
import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTypeWriter } from "./hooks/use-typewriter";
import useFocus from "./hooks/use-focus";
import { Input } from "../ui/input";

const FocusableTextArea = ({
  value,
  isFinished,
  isCurrent,
  onFocus,
  setValue,
  onKeyDown,
  placeholder,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  isFinished: boolean;
  isCurrent: boolean;
  onFocus: () => any;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => any;
  placeholder: string;
}) => {
  const { ref } = useFocus<HTMLTextAreaElement>(isFinished, isCurrent);
  return (
    <Textarea
      ref={ref}
      className="w-full disabled:cursor-default"
      placeholder={placeholder}
      onFocus={onFocus}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      disabled={!isFinished}
      onKeyDown={onKeyDown}
      autoFocus
    />
  );
};

const FocusableInputArea = ({
  value,
  isFinished,
  isCurrent,
  onFocus,
  setValue,
  placeholder,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  isFinished: boolean;
  isCurrent: boolean;
  onFocus: () => any;
  placeholder: string;
}) => {
  const { ref } = useFocus<HTMLInputElement>(isFinished, isCurrent);
  return (
    <Input
      ref={ref}
      className="w-full disabled:cursor-default"
      placeholder={placeholder}
      onFocus={onFocus}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      disabled={!isFinished}
      autoFocus
    />
  );
};

const OnboardingPrompt = ({
  onContinue,
  isCurrent,
  onFocus,
  text,
  isTextarea,
  placeholder,
}: {
  onContinue: (value: string) => any;
  isCurrent: boolean;
  onFocus: () => any;
  text: string;
  isTextarea?: boolean;
  placeholder: string;
}) => {
  const { currentText, isFinished } = useTypeWriter({
    text,
  });
  const [value, setValue] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const onEnterPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === "Enter" && e.shiftKey == false) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <CreationContent isCurrent={isCurrent} onClick={onFocus}>
      <div>
        <TypographyP>{currentText}</TypographyP>
      </div>
      <CreationActions isFinished={isFinished}>
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onContinue(value);
          }}
          className="flex gap-2 flex-col"
        >
          {isTextarea ? (
            <FocusableTextArea
              placeholder={placeholder}
              onFocus={onFocus}
              onKeyDown={onEnterPress}
              value={value}
              setValue={setValue}
              isFinished={isFinished}
              isCurrent={isCurrent}
            />
          ) : (
            <FocusableInputArea
              placeholder={placeholder}
              onFocus={onFocus}
              value={value}
              setValue={setValue}
              isFinished={isFinished}
              isCurrent={isCurrent}
            />
          )}
          <Button disabled={value.length < 1} className="w-full" type="submit">
            Set Appearance
          </Button>
        </form>
      </CreationActions>
    </CreationContent>
  );
};

export default OnboardingPrompt;
