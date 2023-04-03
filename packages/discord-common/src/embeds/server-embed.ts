import { ServerConnectivitySummary, ServerLocationSummary, ServerStatus, ServerStatusSummary } from "@serverboi/client";
import { EmbedType, RESTPostAPIChannelMessageJSONBody, APIActionRowComponent, APIMessageActionRowComponent, APIButtonComponent, APIEmbedField, APIEmbed} from "discord-api-types/v10";
import { StartServerButton } from "../interactions/components/button/server/start-server";
import { StopServerButton } from "../interactions/components/button/server/stop-server";
import { ServerMoreActionsMenu } from "../interactions/components/menus/server-more-actions";
import { Embed } from "./embed";

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


export interface ServerLocation {
  readonly city: string;
  readonly country: string;
  readonly region: string;
  readonly emoji: string;
}

export interface ServerProvider {
  readonly name: string;
  readonly location: string;
}

export interface ServerEmbedOptions {
  readonly serverId: string;
  readonly serverName: string;
  readonly application: string;
  readonly status: string;
  readonly owner: string;
  readonly capabilities: string[];
  readonly description: string;
  readonly fields: APIEmbedField[];
  readonly provider?: ServerProvider;
  readonly startEnabled?: boolean;
  readonly stopEnabled?: boolean;
}

export abstract class ServerEmbed {
  readonly ownerId: string;
  readonly startButtonEnabled: boolean;
  readonly stopButtonEnabled: boolean;
  readonly embed: Embed;

  constructor(options: ServerEmbedOptions) {
    this.ownerId = options.owner;
    this.startButtonEnabled = options.startEnabled ?? false;
    this.stopButtonEnabled = options.stopEnabled ?? false;
    const id = options.serverId.split("-")[1] ?? "Unknown";
    this.embed = new Embed({
      type: EmbedType.Rich,
      title: `${options.serverName} (${id})`,
      description: options.description,
      color: this.determineColor(options.status),
      fields: options.fields,
      thumbnail: {
        url: this.getThumbnailUrl(options.application),
      },
      footer: {
        text: this.formFooter(options.provider),
      },
    })
  }

  protected abstract getThumbnailUrl(application: string): string;

  protected getUpdateTime(): string {
    const date = new Date();

    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds} UTC`;
  }

  protected determineColor(status: string): ServerEmbedColor {
    switch (status) {
      case ServerStatus.RUNNING:
        return ServerEmbedColor.Green;
      default:
        return ServerEmbedColor.Red;
    }
  }

  protected static formBlankField(): APIEmbedField {
    return {
      name: "\u200b",
      value: "\u200b",
      inline: true
    }
  }

  protected static fromAddressString(connectivity?: ServerConnectivitySummary): string {
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

  protected static formApplicationField(application?: string): APIEmbedField {
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

  protected static formAddressField(connectivity?: ServerConnectivitySummary): APIEmbedField {
    let address = this.fromAddressString(connectivity);

    return {
      name: "Address",
      value: `\`${address}\``,
      inline: true
    }
  }

  protected static formStatusField(summary?: ServerStatusSummary): APIEmbedField {
    let status = "Unknown";
    if (summary?.status) {
      switch (summary.status) {
        case ServerStatus.RUNNING:
          status = `🟢 Running`;
          break;
        case ServerStatus.UNREACHABLE:
        case ServerStatus.STOPPED:
          status = `🔴 Stopped`;
          break;
        default:
          status = `Unknown`;
      }
    }
    return {
      name: "Status",
      value: status,
      inline: true
    }
  }

  protected formFooter(provider?: ServerProvider): string {
    if (!provider) {
      return `🕛 Updated: ${this.getUpdateTime()}`;
    }
    return `🌐 Hosted on ${provider.name} in ${provider.location} | 🕛 Updated: ${this.getUpdateTime()}`;
  }

  protected static formLocationField(summary?: ServerLocationSummary): APIEmbedField {
    let location = "Unknown";
    if (summary) {
      if (summary.country?.toLocaleLowerCase() === "us") {
        location = `${summary.emoji} ${summary.city}, ${summary.region}`;
      }
      location = `${summary.emoji} ${summary.city}, ${summary.country}`;
    }
    return {
      name: "Location",
      value: location,
      inline: true
    }
  }

  private serverActions(options: ServerActionsOptions): APIActionRowComponent<APIMessageActionRowComponent>[] {
    const buttons: APIButtonComponent[] = [];
    // if (!(!this.startButtonEnabled && !this.startButtonEnabled)) {
    buttons.push(StartServerButton.formButton(this.startButtonEnabled))
    buttons.push(StopServerButton.formButton(this.stopButtonEnabled))
    // }
    const rows: APIActionRowComponent<APIMessageActionRowComponent>[] = [];
    if (buttons.length != 0) {
      rows.push({
        type: 1,
        components: [...buttons],
      })
    }
    rows.push({
      type: 1,
      components: [
        ServerMoreActionsMenu.toApiDataWithOptions(options.moreActions),
      ]
    })
    return rows
  }

  public toApiData(): APIEmbed {
    return this.embed.toApiData();
  }

  public toMessage(actions?: ServerEmbedMoreActions[]): RESTPostAPIChannelMessageJSONBody {
    return {
      content: `Owner: <@${this.ownerId}>`,
      embeds: [this.embed.toApiData()],
      components: this.serverActions({
        moreActions: actions ?? [ServerEmbedMoreActions.Remove]
      }),
      allowed_mentions: {
        users: []
      }
    }
  }
}