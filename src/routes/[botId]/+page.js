/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
  // fetch the bots from your API
  const botsRes = await fetch('/api/bots');
  const bots = await botsRes.json();

  const botId = params.botId;
  const bot = bots[botId];

  if (!bot) {
    // Optionally, throw an error here to show a 404 if the bot doesn't exist
    throw new Error('Bot not found');
  }

  return { bot };
}
