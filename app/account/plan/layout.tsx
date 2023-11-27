import Image from "next/image";
import { ReactNode } from "react";

const AccountPlanLayout = ({ children }: { children: ReactNode }) => (
  <div>
    <div className="relative h-full px-6 md:px-16">{children}</div>
    <Image
      src="/payments/background-scene.png"
      fill
      alt="Adventurer's cache"
      className="-z-20 object-cover opacity-10"
    />
  </div>
);

export default AccountPlanLayout;
