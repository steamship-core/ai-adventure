"use client";

export const PublishCTA = ({ className = "" }: { className?: string }) => {
  return (
    <div className="w-full text-sm flex flex-col items-startt text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800 py-2 px-2">
      <span className="font-medium">Unpublished Changes</span>
      <span>
        Click <i>Test</i> to try. Click <i>Publish</i> to share.
      </span>
    </div>
  );
};
