"use server";

import { auth as _auth } from "@clerk/nextjs";
import { getIronSession } from "iron-session";
import { log } from "next-axiom";
import { cookies } from "next/headers";

async function getIronSessionData() {
  return (await getIronSession(cookies(), {
    password: "this-is-the-pasasdfljaslkfdjsadlkfjdsalkfjasdlkfjlkdsassword",
    cookieName: "this-is-the-cookie-name",
  })) as any;
}

export async function auth(allowAnon: boolean = false) {
  "use server";

  const authResult = _auth();
  console.log(authResult);

  if (authResult.userId) {
    return authResult;
  }

  if (!allowAnon) {
    log.error("No user");
    throw new Error("no user");
  }

  // Fall back to the session id
  const cookie = cookies().get("anonId");
  const anonId = cookie?.value;

  console.log("Existing session", anonId);

  if (!anonId) {
    cookies().set("anonId", "lee");
    return { userId: "lee", isAnon: true };
  } else {
    return { userId: anonId, isAnon: true };
  }
}
