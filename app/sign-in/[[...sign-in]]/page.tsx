import { SignIn } from "@clerk/nextjs";

export default async function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <SignIn afterSignInUrl="/adventures" />
    </main>
  );
}
