"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const NavBarLink = ({
  href,
  children,
  size = "large",
}: {
  href: string;
  children: ReactNode;
  size?: "small" | "large";
}) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        "border-b border-transparent py-4 px-2 text-sm font-medium hover:bg-muted",
        pathname === href && "border-indigo-600",
        size === "small" && "py-2"
      )}
    >
      {children}
    </Link>
  );
};

const AdventureNavBar = () => {
  return (
    <nav className="w-full flex flex-col px-4 md:px-6 items-center border-b border-muted">
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-6">
          <NavBarLink href="/adventures">Discover</NavBarLink>
          <NavBarLink href="/adventures/build">Build</NavBarLink>
          <NavBarLink href="/adventures/play">Play</NavBarLink>
        </div>
        <UserButton />
      </div>
    </nav>
  );
};

export default AdventureNavBar;
