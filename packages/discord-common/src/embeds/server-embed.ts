import { ServerStatus } from "@serverboi/client";
import { EmbedType, APIStringSelectComponent, APISelectMenuOption, RESTPostAPIChannelMessageJSONBody, APIActionRowComponent, APIMessageActionRowComponent} from "discord-api-types/v10";
import { StartServerButton } from "../interactions/components/button/server/start-server";
import { StopServerButton } from "../interactions/components/button/server/stop-server";
import { Embed, EmbedOptions } from "./embed";

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

export class ServerEmbed extends Embed {
  constructor(options: EmbedOptions) {
    super({
      type: EmbedType.Rich,
      ...options
    });
  }

  protected static getUpdateTime(): string {
    const date = new Date();

    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds} UTC`;
  }

  protected static determineColor(status: string): ServerEmbedColor {
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
      placeholder: `More actions`,
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

  public toMessage(startEnabled: boolean, stopEnabled: boolean, actions?: ServerEmbedMoreActions[]): RESTPostAPIChannelMessageJSONBody {
    return {
      embeds: [this.toApiData()],
      components: this.serverActions({
        startEnabled: startEnabled,
        stopEnabled: stopEnabled,
        moreActions: actions ?? [ServerEmbedMoreActions.Remove]
      })
    }
  }
}