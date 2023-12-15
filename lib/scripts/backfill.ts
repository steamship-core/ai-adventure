import { clerkClient } from "@clerk/nextjs";
import { generateUsername } from "unique-username-generator";
import prisma from "../db";
const tdqm = require(`tqdm`);

const getAllUsers = async () => {
  const limit = 100;
  let offset = 0;
  let count = 0;
  let hasMore = true;
  const allUsers = [];
  while (hasMore) {
    const users = await clerkClient.users.getUserList({
      limit,
      offset,
    });
    allUsers.push(...users);
    hasMore = users.length === limit;
    offset += limit;
  }
  return allUsers;
};

const backfill = async () => {
  const allUsers = await getAllUsers();

  for (const user of tdqm(allUsers)) {
    const username = generateUsername("-", 4);
    try {
      await prisma.userInfo.upsert({
        create: {
          userId: user.id,
          email: user.emailAddresses[0].emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          publicMetadata: user.publicMetadata as {},
          privateMetadata: user.privateMetadata as {},
          unsafeMetadata: user.unsafeMetadata as {},
          profileImageUrl: user.imageUrl,
          username,
        },
        update: {
          email: user.emailAddresses[0].emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          publicMetadata: user.publicMetadata as {},
          privateMetadata: user.privateMetadata as {},
          unsafeMetadata: user.unsafeMetadata as {},
          profileImageUrl: user.imageUrl,
          username,
        },
        where: {
          userId: user.id,
        },
      });
    } catch (e) {
      console.log(e);
      break;
    }
  }
};

backfill();
