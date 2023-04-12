import { Capabilities, ServerConnectivitySummary, ServerLocationSummary, ServerQueryType, ServerStatus, ServerStatusSummary, ServerSummary } from "@serverboi/client";
import { EmbedType, RESTPostAPIChannelMessageJSONBody, APIActionRowComponent, APIMessageActionRowComponent, APIEmbedField, APIEmbed} from "discord-api-types/v10";
import { StartServerButton } from "../interactions/components/button/server/start-server";
import { StopServerButton } from "../interactions/components/button/server/stop-server";
import { ServerMoreActionsMenu } from "../interactions/components/menus/server-more-actions";

export interface SteamStatusData {
  readonly name: string;
  readonly map: string;
  readonly game: string;
  readonly gameId: number;
  readonly players: number;
  readonly maxPlayers: number;
  readonly visibility: number;
}

export enum ServerEmbedColor {
  Green = 0x00ff00,
  Red = 0xff0000,
  Yellow = 0xffff00,
}

export enum ServerEmbedMoreActions {
  Remove = `remove`,
}

export interface ServerActionsOptions {
  readonly moreActions: ServerEmbedMoreActions[];
}

export function formServerEmbedMessage(summary: ServerSummary): RESTPostAPIChannelMessageJSONBody {
  return {
    content: `Owner: <@${summary.owner}>`,
    embeds: [createEmbed(summary)],
    components: [
      generateControlButtons(summary),
      generateActionsMenu(),
    ],
    allowed_mentions: {
      users: []
    }
  } 
}

function createEmbed(summary: ServerSummary): APIEmbed {
  return {
    type: EmbedType.Rich,
    title: `${summary.name} (${summary.id?.split("-")[1] ?? "Unknown"})`,
    description: formDescription(summary),
    color: determineColor(summary.status?.status),
    fields: formFields(summary),
    thumbnail: {
      url: setThumbnailUrl(summary.application ?? ""),
    },
    footer: {
      text: formFooter(summary),
    },
  }
}

function formDescription(summary: ServerSummary): string {
  switch (summary.query?.type) {
    case ServerQueryType.STEAM:
      return formSteamConnectString(summary.connectivity, summary.query?.address, summary.query?.port);
    default:
      return `Connect: ${fromAddressString(summary.connectivity)}`;
  }
}

function formSteamConnectString(connectivity?: ServerConnectivitySummary, steamAddress?: string, steamPort?: number): string {
  let address = "unknown";
  let port = 0;
  if (connectivity?.address) {
    address = connectivity.address;
  }

  if (connectivity?.port) {
    port = connectivity.port;
  }

  if (steamAddress) {
    address = steamAddress;
  }
  if (steamPort) {
    port = steamPort;
  }
  return `Connect: steam://connect/${address}:${port}`;
}

function formFields(summary: ServerSummary) {
  switch (summary.query?.type) {
    case ServerQueryType.STEAM:
      return formSteamFields(summary);
    default:
      return formGenericFields(summary);
  }
}

function formSteamFields(summary: ServerSummary): APIEmbedField[] {
  return [
    formStatusField(summary.status),
    formBlankField(),
    formAddressField(summary.connectivity),
    formLocationField(summary.location),
    formGameField(summary.application),
    formPlayersField(summary.status?.data),
  ]
}

function formHttpFields(summary: ServerSummary): APIEmbedField[] {
  return [
    formStatusField(summary.status),
    formBlankField(),
    formAddressField(summary.connectivity),
    formLocationField(summary.location),
    formBlankField(),
    formApplicationField(summary.application),
  ]
}

function formGenericFields(summary: ServerSummary): APIEmbedField[] {
  return [
    formStatusField(summary.status),
    formBlankField(),
    formAddressField(summary.connectivity),
    formLocationField(summary.location),
    formBlankField(),
    formApplicationField(summary.application),
  ]
}

function formBlankField(): APIEmbedField {
  return {
    name: "\u200b",
    value: "\u200b",
    inline: true
  }
}

function formAddressField(connectivity?: ServerConnectivitySummary): APIEmbedField {
  let address = fromAddressString(connectivity);

  return {
    name: "Address",
    value: `\`${address}\``,
    inline: true
  }
}

function formLocationField(summary?: ServerLocationSummary): APIEmbedField {
  let location = "Unknown";
  if (summary) {
    if (summary.country === "US") {
      location = `${summary.emoji} ${summary.city}, ${summary.region}`;
    } else if (summary.city === "Private" || summary.city === "Unknown" || summary.city === "Tailscale") {
      location = `${summary.emoji} ${summary.city}`;
    } 
    else {
      location = `${summary.emoji} ${summary.city}, ${summary.country}`;
    }
  }
  return {
    name: "Location",
    value: location,
    inline: true
  }
}

