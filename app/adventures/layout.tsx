import LandingFooter from "@/components/landing/footer";
import { ReactNode } from "react";

const AdventuresLayout = ({ children }: { children: ReactNode }) => (
  <div className="relative h-full max-w-6xl mx-auto flex flex-col">
    {children}
    <LandingFooter />
  </div>
);

export default AdventuresLayout;
