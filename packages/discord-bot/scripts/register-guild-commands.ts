import dotenv from 'dotenv';

import { NoUUserCommand } from "../src/interactions/commands/nou/user";
import { NoUMessageCommand } from "../src/interactions/commands/nou/message";

dotenv.config();

const token = process.env.DISCORD_TOKEN
const applicationId = process.env.APPLICATION_ID

const scope = process.argv[2];
if (scope === undefined) {
  console.error("No scope provided");
  process.exit(1);
}

console.log("Registering slash commands...");
const response = fetch(
  `https://discord.com/api/v10/applications/${applicationId}/guilds/${scope}/commands`,
  {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bot ${token}`,
    },
    method: "PUT",
    body: JSON.stringify([NoUUserCommand.data, NoUMessageCommand.data]),
  }
);

response.then((response) => {
  console.log(response.status);

  if (response.ok) {
    console.log("Registered all commands");
  } else {
    console.error("Error registering commands");
    response.text().then((text) => console.error(text));
  }
});