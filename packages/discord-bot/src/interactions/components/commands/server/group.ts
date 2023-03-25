import { CommandGroup } from "../command";
import { TrackCommand } from "./track";

export const ServerCommandGroup: CommandGroup = {
  name: "server",
  description: "Server command options.",
  options: [ TrackCommand.data ],
};
