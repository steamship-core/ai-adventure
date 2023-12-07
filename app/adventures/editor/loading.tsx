import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";

const EditorSectionLoading = () => (
  <div className="flex flex-grow flex-col gap-6 px-4 md:px-6">
    <div className="flex flex-col md:flex-row justify-between mt-4">
      <div>
        <TypographyH1>Adventure Editor</TypographyH1>
        <TypographyMuted className="text-lg">
          Create a custom adventure to share with your friends.
        </TypographyMuted>
      </div>
    </div>
    <div className="w-full flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <Skeleton className="w-56 h-10" />
        <div className="flex gap-2">
          <Skeleton className="w-20 h-10" />
          <Skeleton className="w-20 h-10" />
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <Skeleton className="w-full h-[500px]" />
      </div>
    </div>
  </div>
);
export default EditorSectionLoading;
