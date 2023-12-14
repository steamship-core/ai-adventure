import AdventureNavBar from "@/components/adventures/nav-bar";
import LandingFooter from "@/components/landing/footer";
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
      <LandingFooter />
    </div>
  </div>
);

export default AccountLayout;
