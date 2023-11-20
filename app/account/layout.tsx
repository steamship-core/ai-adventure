import AdventureNavBar from "@/components/adventures/nav-bar";
import { ReactNode } from "react";

const AccountLayout = ({ children }: { children: ReactNode }) => (
  <div className="relative h-full max-w-6xl mx-auto">
    <AdventureNavBar />
    {children}
  </div>
);

export default AccountLayout;
