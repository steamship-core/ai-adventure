"use client";
import { track } from "@vercel/analytics/react";
import { HomeIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";

const ReturnToCampButton = () => {
  const router = useRouter();
  const params = useParams();
  const onClick = async () => {
    router.push(`/adventures`);
    track("Click Button", {
      buttonName: "Return to Adventures",
      location: "Account",
    });
  };

  return (
    <Button
      onClick={onClick}
      isLoading={false}
      disabled={false}
      className="w-full flex justify-start"
    >
      <HomeIcon className="h-6 w-6 fill-blue-600 text-blue-600 mr-2" />
      <>Return to Adventures</>
    </Button>
  );
};

export default ReturnToCampButton;
