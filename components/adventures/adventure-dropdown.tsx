"use client";

import { useMutation } from "@tanstack/react-query";
import { MoreVerticalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const AdventureDropdown = ({ adventureId }: { adventureId: string }) => {
  const deleteAgentWithUserId = deleteAdventure.bind(null, adventureId);
  const router = useRouter();

  async function deleteAdventure(adventureId: string) {
    const resp = await fetch("/api/editor", {
      method: "POST",
      body: JSON.stringify({
        operation: "delete",
        id: adventureId,
      }),
    });

    if (!resp.ok) {
      console.log("Error");
      console.log(await resp.text());
    } else {
      window.location.reload();
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await deleteAgentWithUserId();
      router.refresh();
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost" className="flex flex-col px-0">
          <MoreVerticalIcon size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="hover:cursor-pointer"
          disabled={isPending}
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            mutate();
          }}
        >
          {isPending ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdventureDropdown;
