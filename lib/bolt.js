import { App, LogLevel } from "@slack/bolt";

export default function (receiver) {
  const app = new App({
    receiver,
    token: process.env.SLACK_BOT_TOKEN,
    logLevel: LogLevel.DEBUG,
  });

  // Listens to incoming messages that contain "hello"
  app.event("reaction_added", async ({ event, say }) => {
    // say() sends a message to the channel where the event was triggered
    const message = await fetchMessage(event.item.channel, event.item.ts);
    console.log(message);

    const mimimied = message.replace(/[aáAÁeéEÉiíIÍoOóÓuúÚ]/g, "i");

    await say(mimimied);
  });

  async function fetchMessage(id, ts) {
    try {
      const result = await app.client.conversations.history({
        token: process.env.SLACK_BOT_TOKEN,
        channel: id,
        latest: ts,
        inclusive: true,
        limit: 1,
      });

      return result.messages[0].text;
    } catch (error) {
      console.error(error);
    }
  }
}
