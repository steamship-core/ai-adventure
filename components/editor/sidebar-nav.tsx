"use client";

import { SettingGroup } from "@/lib/editor/editor-options";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: SettingGroup[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  // Add on the /editor/ADVENTURE-ID/ prefix
  const parts = pathname?.split("/");
  let pathPrefix = `/editor/`;
  if (parts && parts.length > 2) {
    pathPrefix = `/editor/${parts[2]}/`;
  }

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
            href={`${pathPrefix}${item.href}`}
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
