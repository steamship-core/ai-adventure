import { cn } from "@/lib/utils";
import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useRef,
  useState,
} from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "../ui/button";
import { inputClassNames } from "../ui/input";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { TypographyP } from "../ui/typography/TypographyP";
import useFocus from "./hooks/use-focus";
import { useTypeWriter } from "./hooks/use-typewriter";
import { CreationActions, CreationContent } from "./shared/components";

export const FocusableTextArea = ({
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
    <TextareaAutosize
      className={cn(
        inputClassNames,
        "w-full py-[.6rem] resize-none disabled:cursor-default"
      )}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      ref={ref}
      onKeyDown={onKeyDown}
      disabled={!isFinished}
      onFocus={onFocus}
      placeholder={placeholder}
      autoFocus
    />
  );
};

const OnboardingPrompt = ({
  isCurrent,
  text,
  placeholder,
  buttonText,
  options,
  step,
  totalSteps,
  setStep,
  setActiveStep,
  setConfiguration,
}: {
  isCurrent: boolean;
  text: string;
  placeholder: string;
  buttonText: string;
  options?: string[];
  step: number;
  totalSteps: number;
  setStep: Dispatch<SetStateAction<number>>;
  setActiveStep: Dispatch<SetStateAction<number>>;
  setConfiguration: (option: string) => void;
}) => {
  const { currentText, isFinished } = useTypeWriter({
    text,
  });
  const [value, setValue] = useState("");
  const [showForm, setShowForm] = useState(options ? false : true);
  const formRef = useRef<HTMLFormElement>(null);

  const onEnterPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === "Enter" && e.shiftKey == false) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const onContinue = (option: string) => {
    setStep((prev) => (prev > step + 1 ? prev : step + 1));
    setActiveStep((prev) => (prev > step + 1 ? prev : step + 1));
    setConfiguration(option);
  };

  return (
    <CreationContent isCurrent={isCurrent} onClick={() => setActiveStep(step)}>
      <TypographyMuted>
        {step}/{totalSteps}
      </TypographyMuted>
      <div>
        <TypographyP>{currentText}</TypographyP>
      </div>
      <CreationActions isFinished={isFinished}>
        {options && (
          <div className="grid grid-cols-2 gap-2">
            {options.map((option) => (
              <Button
                variant={option === value ? "default" : "outline"}
                key={option}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setValue(option);
                  onContinue(option);
                }}
              >
                {option}
              </Button>
            ))}
            <Button variant="ghost" onClick={() => setShowForm(true)}>
              Custom
            </Button>
          </div>
        )}
        {showForm && (
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onContinue(value);
            }}
            className="flex gap-2 flex-col"
          >
            <FocusableTextArea
              placeholder={placeholder}
              onFocus={() => setActiveStep(step)}
              onKeyDown={onEnterPress}
              value={value}
              setValue={setValue}
              isFinished={isFinished}
              isCurrent={isCurrent}
            />
            <Button
              disabled={value.length < 1}
              className="w-full"
              type="submit"
            >
              {buttonText}
            </Button>
          </form>
        )}
      </CreationActions>
    </CreationContent>
  );
};

export default OnboardingPrompt;
