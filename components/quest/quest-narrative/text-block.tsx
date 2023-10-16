export const TextBlock = ({ text }: { text: string }) => {
  return (
    <p data-blockType="text-block" className="whitespace-pre-wrap text-sm">
      {text}
    </p>
  );
};
