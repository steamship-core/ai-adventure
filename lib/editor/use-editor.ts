import { useParams } from "next/navigation";

export function useEditorRouting() {
  const { section, adventureId } = useParams();

  if (!section) {
    return {
      groupName: "general-settings",
      adventureId,
    };
  }
  return { groupName: section, adventureId };
}
