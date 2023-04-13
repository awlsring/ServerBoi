import { ProviderDto } from "@serverboi/backend-common";
import { ProviderSummary } from "@serverboi/ssdk";

export function providerToSummary(provider: ProviderDto): ProviderSummary {
  return {
    name: provider.name,
    type: provider.type,
    subType: provider.subType,
    data: provider.data as any,
  };
}