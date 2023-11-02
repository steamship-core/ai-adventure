"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const BackButton = () => {
  return (
    <Button variant="outline" asChild>
      <Link href={`/adventures/all`}>
        <ArrowLeftIcon size={16} className="mr-2" /> All Adventures
      </Link>
    </Button>
  );
};

export default BackButton;
