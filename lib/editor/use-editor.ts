import { usePathname } from "next/navigation";

export function useEditorRouting() {
  let pathname = usePathname();

  const parts = pathname?.split("/");
  let groupName = `general-settings`;
  let adventureId = "";
  if (parts && parts.length > 3) {
    groupName = parts[3];
    adventureId = parts[2];
  } else if (parts && parts.length > 2) {
    adventureId = parts[2];
  }

  return { groupName, adventureId };
}
