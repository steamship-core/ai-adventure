import { ReactNode } from "react";

export const QuestContainer = ({ children }: { children: ReactNode }) => (
  <main className="h-[100dvh] flex flex-col mx-auto">{children}</main>
);

export const QuestNarrativeContainer = ({
  children,
}: {
  children: ReactNode;
}) => (
  <main className="flex flex-grow flex-col-reverse overflow-scroll gap-12 pb-4">
    {children}
  </main>
);

export const QuestContentContainer = ({
  children,
}: {
  children: ReactNode;
}) => (
  <main className="max-w-2xl w-full flex flex-col flex-grow mx-auto pt-3 pb-6 px-4">
    {children}
  </main>
);
