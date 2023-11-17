import prisma from "../db";
import { getSteamshipClient } from "../utils";

const fetchData = async () => {
  console.log("These are all the game instances");
  const agents = await prisma.agents.findMany({});
  console.log(agents);

  console.log("These are all the games");
  const adventures = await prisma.adventure.findMany({});
  console.log(adventures);

  console.log("Let's talk to steamship");

  // Now let's do something with steamship.
  // This will use your .env.local env vars if called from the script in package.json
  const client = await getSteamshipClient();

  console.log("Let's get our usage summary");
  // Now let's call a method on steamship
  const resp = await client.get("/account/getUsageSummary");
  const respJson = await resp.json();
  console.log(respJson);

  console.log("Let's get usage records");
  const usageResp = await client.post("/account/usage", {
    // Can set these to a value to get a specific page
    pageSize: undefined,
    pageToken: undefined,
    sortOrder: undefined,
    sortOrderOrDefault: undefined,
  });
  const usageRespJson = await usageResp.json();
  console.log(usageRespJson);

  console.log("Let's print out an example of that");
  console.log(JSON.stringify(usageRespJson?.data?.usage[0], null, 2));
};

fetchData();
