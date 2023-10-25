import { BlockContainer } from "./block-container";

export const UserInputBlock = ({ text }: { text: string }) => {
  return (
    <BlockContainer className="px-4 py-2 border-l-2 border-foreground/20 text-muted-foreground">
      {text}
    </BlockContainer>
  );
};
