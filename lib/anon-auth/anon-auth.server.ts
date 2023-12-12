"use server";

import { auth as _auth } from "@clerk/nextjs";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const COOKIE_KEY = "anonId";
const ANON_ID_PREFIX = "anon|";

export async function anonAuth() {
  "use server";

  const authResult = _auth();
  console.log(authResult);

  if (authResult.userId) {
    // Return the userId if it exists.
    return authResult;
  }

  // Fall back to the session id
  const cookie = cookies().get(COOKIE_KEY);
  const anonId = cookie?.value;

  console.log("Existing session was:", anonId);

  if (!anonId) {
    let myuuid = `${ANON_ID_PREFIX}${uuidv4()}`;
    console.log("Setting session of:", anonId);
    cookies().set(COOKIE_KEY, myuuid);
    return { userId: myuuid, isAnon: true };
  } else {
    return { userId: anonId, isAnon: true };
  }
}
