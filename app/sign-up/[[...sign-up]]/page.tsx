import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - AI Adventure",
  description:
    "Enter the gateway to your storytelling adventure with AI Adventure. Sign up to access personalized, AI-driven storytelling experiences and create your unique narratives. Your journey into imagination and creativity begins here!",
};

export default function Page() {
  let returnBackUrl = new URL(
    `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/api/account/post-sign-in`
  );
  const adventuresUrl = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/adventures`;
  returnBackUrl.searchParams.set("redirectUrl", adventuresUrl);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <SignUp afterSignUpUrl={returnBackUrl.toString()} />
    </main>
  );
}
