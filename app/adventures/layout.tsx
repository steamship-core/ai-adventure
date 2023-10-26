import { ReactNode } from "react";

const AdventuresLayout = ({ children }: { children: ReactNode }) => (
  <div className="relative h-full p-4 overflow-hidden">{children}</div>
);

export default AdventuresLayout;
