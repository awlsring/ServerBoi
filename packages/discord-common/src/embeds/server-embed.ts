import { ServerConnectivitySummary, ServerLocationSummary, ServerStatus, ServerStatusSummary } from "@serverboi/client";
import { EmbedType, APIStringSelectComponent, APISelectMenuOption, RESTPostAPIChannelMessageJSONBody, APIActionRowComponent, APIMessageActionRowComponent, APIButtonComponent, APIEmbedField, APIEmbed} from "discord-api-types/v10";
import { StartServerButton } from "../interactions/components/button/server/start-server";
import { StopServerButton } from "../interactions/components/button/server/stop-server";
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
  startEnabled: boolean;
  stopEnabled: boolean;
  moreActions: ServerEmbedMoreActions[];
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
}

export abstract class ServerEmbed {
  readonly ownerId: string;
  readonly embed: Embed;

  constructor(options: ServerEmbedOptions) {
    this.ownerId = options.owner;
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
      address += `:${connectivity.port}`;
    }
    return address;
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
    console.log(JSON.stringify(summary));
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

  private makeMoreActionsSelect(options: ServerEmbedMoreActions[]): APIStringSelectComponent {
    const opts: APISelectMenuOption[] = []

    options.forEach((option) => {
      switch (option) {
        case ServerEmbedMoreActions.Remove:
          opts.push({
            label: `Remove`,
            value: `remove`,
            description: `Stop tracking server`,
            default: false
          })
          break
        default:
          break
      }
    })

    return {
      custom_id: `server-action-more`,
      placeholder: `Actions`,
      options: opts,
      min_values: 1,
      max_values: 1,
      type: 3
    }
  }

  private serverActions(options: ServerActionsOptions): APIActionRowComponent<APIMessageActionRowComponent>[] {
    return [
      {
        type: 1,
        components: [
          StartServerButton.formButton(options.startEnabled),
          StopServerButton.formButton(options.stopEnabled),
        ],
      },
      {
        type: 1,
        components: [
          this.makeMoreActionsSelect(options.moreActions)
        ]
      }
    ]
  }

  public toApiData(): APIEmbed {
    return this.embed.toApiData();
  }

  public toMessage(startEnabled: boolean, stopEnabled: boolean, actions?: ServerEmbedMoreActions[]): RESTPostAPIChannelMessageJSONBody {
    return {
      content: `Owner: <@${this.ownerId}>`,
      embeds: [this.embed.toApiData()],
      components: this.serverActions({
        startEnabled: startEnabled,
        stopEnabled: stopEnabled,
        moreActions: actions ?? [ServerEmbedMoreActions.Remove]
      }),
      allowed_mentions: {
        users: []
      }
    }
  }
}