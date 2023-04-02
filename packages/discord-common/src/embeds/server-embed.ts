import { Capabilities, ServerStatus } from "@serverboi/client";
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
  readonly address: string;
  readonly port?: number;
  readonly location: ServerLocation;
  readonly owner: string;
  readonly capabilities: Capabilities[];
  readonly description: string;
  readonly fields: APIEmbedField[];
  readonly provider?: ServerProvider;
}

export abstract class ServerEmbed {
  readonly ownerId: string;
  readonly embed: Embed;

  constructor(options: ServerEmbedOptions) {
    this.ownerId = options.owner;
    this.embed = new Embed({
      type: EmbedType.Rich,
      title: `${options.serverName} (${options.serverId})`,
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

  protected static formStatusString(status: string): string {
    switch (status) {
      case ServerStatus.RUNNING:
        return `🟢 Running`;
      case ServerStatus.STOPPED:
        return `🔴 Stopped`;
      default:
        return `Unknown`;
    }
  }

  protected formFooter(provider?: ServerProvider): string {
    if (!provider) {
      return `🕛 Updated: ${this.getUpdateTime()}`;
    }
    return `🌐 Hosted on ${provider.name} in ${provider.location} | 🕛 Updated: ${this.getUpdateTime()}`;
  }

  protected static formLocationString(location: ServerLocation): string {
    if (location.country.toLocaleLowerCase() === "us") {
      return `${location.emoji} ${location.city}, ${location.region}`;
    }
    return `${location.emoji} ${location.city}, ${location.country}`;
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