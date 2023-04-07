import { CommandGroup } from "../command";
import { CreateProviderCommand } from "./create/create-provider-command";

export const ProviderCommandGroup: CommandGroup = {
  name: "provider",
  description: "Provider command options.",
  options: [ CreateProviderCommand.data ],
};
