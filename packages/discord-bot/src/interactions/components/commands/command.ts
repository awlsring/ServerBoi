import { APIApplicationCommandInteraction, APIInteraction, ApplicationCommandOptionType } from "discord-api-types/v10";
import { InteractionContext } from "../../context";
import { Component } from "../component";

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

export abstract class CommandComponent extends Component {
  protected static readonly data: CommandData;
  abstract enact(context: InteractionContext, interaction: APIApplicationCommandInteraction): Promise<void>;
}