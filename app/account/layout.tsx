import AdventureNavBar from "@/components/adventures/nav-bar";
import { ReactNode } from "react";

const AccountLayout = ({ children }: { children: ReactNode }) => (
  <div>
    <div className="relative flex flex-col min-h-screen">
      <div className="relative bg-background">
        <div className="max-w-6xl mx-auto">
          <AdventureNavBar />
        </div>
      </div>
      {children}
    </div>
  </div>
);

export default AccountLayout;
