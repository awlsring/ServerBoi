import { APIInteraction } from "discord-api-types/v10";
import { InteractionContext } from "../context";

export interface Component {
  identifier: string;
  enact(context: InteractionContext, interaction: APIInteraction): Promise<void>;
}