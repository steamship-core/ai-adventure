import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - AI Adventure",
  description:
    "Enter the gateway to your storytelling adventure with AI Adventure. Sign in to access personalized, AI-driven storytelling experiences and create your unique narratives. Your journey into imagination and creativity begins here!",
};

export default async function Page() {
  let returnBackUrl = new URL(
    `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/api/account/post-sign-in`
  );
  const adventuresUrl = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/adventures`;
  returnBackUrl.searchParams.set("redirectUrl", adventuresUrl);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <SignIn afterSignInUrl={returnBackUrl.toString()} />
    </main>
  );
}
