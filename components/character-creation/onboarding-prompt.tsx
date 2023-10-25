import { cn } from "@/lib/utils";
import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useRef,
  useState,
} from "react";
import TextareaAutosize from "react-textarea-autosize";
import Typewriter from "typewriter-effect";
import { Button } from "../ui/button";
import { inputClassNames } from "../ui/input";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { TypographyP } from "../ui/typography/TypographyP";
import useFocus from "./hooks/use-focus";
import { CreationActions, CreationContent } from "./shared/components";

export const FocusableTextArea = ({
  value,
  isFinished,
  isCurrent,
  setValue,
  onKeyDown,
  placeholder,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  isFinished: boolean;
  isCurrent: boolean;
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
      placeholder={placeholder}
      maxRows={8}
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
  setActiveStep,
  setConfiguration,
  initialValue = "",
  setCompletedSteps,
  completedSteps,
}: {
  isCurrent: boolean;
  text: string;
  placeholder: string;
  buttonText: string;
  options?: string[];
  step: number;
  totalSteps: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  setConfiguration: (option: string) => void;
  initialValue?: string;
  setCompletedSteps: Dispatch<SetStateAction<Set<number>>>;
  completedSteps: Set<number>;
}) => {
  const [isFinished, setIsFinished] = useState(false);

  const [value, setValue] = useState(initialValue);
  const [showForm, setShowForm] = useState(options ? false : true);
  const formRef = useRef<HTMLFormElement>(null);

  const onEnterPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === "Enter" && e.shiftKey == false) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const onContinue = (option: string) => {
    setCompletedSteps((prev) => prev.add(step));
    setActiveStep((prev) => (prev > step + 1 ? prev : step + 1));
    setConfiguration(option);
  };

  const isCompletedAnimation = completedSteps.has(step) ? true : isFinished;

  return (
    <CreationContent isCurrent={isCurrent}>
      <TypographyMuted>
        {step}/{totalSteps}
      </TypographyMuted>
      <div>
        {!completedSteps.has(step) ? (
          <Typewriter
            onInit={(typewriter) => {
              typewriter
                .changeDelay(20)
                .typeString(text)
                .callFunction(() => {
                  setIsFinished(true);
                })
                .start();
            }}
          />
        ) : (
          <TypographyP>{text}</TypographyP>
        )}
      </div>
      <CreationActions isFinished={isCompletedAnimation}>
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
                autoFocus={false}
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
              onKeyDown={onEnterPress}
              value={value}
              setValue={setValue}
              isFinished={isCompletedAnimation}
              isCurrent={isCurrent}
            />
            <div className="flex w-full gap-2">
              <Button
                className="w-full"
                type="button"
                variant="outline"
                onClick={() => setActiveStep(step - 1)}
              >
                Back
              </Button>
              <Button
                disabled={value.length < 1}
                className="w-full"
                type="submit"
                autoFocus
              >
                {buttonText}
              </Button>
            </div>
          </form>
        )}
      </CreationActions>
    </CreationContent>
  );
};

export default OnboardingPrompt;
