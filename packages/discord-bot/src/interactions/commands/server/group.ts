import { CommandGroup } from "../command";
import { TrackCommand } from "./track/track-server-command";

export const ServerCommandGroup: CommandGroup = {
  name: "server",
  description: "Server command options.",
  options: [ TrackCommand.data ],
};
