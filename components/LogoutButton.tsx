"use client";

import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <SignOutButton signOutCallback={() => router.push("/")}>
      <Button>Logout</Button>
    </SignOutButton>
  );
}
