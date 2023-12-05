import AdventureNavBar from "@/components/adventures/nav-bar";
import { ReactNode } from "react";

const HasNavbarLayout = ({ children }: { children: ReactNode }) => (
  <>
    <AdventureNavBar />
    {children}
  </>
);

export default HasNavbarLayout;
