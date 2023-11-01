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

const AdventureInstanceDropdown = ({
  agentId,
  deleteAgent,
}: {
  agentId: number;
  deleteAgent: (agentId: number) => Promise<void>;
}) => {
  const deleteAgentWithUserId = deleteAgent.bind(null, agentId);
  const router = useRouter();

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

export default AdventureInstanceDropdown;
