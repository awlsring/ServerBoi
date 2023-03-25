import { APIApplicationCommandInteraction, APIInteraction, ApplicationCommandOptionType } from "discord-api-types/v10";
import { InteractionContext } from "../../context";

export interface CommandData {
  name: string;
  description: string;
  type?: ApplicationCommandOptionType;
  required?: boolean;
  choices?: CommandChoice[];
  options?: CommandData[];
}

export interface CommandChoice {
  name: string;
  value: string | number;
}

export interface CommandGroup {
  name: string;
  description: string;
  options: CommandData[];
}

export interface CommandComponentOptions {
  identifier: string;
  data: CommandData;
  enact: (context: InteractionContext, interaction: APIApplicationCommandInteraction) => Promise<void>;
}

export class CommandComponent {
  readonly identifier: string;
  readonly data: CommandData;
  readonly enact: (context: InteractionContext, interaction: APIApplicationCommandInteraction) => Promise<void>;

  constructor(options: CommandComponentOptions) {
    this.identifier = options.identifier;
    this.data = options.data;
    this.enact = options.enact;
  }
}