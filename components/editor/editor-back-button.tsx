"use client";
import { useEditorRouting } from "@/lib/editor/use-editor";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export const EditorBackButton = () => {
  const { adventureId } = useEditorRouting();

  return (
    <Button variant="outline" asChild>
      <Link href={`/adventures/${adventureId}`} prefetch={false}>
        <ArrowLeftIcon size={16} className="mr-2" /> Back
      </Link>
    </Button>
  );
};
