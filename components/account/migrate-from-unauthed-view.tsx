"use client";

import LoadingScreen from "@/components/loading/loading-screen";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function MigrateFromUnauthedView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const onError = (message: string) => {
    console.log(message);
  };

  const doRedirect = () => {
    const newPath = searchParams.get("redirect") || "/adventures";
    router.push(newPath);
  };

  const onResponse = async (response: Response) => {
    if (!response.ok) {
      onError(
        `Error: ${response.status} ${
          response.statusText
        } ${await response.text()}`
      );
      return;
    }
    doRedirect();
  };

  useEffect(() => {
    fetch("/api/account/migrate-from-unauthed", {
      method: "POST",
    }).then(onResponse, (error) => {
      onError(`Error: ${error}`);
    });
  }, []);

  return (
    <LoadingScreen
      text={"Transferring any existing adventures into your new account.."}
      title={"Updating Adventures"}
    />
  );
}
