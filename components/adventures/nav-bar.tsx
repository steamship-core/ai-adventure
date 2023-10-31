"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const NavBarLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        "border-b border-transparent py-4 px-2 text-sm font-medium hover:bg-muted",
        pathname === href && "border-indigo-600"
      )}
    >
      {children}
    </Link>
  );
};

const AdventureNavBar = () => {
  const pathname = usePathname();
  return (
    <nav className="w-full flex justify-between px-4 md:px-6 items-center border-b border-muted">
      <div className="flex gap-6">
        <NavBarLink href="/adventures">Home</NavBarLink>
        <NavBarLink href="/adventures/all">Discover</NavBarLink>
      </div>
      <UserButton />
    </nav>
  );
};

export default AdventureNavBar;
