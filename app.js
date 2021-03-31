import { App } from "@slack/bolt";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Listens to incoming messages that contain "hello"
app.event("reaction_added", async ({ event, say }) => {
  // say() sends a message to the channel where the event was triggered
  const message = await fetchMessage(event.item.channel, event.item.ts);
  console.log(message);

  const mimimied = message.replace(/[aáAÁeéEÉiíIÍoOóÓuúÚ]/g, "i");

  await say(mimimied);
});

// Fetch conversation history using the ID and a TS from the last example
async function fetchMessage(id, ts) {
  try {
    // Call the conversations.history method using the built-in WebClient
    const result = await app.client.conversations.history({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN,
      channel: id,
      // In a more realistic app, you may store ts data in a db
      latest: ts,
      // Limit results
      inclusive: true,
      limit: 1,
    });

    // There should only be one result (stored in the zeroth index)
    return result.messages[0].text;
  } catch (error) {
    console.error(error);
  }
}

export default (async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
