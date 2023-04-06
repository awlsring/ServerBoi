import { CommandGroup } from "../command";
import { CreateProviderCommand } from "./create";

export const ProviderCommandGroup: CommandGroup = {
  name: "provider",
  description: "Provider command options.",
  options: [ CreateProviderCommand.data ],
};
