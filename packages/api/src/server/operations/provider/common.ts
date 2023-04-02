import { ProviderDto } from "@serverboi/services";
import { ProviderSummary } from "@serverboi/ssdk";

export function providerToSummary(provider: ProviderDto): ProviderSummary {
  return {
    name: provider.name,
    type: provider.type,
  };
}