import { ReactNode } from "react";

export const ContentBox = ({ children }: { children: ReactNode }) => (
  <div>
    <div className="bg-background/80 px-4 py-2 rounded-sm">{children}</div>
  </div>
);
