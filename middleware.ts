import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import {
  RequestCookies,
  ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";
import { anonAuthMiddleware } from "./lib/anon-auth/anon-auth-middleware";

const authMiddlewareConfig = {
  publicRoutes: [
    "/",
    "/api/webhooks/stripe",
    "/api/adventure",
    "/sitemap.xml",
    "/api/cron/(.*)",
    "/share/quest",
    "/_axiom/logs",
    "/api/shared/(.*)",
    "/api/adventure/create-instance",
    "/api/account/post-sign-in",
    "/adventures",
    "/play/(.*)",
    "/error",
    "/play/(.*)/(.*)",
    /^\/api\/chat.*$/,
    /^\/api\/game\/.*$/,
    /^\/api\/agent\/.*$/,
    /^\/api\/block\/.*$/,
    "/policies/(.*)",
    "/adventures/tagged/(.*)",
    /^\/adventures\/(?!(create|play|editor))[^\/]*$/,
    "/(.*)/opengraph-image",
  ],
};

// For future: This is a hack to make cookies immediately available on the request object.
function ApplySetCookie(req: NextRequest, res: NextResponse): void {
  // parse the outgoing Set-Cookie header
  const setCookies = new ResponseCookies(res.headers);
  // Build a new Cookie header for the request by adding the setCookies
  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie));
  // set “request header overrides” on the outgoing response
  NextResponse.next({
    request: { headers: newReqHeaders },
  }).headers.forEach((value, key) => {
    if (
      key === "x-middleware-override-headers" ||
      key.startsWith("x-middleware-request-")
    ) {
      res.headers.set(key, value);
    }
  });
}

export default authMiddleware({
  ...authMiddlewareConfig,
  async afterAuth(auth, req, evt) {
    const response = await anonAuthMiddleware(req);

    // TODO
    let returnBackUrl = new URL(
      `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/api/account/post-sign-in`
    );
    returnBackUrl.searchParams.set("redirectUrl", req.url);

    const effectiveReturnBackUrl = req.url; // returnBackUrl.toString()

    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({
        returnBackUrl: effectiveReturnBackUrl,
      });
    }

    return response;
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
