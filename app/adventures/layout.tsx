import AdventureNavBar from "@/components/adventures/nav-bar";
import { ReactNode } from "react";

const AdventuresLayout = ({ children }: { children: ReactNode }) => (
  <div className="relative h-full">
    <AdventureNavBar />
    {children}
  </div>
);

export default AdventuresLayout;
