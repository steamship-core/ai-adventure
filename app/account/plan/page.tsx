import SubscriptionSheet from "@/components/subscription-sheet";
export default function AccountPlanPage() {
  return (
    <main
      className="flex h-[100dvh] flex-col items-center justify-center p-6 md:p-24 relative"
      id="main-container"
    >
      <SubscriptionSheet />
    </main>
  );
}
