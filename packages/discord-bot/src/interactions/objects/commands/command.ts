import { APIApplicationCommandInteraction, APIInteraction, ApplicationCommandOptionType } from "discord-api-types/v10";
import { FastifyReply } from "fastify";
import { InteractionContext } from "../../context";

export interface Command {
  enact: (context: InteractionContext, interaction: APIApplicationCommandInteraction) => Promise<void>;
  data: CommandData;
}

export interface CommandData {
  name: string;
  description: string;
  type?: ApplicationCommandOptionType;
  required?: boolean;
  choices?: CommandChoice[];
  options?: CommandData[];
  enact?: (interaction: APIInteraction, response: FastifyReply) => Promise<void>;
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