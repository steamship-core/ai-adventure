import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - AI Adventure",
  description:
    "Enter the gateway to your storytelling adventure with AI Adventure. Sign up to access personalized, AI-driven storytelling experiences and create your unique narratives. Your journey into imagination and creativity begins here!",
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <SignUp afterSignUpUrl="/adventures" />
    </main>
  );
}
