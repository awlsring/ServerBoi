import { CommandGroup } from "../command";
import { CreateProviderCommand } from "./create/create-provider-command";
import { GetProviderCommand } from "./get/get-provider-command";

export const ProviderCommandGroup: CommandGroup = {
  name: "provider",
  description: "Provider command options.",
  options: [ CreateProviderCommand.data, GetProviderCommand.data ],
};
