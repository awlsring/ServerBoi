import dotenv from 'dotenv';

import { ServerCommandGroup } from "../src/interactions/objects/commands/server/group";

dotenv.config();

const token = process.env.DISCORD_TOKEN
const applicationId = process.env.APPLICATION_ID

const response = fetch(
  `https://discord.com/api/v10/applications/${applicationId}/commands`,
  {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bot ${token}`,
    },
    method: "PUT",
    body: JSON.stringify([ServerCommandGroup]),
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