import { kv } from "@vercel/kv";
import prisma from "../db";
import { sendInternalMilestoneEmail } from "../emails/internal-milestone";

const ignoreList = [
  "user_2XMaFf2F0egCC4Fr3ywHo1bP0Mn",
  "user_2XGXbwk1SRBv5K1YghiA9I2Y5uL",
  "user_2XM6dzvMhS8lnqjwl51zm0F4gaE",
  "user_2XUgrdhsOskRxn50HBRlFxTbnqx",
  "user_2XUrnsrbXuL3Ahqt9fCfpBpVLh3",
  "user_2XX9nhxP9VEUCeNMwbNZlEJMDvs",
  "user_2XXTR0GvS8ppSB973GADGUgYwO0",
  "user_2Yo3dFsB0hGWndnvEZghItOvnd3",
  "user_2XDLLPBwKU9rquE3ljtMgTjpvEK",
  "user_2XB5VzXdqoF6WzmeQz0nH90AKCn",
  "user_2XX8CwYGvDj5Qk0bs8DAfuVKgN0",
  "user_2XX8LmNquHYyfGW0vp1RzZN9F14",
  "user_2XMcPizhcg6caBKD8d64owrnP3g",
  "user_2XBrFixxsO4YNxBdeiSLKXuuJA1",
  "user_2XGUOuNb1cLzakIdgf3MfWvnvM1",
  "user_2XB2auklWbnPpinlvF1v8H5AOW4",
  "user_2XMxknxEHXvCBKsrGvVcbYiMkaJ",
  "user_2XCVuBk6XduqeYg8GsaFx2cvGYu",
  "user_2XBIWivTBfJEcgGLQSkVecvzHnq",
  "user_2Xdc3TFm0Kse0MF0IGrFtFDDOoK",
];
export const notifyOnInternalMilestones = async () => {
  const agentCount = await prisma.agents.count({
    where: {
      ownerId: {
        notIn: ignoreList,
      },
    },
  });
  // round down to the nearest 1000
  const rounded = Math.floor(agentCount / 1000) * 1000;
  const emailSent = await kv.get<boolean>(`emailSent-${rounded}`);
  if (emailSent) {
    return Response.json({ success: true });
  }

  // send email
  await sendInternalMilestoneEmail(rounded);
  await kv.set(`emailSent-${rounded}`, true);
};
