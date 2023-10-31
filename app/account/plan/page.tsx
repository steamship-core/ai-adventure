import ReturnToCampButton from "@/components/account/return-to-camp-button";
import { SummaryStats } from "@/components/camp/summary-stats";
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
    <main className="h-[100dvh] min-h-[600px] w-full">
      <div className="h-full flex flex-col justify-between max-w-xl mx-auto p-6 gap-2 overflow-auto">
        <div className="flex flex-col gap-2 h-[80%] overflow-hidden">
          <div className="flex justify-between items-center">
            <SummaryStats />
          </div>{" "}
          <SubscriptionSheet />
        </div>
        <div id="actions">
          <div className="w-full">
            <div className="flex w-full  flex-col justify-center items-center gap-2">
              <div className="w-full">
                <div className="flex w-full  flex-col justify-center items-center gap-2">
                  <ReturnToCampButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
