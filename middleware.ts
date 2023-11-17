import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  debug: true,
  publicRoutes: [
    "/",
    "/api/webhooks/stripe",
    "/api/adventure",
    "/share/quest",
    "/_axiom/logs",
    "/api/shared/(.*)",
    "/adventures",
    /^\/adventures\/(?!(create|play|editor))[^\/]*$/,
    "/(.*)/opengraph-image",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
