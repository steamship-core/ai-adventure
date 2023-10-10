"use client";
import { CompassIcon } from "lucide-react";
import { Button } from "../ui/button";

const StartAdventureButton = () => {
  const onClick = () => {
    console.log("start adventure");
  };

  return (
    <Button>
      <CompassIcon className="mr-2" size={16} />
      Go on an adventure
    </Button>
  );
};

export default StartAdventureButton;
