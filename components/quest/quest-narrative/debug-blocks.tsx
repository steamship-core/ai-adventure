import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import { useDebugModeSetting } from "@/lib/hooks";
import { Block } from "@/lib/streaming-client/src";
import { cn } from "@/lib/utils";

export const DebugBlock = ({
  block,
  className,
  title,
}: {
  block: Block;
  className: string;
  title: string;
}) => {
  const [isDebugMode, _] = useDebugModeSetting();
  if (!isDebugMode) {
    return null;
  }
  return (
    <div
      className={cn(
        "p-2 border border-yellow-600 rounded-md opacity-70 text-sm",
        className
      )}
    >
      <TypographySmall>{title}</TypographySmall>
      <p>{block.text}</p>
    </div>
  );
};

export const FallbackDebugBlock = ({ block }: { block: Block }) => {
  return (
    <DebugBlock block={block} className="border-foreground" title="Fallback" />
  );
};

export const StatusDebugBlock = ({ block }: { block: Block }) => {
  return (
    <DebugBlock block={block} className="border-yellow-600" title="Status" />
  );
};

export const SystemDebugBlock = ({ block }: { block: Block }) => {
  return (
    <DebugBlock block={block} className="border-orange-600" title="System" />
  );
};

export const BackgroundAudioBlock = ({ block }: { block: Block }) => {
  return (
    <DebugBlock
      block={block}
      className="border-orange-600"
      title="Background Audio"
    />
  );
};

export const ChatHistoryDebugBlock = ({ block }: { block: Block }) => {
  return (
    <DebugBlock
      block={block}
      className="border-indigo-600"
      title="Chat History"
    />
  );
};

export const FunctionCallDebugBlock = ({ block }: { block: Block }) => {
  return (
    <DebugBlock
      block={block}
      className="border-blue-600"
      title="Function Call"
    />
  );
};

export const UserMessageDebugBlock = ({ block }: { block: Block }) => {
  return (
    <DebugBlock
      block={block}
      className="border-green-600"
      title="User Message"
    />
  );
};
