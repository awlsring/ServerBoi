import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
const token = process.env.DISCORD_TOKEN
const applicationId = process.env.APPLICATION_ID

console.log('Deleting all slash commands...');
console.log('ApplicationId:', applicationId);

const headers = {
  Authorization: `Bot ${token}`,
  'Content-Type': 'application/json',
};

async function deleteAllSlashCommands() {
  try {
    // Fetch all slash commands registered to the application
    const response = await fetch(`https://discord.com/api/v10/applications/${applicationId}/commands`, { headers });
    console.log(response.status)
    if (!response.ok) {
      console.log('No commands found.');
      return;
    }

    const commands: any = await response.json();
    console.log('Commands:', commands);
    // Delete each command
    for (const command of commands) {
      console.log(command)
      await fetch(`https://discord.com/api/v10/applications/${applicationId}/commands/${command.id}`, { method: 'DELETE', headers });
      console.log(`Deleted command ${command.name}`);
    }

    console.log('All commands have been deleted.');
  } catch (error) {
    console.error('Error deleting commands:', error);
  }
}

deleteAllSlashCommands();
