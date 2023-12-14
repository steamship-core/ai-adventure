import { NextMiddlewareResult } from "next/dist/server/web/types";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const COOKIE_NAME = process.env.IRON_SESSION_COOKIE_NAME;
const ANON_ID_PREFIX = process.env.ANON_ID_PREFIX;

function createAnonId(): string {
  if (!ANON_ID_PREFIX) {
    throw new Error("Please set ANON_ID_PREFIX env var");
  }
  return `${ANON_ID_PREFIX}${uuidv4()}`;
}

/** Sets a anonId cookie if it is not present. */
export async function anonAuthMiddleware(
  req: NextRequest
): Promise<NextMiddlewareResult> {
  if (!COOKIE_NAME) {
    throw new Error("Please set COOKIE_NAME env var");
  }

  const response = NextResponse.next();

  // If the cookie is already set, do nothing.
  const cooks = req.cookies.getAll();
  console.log(JSON.stringify(cooks));
  if (req.cookies.get(COOKIE_NAME)) {
    return NextResponse.next();
  }
  response.cookies.set(COOKIE_NAME, createAnonId());
  return response;
}

export function NestingAnonAuthMiddleware(
  inner: (req: NextRequest) => boolean
): (req: NextRequest) => boolean {
  return (req: NextRequest) => {
    return inner(req);
  };
}
