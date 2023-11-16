import { ReactNode } from "react";

const PlayLayout = ({ children }: { children: ReactNode }) => (
  <div className="relative h-full overflow-hidden">{children}</div>
);

export default PlayLayout;
