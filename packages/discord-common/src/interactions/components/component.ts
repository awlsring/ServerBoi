import { APIInteraction } from "discord-api-types/v10";
import { InteractionContext } from "../context";

export abstract class Component {
  static readonly identifier: string;
  getIdentifier(): string {
    return (this.constructor as typeof Component).identifier;
  }
  abstract enact(context: InteractionContext, interaction: APIInteraction): Promise<void>;
}