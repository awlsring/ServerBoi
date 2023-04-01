import { Server } from "@serverboi/services";
import { ServerSummary } from "@serverboi/ssdk";

export function serverToSummary(server: Server): ServerSummary {
  return {
    id: server.id,
    name: server.name,
    address: server.address,
    status: {
      status: server.status.status,
      steam: server.status.steam,
    },
    platform: {
      type: server.platform.type,
      data: server.platform.data,
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