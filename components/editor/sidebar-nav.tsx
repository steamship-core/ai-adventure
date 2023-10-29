"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SettingGroup } from "@/lib/game/editor/editor-options";
import { cn } from "@/lib/utils";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item: SettingGroup) =>
        item.spacer === true ? (
          <div
            key={item.title}
            className="pt-4 text-sm border-b-2 mb-2 capitalize"
          >
            {item.title}
          </div>
        ) : (
          <Link
            key={item.href}
            href={item.href!}
            className={cn(
              "hover:bg-accent hover:text-accent-foreground",
              pathname === item.href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start"
            )}
          >
            {item.title}
          </Link>
        )
      )}
    </nav>
  );
}