function fromAddressString(connectivity?: ServerConnectivitySummary): string {
  let address = "";
  if (connectivity?.address) {
    address = connectivity.address;
  }
  if (connectivity?.port) {
    if (connectivity.port != 80 && connectivity.port != 443) {
      address += `:${connectivity.port}`;
    }
  }
  if (address.includes("http") || address.includes("https")) {
    return address;
  }
  if (connectivity?.port) {
    if (connectivity.port == 80) {
      return `http://${address}`;
    }
    if (connectivity.port == 443) {
      return `https://${address}`;
    }
  }
  return address;
}

function formStatusField(summary?: ServerStatusSummary): APIEmbedField {
  let emoji = "❔";
  let status = "Unknown";
  if (summary?.status) {
    status = summary.status;
    switch (status) {
      case ServerStatus.RUNNING:
        emoji = `🟢`;
        break;
      case ServerStatus.STARTING:
      case ServerStatus.REBOOTING:
        emoji = `🟡`;
      case ServerStatus.STOPPING:
      case ServerStatus.UNREACHABLE:
      case ServerStatus.STOPPED:
        emoji = "🔴";
        break;
      default:
        emoji = "❔";
    }
  }

  const lowercased = status.toLowerCase();
  const capitalized = lowercased.charAt(0).toUpperCase() + lowercased.slice(1);
  const statusString = `${emoji} ${capitalized}`;

  return {
    name: "Status",
    value: statusString,
    inline: true
  }
}

function formGameField(application?: string): APIEmbedField {
  let game = "Unknown";
  if (application) {
    game = application;
  }
  return {
    name: "Game",
    value: game,
    inline: true
  }
}

function formPlayersField(summary: any): APIEmbedField {
  let players = 0;
  let maxPlayers = 0;

  if (summary) {
    if (summary instanceof Object && "players" in summary && "maxPlayers" in summary) {
      const sum = summary as unknown as SteamStatusData
      if (summary.players) {
        players = sum.players;
      }
      if (summary.maxPlayers) {
        maxPlayers = sum.maxPlayers;
      }
    }

  }

  return {
    name: "Players",
    value: `${players}/${maxPlayers}`,
    inline: true
  }
}

function generateControlButtons(summary: ServerSummary): APIActionRowComponent<APIMessageActionRowComponent> {
  let startEnabled = false;
  let stopEnabled = false;
  let rebootEnabled = false;

  if (summary.provider && summary.providerServerData && summary.capabilities) {
    summary.capabilities.forEach(capability => {
      switch (capability) {
        case Capabilities.START:
          startEnabled = true;
          break;
        case Capabilities.STOP:
          stopEnabled = true;
          break;
        case Capabilities.REBOOT:
          rebootEnabled = true;
          break;
      }
    });
  }
  
  return {
    type: 1,
    components: [
      StartServerButton.formButton(startEnabled),
      StopServerButton.formButton(stopEnabled),
    ]
  }
}

function generateActionsMenu(): APIActionRowComponent<APIMessageActionRowComponent> {
  return {
    type: 1,
    components: [
      ServerMoreActionsMenu.toApiDataWithOptions([ServerEmbedMoreActions.Remove]), // make this better
    ]
  }
}

function getUpdateTime(): string {
  const date = new Date();

  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds} UTC`;
}

function determineColor(status?: string): ServerEmbedColor {
  switch (status) {
    case ServerStatus.RUNNING:
      return ServerEmbedColor.Green;
    default:
      return ServerEmbedColor.Red;
  }
}

function formApplicationField(application?: string): APIEmbedField {
  let app = "Unknown";
  if (application) {
    app = application;
  }
  return {
    name: "Application",
    value: app,
    inline: true
  }
}

function formFooter(summary: ServerSummary): string {
  if (!summary.provider) {
    return `🕛 Updated: ${getUpdateTime()}`;
  }


  return `🌐 Hosted on ${summary.provider.type} in ${summary.providerServerData?.location ?? summary.provider.name} | 🕛 Updated: ${getUpdateTime()}`;
}

function setThumbnailUrl(application: string): string {
  switch (application.toLocaleLowerCase()) {
    case "jellyfin":
      return "https://pcbwayfile.s3-us-west-2.amazonaws.com/project/21/04/26/1557005893806.png";
      case "valheim":
        return "https://preview.redd.it/f6nbziz4ghh61.gif?width=858&auto=webp&s=27ca2c36dc194caaa1a789f4a2547f9e716c95bf";
    default:
      return "https://giphy.com/embed/ITRemFlr5tS39AzQUL";
  }
}