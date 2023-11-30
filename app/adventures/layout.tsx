import AdventureNavBar from "@/components/adventures/nav-bar";
import { ReactNode } from "react";

const AdventuresLayout = ({ children }: { children: ReactNode }) => (
  <div className="relative h-full max-w-6xl mx-auto flex flex-col">
    <AdventureNavBar />
    {children}
  </div>
);

export default AdventuresLayout;
