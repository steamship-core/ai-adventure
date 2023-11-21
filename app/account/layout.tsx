import AdventureNavBar from "@/components/adventures/nav-bar";
import Image from "next/image";
import { ReactNode } from "react";
const AccountLayout = ({ children }: { children: ReactNode }) => (
  <div>
    <div className="relative flex flex-col min-h-screen">
      <div className="relative bg-background">
        <div className="max-w-6xl mx-auto">
          <AdventureNavBar />
        </div>
      </div>
      <div className="relative h-full px-6 md:px-16">{children}</div>
      <Image
        src="/payments/background-scene.png"
        fill
        alt="Adventurer's cache"
        className="-z-20 object-cover opacity-10"
      />
    </div>
  </div>
);

export default AccountLayout;
