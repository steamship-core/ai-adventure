"use client";

import { SettingGroup } from "@/lib/editor/editor-options";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Fragment } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { TypographyMuted } from "../ui/typography/TypographyMuted";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: SettingGroup[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();
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
                "flex items-start py-2 justify-center hover:underline rounded-r-md font-normal",
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MenuIcon className="w-4 h-4 mr-2" /> Menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {items.map((item: SettingGroup) =>
              item.spacer === true ? (
                <Fragment key={item.title}>
                  <DropdownMenuSeparator key={item.title} />
                  <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                </Fragment>
              ) : (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={`/adventures/editor/${params.adventureId}/${item.href}`}
                    className="hover:cursor-pointer"
                  >
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
