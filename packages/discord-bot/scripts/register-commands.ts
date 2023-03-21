import fetch from "node-fetch";
import dotenv from 'dotenv';
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
    body: JSON.stringify([]),
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