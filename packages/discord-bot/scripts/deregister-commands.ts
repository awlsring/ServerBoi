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

async function deleteGuildSlashCommands(guild: string) {
  try {
    // Fetch all slash commands registered to the application
    const response = await fetch(`https://discord.com/api/v10/applications/${applicationId}/guilds/${guild}/commands`, { headers });
    console.log(response.status)
    if (!response.ok) {
      console.log('No commands found.');
      return;
    }

    const commands: any = await response.json();
    console.log('Commands:', commands);
    // Delete each command

    if (commands.length === 0) {
      console.log('No commands found.');
      return;
    }

    for (const command of commands) {
      console.log(command)
      await fetch(`https://discord.com/api/v10/applications/${applicationId}/guilds/${guild}/commands/${command.id}`, { method: 'DELETE', headers });
      console.log(`Deleted command ${command.name}`);
    }

    console.log('All commands have been deleted.');
  } catch (error) {
    console.error('Error deleting commands:', error);
  }
}


function main() {
  const scope = process.argv[2];
  if (scope === 'all') {
    deleteAllSlashCommands();
    return;
  }
  if (scope) {
    deleteGuildSlashCommands(scope);
    return
  }
  console.log('No scope provided. Use "all" to delete all commands or a guild id to delete commands for a specific guild.');
}

main()