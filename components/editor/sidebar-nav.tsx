"use client";

import { SettingGroup } from "@/lib/editor/editor-options";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment, useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { TypographyMuted } from "../ui/typography/TypographyMuted";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: SettingGroup[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const params = useParams<{ adventureId: string; section: string }>();
  const { section } = params;

  // tranform section-name into Section Name
  const sectionName = section
    ? section
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "General Settings";
  return (
    <>
      <nav
        className={cn("flex-col gap-2 hidden md:flex", className)}
        {...props}
      >
        {items.map((item: SettingGroup) =>
          item.spacer === true ? (
            <TypographyLarge key={item.title}>{item.title}</TypographyLarge>
          ) : (
            <Link
              key={item.href}
              href={`/adventures/editor/${params.adventureId}/${item.href}`}
              className={cn(
                "flex items-start justify-center hover:underline rounded-r-md font-normal",
                section === item.href &&
                  "border-l-2 pl-2 border-indigo-600 font-bold",
                "justify-start"
              )}
            >
              <TypographyMuted
                className={cn(
                  "font-normal",
                  section === item.href && "text-primary"
                )}
              >
                {item.title}
              </TypographyMuted>
            </Link>
          )
        )}
      </nav>
      <div className="flex md:hidden items-center justify-between">
        {sectionName}
        <Sheet open={isMenuOpen} onOpenChange={(open) => setIsMenuOpen(open)}>
          <SheetTrigger asChild>
            <Button variant="outline">
              <MenuIcon className="w-4 h-4 mr-2" /> Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[70vh] overflow-scroll">
            <div>
              {items.map((item: SettingGroup, i: number) =>
                item.spacer === true ? (
                  <Fragment key={item.title}>
                    <TypographyLarge>{item.title}</TypographyLarge>
                  </Fragment>
                ) : (
                  <div key={item.href}>
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full text-left justify-start"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link
                        href={`/adventures/editor/${params.adventureId}/${item.href}`}
                        className="hover:cursor-pointe"
                      >
                        <TypographyMuted className="hover:text-primary">
                          {item.title}
                        </TypographyMuted>
                      </Link>
                    </Button>
                  </div>
                )
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
