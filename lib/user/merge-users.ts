import { log } from "next-axiom";
import prisma from "../db";

export async function mergeUsers(fromUserId: string, toUserId: string) {
  let _msg = `[mergeUsers] from ${fromUserId} to {toUserId}`;
  log.info(_msg);
  console.log(_msg);

  await prisma.agents.updateMany({
    where: {
      ownerId: fromUserId,
    },
    data: {
      ownerId: toUserId,
    },
  });

  // TODO: If we want to permit unauthed users to do the below things, then we can also choose
  // to re-associate them here.

  // const updateUserExperience = await prisma.userExperience.updateMany({
  //   where: {
  //     userId: fromUserId,
  //   },
  //   data: {
  //     userId: toUserId,
  //   },
  // });

  // const updateReactions = await prisma.reactions.updateMany({
  //   where: {
  //     userId: fromUserId,
  //   },
  //   data: {
  //     userId: toUserId,
  //   },
  // });

  // const updateFeedback = await prisma.feedback.updateMany({
  //   where: {
  //     userId: fromUserId,
  //   },
  //   data: {
  //     userId: toUserId,
  //   },
  // });

  // const updateComment = await prisma.comment.updateMany({
  //   where: {
  //     userId: fromUserId,
  //   },
  //   data: {
  //     userId: toUserId,
  //   },
  // });
}
