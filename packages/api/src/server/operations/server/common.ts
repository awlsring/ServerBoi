import { ServerDto, ServerStatusDto, SteamStatusData } from "@serverboi/backend-common";
import { ServerQueryType, ServerStatus, ServerStatusSummary, ServerSummary } from "@serverboi/ssdk";

export function serverToSummary(server: ServerDto): ServerSummary {
  return {
    id: `${server.scopeId}-${server.serverId}`,
    name: server.name,
    connectivity: {
      address: server.address,
      port: server.port,
    },
    status: serverStatusToSummary(server.status),
    provider: server.provider ? {
      type: server.provider?.type,
      name: server.provider?.name,
      data: server.provider?.data ? server.provider?.data : undefined,
    } : undefined,
    providerServerData: {
      identifier: server.providerServerData?.identifier,
      location: server.providerServerData?.location,
      subType: server.providerServerData?.subType,
      data: server.providerServerData?.data ? server.providerServerData?.data : undefined,
    },
    query: {
      type: server.query.type,
      address: server.query.address,
      port: server.query.port,
    },
    location: {
      country: server.location.country,
      region: server.location.region,
      city: server.location.city,
      emoji: server.location.emoji,
    },
    application: server.application,
    capabilities: server.capabilities,
    added: server.added.getTime(),
    lastUpdated: server.lastUpdated?.getTime(),
    owner: server.owner,
  };
}

function serverStatusToSummary(status?: ServerStatusDto): ServerStatusSummary {
  if (!status) {
    return {
      status: ServerStatus.UNKNOWN,
    };
  }

  return {
    status: status.status,
    data: status.data ? status.data as any : undefined,
  };
}