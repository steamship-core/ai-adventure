"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const BackButton = ({ isCreator }: { isCreator: boolean }) => {
  return (
    <Button variant="outline" asChild>
      <Link href={isCreator ? "/adventures/build" : `/adventures`}>
        <ArrowLeftIcon size={16} className="mr-2" />{" "}
        {isCreator ? "Your Adventures" : "All Adventures"}
      </Link>
    </Button>
  );
};

export default BackButton;
