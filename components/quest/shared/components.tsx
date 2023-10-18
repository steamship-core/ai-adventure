import { ReactNode } from "react";

export const QuestContainer = ({ children }: { children: ReactNode }) => (
  <div className="h-[100dvh] max-w-2xl w-full flex flex-col flex-grow mx-auto pt-3 pb-6 px-4">
    {children}
  </div>
);

export const QuestNarrativeContainer = ({
  children,
}: {
  children: ReactNode;
}) => (
  <main id="narrative-container" className="overflow-auto h-full w-full">
    <div className="flex flex-col-reverse gap-8 pt-8 pb-0 ">{children}</div>
  </main>
);

export const QuestContentContainer = ({
  children,
}: {
  children: ReactNode;
}) => (
  <div className="max-w-2xl w-full flex flex-col flex-grow mx-auto pt-3 pb-6 px-4">
    {children}
  </div>
);
