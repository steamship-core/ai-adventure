import prisma from "../db";

export const getOrCreateUserApprovals = async (userId: string) => {
  const approval = await prisma.userApprovals.findFirst({
    where: {
      userId: userId,
    },
  });
  if (approval) {
    return approval;
  }
  const newUserApproval = await prisma.userApprovals.create({
    data: {
      userId: userId,
    },
  });
  return newUserApproval;
};
