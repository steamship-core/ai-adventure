import { Skeleton } from "@/components/ui/skeleton";

const EditorSectionLoading = () => (
  <div className="w-full flex flex-col gap-10">
    <div className="flex flex-col gap-2">
      <Skeleton className="w-56 h-10" />
      <Skeleton className="w-32 h-8" />
    </div>
    <div className="flex flex-col gap-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="w-full flex flex-col gap-2">
          <Skeleton className="w-32 h-8" />
          <Skeleton className="w-56 h-8" />
          <Skeleton className="w-full h-8" />
        </div>
      ))}
    </div>
  </div>
);
export default EditorSectionLoading;
