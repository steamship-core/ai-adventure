import { ReactNode } from "react";

const AdventuresLayout = ({ children }: { children: ReactNode }) => (
  <div className="relative h-full p-4 px-20 py-8 overflow-hidden">
    {children}
  </div>
);

export default AdventuresLayout;
