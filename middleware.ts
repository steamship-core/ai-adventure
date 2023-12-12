import { authMiddleware } from "@clerk/nextjs";

function afterAuth(auth: any, req: any, evt: any) {
  console.log("After auth", typeof auth, typeof req, typeof evt);
}

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
    "/adventures",
    "/policies/(.*)",
    "/adventures/tagged/(.*)",
    /^\/adventures\/(?!(create|editor))[^\/]*$/,
    "/(.*)/opengraph-image",
  ],
  afterAuth,
};

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware(authMiddlewareConfig);

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
