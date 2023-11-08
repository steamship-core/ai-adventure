import { cn } from "@/lib/utils";
import { useMemo } from "react";
import Creatable from "react-select/creatable";

const options = [
  { value: "fantasy", label: "Fantasy" },
  { value: "sci-fi", label: "Sci-fi" },
  { value: "horror", label: "Horror" },
  { value: "mystery", label: "Mystery" },
  { value: "comedy", label: "Comedy" },
  { value: "romance", label: "Romance" },
  { value: "action", label: "Action" },
  { value: "drama", label: "Drama" },
  { value: "thriller", label: "Thriller" },
  { value: "western", label: "Western" },
  { value: "adventure", label: "Adventure" },
  { value: "historical", label: "Historical" },
  { value: "crime", label: "Crime" },
  { value: "animation", label: "Animation" },
  { value: "documentary", label: "Documentary" },
  { value: "war", label: "War" },
  { value: "sport", label: "Sport" },
  { value: "modern-day", label: "Modern-day" },
  { value: "funny", label: "Funny" },
];

const TagListElement = ({
  value,
  setValue,
  disabled,
}: {
  value: string[];
  setValue: (tag: string[]) => void;
  disabled?: boolean;
}) => {
  const defaultValue = useMemo(() => {
    return (value || []).map((tag) => {
      const option = options.find((option) => option.value === tag);
      if (option) {
        return option;
      }
      return { value: tag, label: tag };
    });
  }, [value]);

  return (
    <Creatable
      closeMenuOnSelect={false}
      defaultValue={defaultValue}
      options={options}
      isMulti
      classNames={{
        input: () => "text-sm bg-background",
        control: () => "!bg-background !border-muted !py-1",
        option: ({ isFocused }) => {
          return cn(
            "!text-sm hover:!bg-muted focus:!bg-muted hover:cursor-pointer",
            isFocused && "!bg-muted"
          );
        },
        multiValue: () => "!bg-background text-sm border",
        multiValueLabel: () => "text-sm !text-foreground",
        multiValueRemove: () => "text-sm",
        menu: () => "!bg-background",
        menuList: () => "hover:!bg-background",
      }}
      onChange={(newOptions) => {
        setValue(newOptions.map((option) => option!.value));
      }}
      isDisabled={disabled}
    />
  );
};

export default TagListElement;
