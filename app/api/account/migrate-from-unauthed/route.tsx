import { getAnonId } from "@/lib/anon-auth/anon-auth-server";
import { mergeUsers } from "@/lib/user/merge-users";
import { auth } from "@clerk/nextjs";
import { log, withAxiom } from "next-axiom";
import { NextResponse } from "next/server";

export const POST = withAxiom(async (request: Request) => {
  const searchParams = new URL(request.url).searchParams;
  const redirectUrl =
    searchParams.get("redirectUrl") ||
    `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/adventures`;
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const maybeAnonId = getAnonId();

  if (maybeAnonId) {
    await mergeUsers(maybeAnonId, userId);
  }

  return NextResponse.redirect(redirectUrl, {
    status: 303,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Request-Method": "POST, GET, OPTIONS",
    },
  });
});
