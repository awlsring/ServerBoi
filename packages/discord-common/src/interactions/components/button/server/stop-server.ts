import { InteractionContext } from "../../../context";
import { ServerButton } from "./server-button";

export class StopServerButton extends ServerButton {
  public static readonly identifier = "server-action-stop";
  protected static readonly style = 1;
  protected static readonly label = "Stop";

  public async enact(context: InteractionContext, _: any) {

  }
}
