"use client";

import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { FlameIcon, User2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Button } from "../ui/button";

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
  const { user, isLoaded } = useUser();
  return (
    <nav className="w-full flex flex-col px-4 md:px-6 items-center border-b border-muted bg-background">
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-6">
          <NavBarLink href="/adventures">Discover</NavBarLink>
          <NavBarLink href="/adventures/create">Create</NavBarLink>
          <NavBarLink href="/adventures/play">Play</NavBarLink>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="ghost" asChild>
            <Link href="/account/plan">
              <FlameIcon className="h-5 w-5 text-orange-500" />
            </Link>
          </Button>
          {isLoaded ? (
            <>
              {user ? (
                <Button
                  variant="ghost"
                  className="flex items-center justify-center"
                  asChild
                >
                  <Link href="/account">
                    {user.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        width={64}
                        height={64}
                        alt="Profile"
                        className="rounded-full h-8 w-8"
                      />
                    ) : (
                      <User2Icon className="h-5 w-5" />
                    )}
                  </Link>
                </Button>
              ) : (
                <Button variant="ghost">
                  <Link href="/sign-in">Login</Link>
                </Button>
              )}
            </>
          ) : (
            <div className="ml-4 w-[32px]" />
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdventureNavBar;
