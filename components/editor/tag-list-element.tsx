import { useMemo } from "react";
import Select from "react-select";

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
];

const TagListElement = ({
  value,
  setValue,
}: {
  value: string[];
  setValue: (tag: string[]) => void;
}) => {
  const defaultValue = useMemo(() => {
    return value.map((tag) => {
      return options.find((option) => option.value === tag);
    });
  }, [value]);

  return (
    <Select
      closeMenuOnSelect={false}
      defaultValue={defaultValue}
      options={options}
      isMulti
      classNames={{
        input: () => "text-sm bg-background",
        control: () => "!bg-background !border-muted !py-1",
        option: () =>
          "!text-sm hover:!bg-muted focus:!bg-muted selected:!bg-muted !bg-background hover:cursor-pointer",
        multiValue: () => "!bg-background text-sm border",
        multiValueLabel: () => "text-sm !text-foreground",
        multiValueRemove: () => "text-sm",
        menu: () => "!bg-background",
        menuList: () => "hover:!bg-background",
      }}
      onChange={(newOptions) => {
        setValue(newOptions.map((option) => option!.value));
      }}
    />
  );
};

export default TagListElement;
