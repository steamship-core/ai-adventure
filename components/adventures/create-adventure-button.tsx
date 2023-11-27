"use client";
import { amplitude } from "@/lib/amplitude";
import Link from "next/link";
import { Button } from "../ui/button";

export const CreateAdventureButton = () => {
  const onClick = async () => {
    amplitude.track("Button Click", {
      buttonName: "Create Adventure",
      location: "Create Adventure Page",
      action: "create-adventure",
    });
  };

  return (
    <Button onClick={onClick} asChild>
      <Link href="/adventures/create/template">
        Create a new adventure template
      </Link>
    </Button>
  );
};
