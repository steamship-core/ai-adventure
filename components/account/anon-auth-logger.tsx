"use client";

import { anonAuth } from "@/lib/anon-auth/anon-auth.server";
import { useEffect } from "react";

export default function AnonAuthLogin() {
  useEffect(() => {
    anonAuth();
  });
  return <></>;
}
