import prisma from "../db";

const fetchData = async () => {
  const agents = await prisma.agents.findMany({});
  console.log(agents);
};

fetchData();
