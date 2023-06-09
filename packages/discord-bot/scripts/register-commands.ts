import dotenv from 'dotenv';

import { ServerCommandGroup } from "../src/interactions/commands/server/group";
import { ProviderCommandGroup } from "../src/interactions/commands/provider/group";
import { NoUUserCommand } from '../src/interactions/commands/nou/user';
import { NoUMessageCommand } from '../src/interactions/commands/nou/message';

dotenv.config();

const token = process.env.DISCORD_TOKEN
const applicationId = process.env.APPLICATION_ID

console.log("Registering slash commands...");
const response = fetch(
  `https://discord.com/api/v10/applications/${applicationId}/commands`,
  {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bot ${token}`,
    },
    method: "PUT",
    body: JSON.stringify([ServerCommandGroup, ProviderCommandGroup, NoUUserCommand.data, NoUMessageCommand.data]),
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