import { ReactNode } from "react";

export const QuestContainer = ({ children }: { children: ReactNode }) => (
  <div className="h-[100dvh] max-w-2xl w-full flex flex-col flex-grow mx-auto pt-3 pb-6 px-4 overflow-hidden">
    {children}
  </div>
);

export const QuestNarrativeContainer = ({
  children,
}: {
  children: ReactNode;
}) => (
  <div className="relative w-full">
    <main
      id="narrative-container"
      className="flex flex-col-reverse h-full overflow-auto w-full scroll-smooth"
    >
      <div className="flex flex-col gap-8 w-full">{children}</div>
    </main>
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
