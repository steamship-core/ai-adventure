import SubscriptionSheet from "@/components/subscription-sheet";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";

export default async function AccountPlanPage() {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  return (
    <main className="w-full">
      <SubscriptionSheet />
    </main>
  );
}
