import { InteractionContext } from "../../../context";
import { ServerButton } from "./server-button";

export class StartServerButton extends ServerButton {
  public static readonly identifier = "server-action-start";
  protected static readonly style = 1;
  protected static readonly label = "Start";

  public async enact(context: InteractionContext, _: any) {

  }
}
