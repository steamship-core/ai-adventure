"use client";

import { SettingGroups } from "@/lib/game/editor/editor-options";
import { usePathname } from "next/navigation";
import SettingElement from "./setting-element";

// https://github.com/shadcn-ui/ui/blob/main/apps/www/app/examples/forms/notifications/page.tsx
export default function SettingGroupForm() {
  const pathname = usePathname();
  const sg = SettingGroups.filter((group) => pathname === group.href)[0];

  const onSubmit = () => {};

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{sg.title}</h3>
        <p className="text-sm text-muted-foreground">{sg.description}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        {sg.settings?.map((setting) => (
          <SettingElement key={setting.name} setting={setting} />
        ))}
      </form>

      {/* todo 
      <Separator />
      <NotificationsForm />
      */}
    </div>
  );
}
