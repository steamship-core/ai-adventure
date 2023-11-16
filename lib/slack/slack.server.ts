import { log } from "next-axiom";

const { WebClient } = require("@slack/web-api");

const options = {};
const web = new WebClient(process.env.SLACK_TOKEN, options);

// https://dev.to/hrishikeshps/send-slack-notifications-via-nodejs-3ddn
export const sendSlackMessage = async (message: string, channel?: string) => {
  try {
    return new Promise(async (resolve, reject) => {
      if (!process.env.SLACK_TOKEN) {
        return resolve(true);
      }

      const channelId = channel || process.env.SLACK_CHANNEL_ID;
      try {
        await web.chat.postMessage({
          text: `${process.env.SLACK_NOTIFY_PREFIX}${message}`,
          channel: channelId,
        });
        return resolve(true);
      } catch (error) {
        log.error(`Error sending to slack. ${error}`);
        return resolve(true);
      }
    });
  } catch {
    log.error(`Error creating promise`);
  }
};
