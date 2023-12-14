import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export type AnonAuthResponse = {
  userId?: string;
};

export async function anonAuth(req: NextRequest): Promise<AnonAuthResponse> {
  if (!process.env.IRON_SESSION_COOKIE_NAME) {
    throw new Error("Please set IRON_SESSION_COOKIE_NAME env var");
  }

  let cookie = req.cookies.get(process.env.IRON_SESSION_COOKIE_NAME);
  if (cookie?.value) {
    return {
      userId: cookie?.value,
    };
  }
  return {};
}

function errorRedirect(what: string, cando: string, deets: string) {
  const whatHappened = encodeURIComponent(what);
  const whatYouCanDo = encodeURIComponent(cando);
  const technicalDetails = encodeURIComponent(deets);
  redirect(
    `/error?whatHappened=${whatHappened}&whatYouCanDo=${whatYouCanDo}&technicalDetails=${technicalDetails}`
  );
}

export function getAnonId(
  throwErrorAndRedirect: boolean = true
): string | null {
  if (!(process.env.NEXT_PUBLIC_ALLOW_NOAUTH_GAMEPLAY === "true")) {
    if (throwErrorAndRedirect) {
      errorRedirect(
        "Login required.",
        "Try logging in first.",
        "No user id found."
      );
      throw new Error("Login required. Try logging in first. No userId found.");
    } else {
      return null;
    }
  }

  if (!process.env.IRON_SESSION_COOKIE_NAME) {
    if (throwErrorAndRedirect) {
      throw new Error("Please set IRON_SESSION_COOKIE_NAME env var");
    } else {
      return null;
    }
  }

  const cookieStore = cookies();
  let cookie = cookieStore.get(process.env.IRON_SESSION_COOKIE_NAME);

  if (!cookie?.value) {
    if (throwErrorAndRedirect) {
      errorRedirect(
        "Login required.",
        "Try logging in first.",
        "No user id found."
      );
      throw new Error("Login required. Please try logging in.");
    } else {
      return null;
    }
  }

  return cookie?.value;
}

export function getUserIdFromClerkOrAnon(
  throwErrorAndRedirect: boolean = true
): string | null {
  const { userId } = auth();
  if (userId) {
    return userId;
  }

  return getAnonId(throwErrorAndRedirect);
}
