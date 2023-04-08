import { CommandGroup } from "../command";
import { CreateProviderCommand } from "./create/create-provider-command";
import { DescribeProviderCommand } from "./describe/describe-provider-command";
import { GetProviderCommand } from "./get/get-provider-command";
import { RemoveProviderCommand } from "./remove/remove-provider-command";

export const ProviderCommandGroup: CommandGroup = {
  name: "provider",
  description: "Provider command options.",
  options: [ CreateProviderCommand.data, GetProviderCommand.data, DescribeProviderCommand.data, RemoveProviderCommand.data ],
};
