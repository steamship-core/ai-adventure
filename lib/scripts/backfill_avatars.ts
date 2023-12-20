import prisma from "../db";
const tdqm = require(`tqdm`);

const backfill = async () => {
  const allUsers = await prisma.userInfo.findMany({});

  for (const user of tdqm(allUsers)) {
    try {
      await prisma.userInfo.update({
        data: {
          avatarImage: `https://api.dicebear.com/7.x/fun-emoji/svg/?seed=${user.username}`,
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
