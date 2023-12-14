import { getAnonId } from "@/lib/anon-auth/anon-auth-server";
import { mergeUsers } from "@/lib/user/merge-users";
import { auth } from "@clerk/nextjs";
import { log, withAxiom } from "next-axiom";
import { NextResponse } from "next/server";

export const GET = withAxiom(async (request: Request) => {
  const searchParams = new URL(request.url).searchParams;

  const redirectUrl =
    searchParams.get("redirectUrl") ||
    `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/adventures`;
  const tryNumber = searchParams.get("tryNumber") || "0";

  let _msg = `[post-sign-in] Will redirect to ${redirectUrl}`;
  log.info(_msg);
  console.log(_msg);

  const { userId } = auth();

  _msg = `[post-sign-in] userId ${userId}`;
  log.info(_msg);
  console.log(_msg);

  if (!userId) {
    if (tryNumber == "0") {
      // There seems to be a bug in prod with OAuth (but not magic link) login in which just post-login, the cookies
      // aren't yet available and so it will appear that you don't have a user. This is a hacky workaround which will
      // send a redirect to THIS SAME PAGE to try to get the cookies to be available.
      log.info("No user. Sending redirect to try oauth hack");

      let u = new URL(request.url);
      u.searchParams.set("tryNumber", "1");

      return NextResponse.redirect(u.toString(), {
        status: 303,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Request-Method": "POST, GET, OPTIONS",
        },
      });
    } else {
      log.error("No user");
      throw new Error("no user");
    }
  }

  const maybeAnonId = getAnonId();

  if (maybeAnonId) {
    _msg = `[post-sign-in] anonId ${maybeAnonId}`;
    log.info(_msg);
    console.log(_msg);

    await mergeUsers(maybeAnonId, userId);
  } else {
    _msg = `[post-sign-in] no anonId`;
    log.info(_msg);
    console.log(_msg);
  }

  return NextResponse.redirect(redirectUrl, {
    status: 303,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Request-Method": "POST, GET, OPTIONS",
    },
  });
});
