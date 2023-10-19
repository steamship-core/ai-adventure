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
  <div className="flex flex-col h-full w-full">
    <div
      id="narrative-container"
      className="flex-1 flex flex-col-reverse overflow-auto gap-8 pt-8 pb-0 "
    >
      {children}
    </div>
  </div>
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
