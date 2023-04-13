$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

resource Server {
    identifiers: { id: ServerIdentifier },
    read: GetServer,
    list: ListServers,
    update: UpdateServer,
    create: TrackServer,
    delete: UntrackServer,
    operations: [
        StartServer,
        StopServer,
        RebootServer,
    ],
}

string ServerIdentifier

structure ServerSummary {
    @required
    id: ServerIdentifier,

    @required
    name: String,

    @required
    application: String,

    @required
    connectivity: ServerConnectivitySummary,

    @required
    status: ServerStatusSummary,

    @required
    capabilities: ServerCapabilities,

    provider: ProviderSummary,
    
    providerServerData: ServerProviderDataSummary,
    
    @required
    query: ServerQuerySummary,

    @required
    location: ServerLocationSummary,

    @required
    added: Long,

    lastUpdated: Long,

    @required
    owner: String,
}

structure ServerConnectivitySummary {
    @required
    address: String,

    @required
    port: Integer,
}

structure ServerLocationSummary {
    @required
    city: String,

    @required
    region: String,

    @required
    country: String,

    @required
    emoji: String,
}

structure ServerProviderDataSummary {
    @required
    identifier: String

    location: String

    data: Document
}

structure ServerStatusSummary {
    @required
    status: ServerStatus,

    query: QueryServerStatus,

    provider: ProviderServerStatus,

    data: Document,
}

structure SteamStatusSummary {
    @required
    name: String,

    @required
    map: String,

    @required
    game: String,

    @required
    gameId: Integer,

    @required
    players: Integer,

    @required
    maxPlayers: Integer,

    @required
    visibility: Integer,
}

structure HTTPStatusSummary {

}

structure ServerQuerySummary {
    @required
    type: ServerQueryType,

    address: String,

    port: Integer,
}

list ServerSummaries {
    member: ServerSummary
}

enum Capabilities {
    START = "START",
    STOP = "STOP",
    REBOOT = "REBOOT",
    READ = "READ",
    QUERY = "QUERY",
}

list ServerCapabilities {
    member: Capabilities
}

enum ServerStatus {
    RUNNING = "RUNNING",
    STARTING = "STARTING",
    STOPPING = "STOPPING",
    REBOOTING = "REBOOTING",
    STOPPED = "STOPPED",
    UNREACHABLE = "UNREACHABLE",
    UNREACHABLE_RUNNING = "UNREACHABLE_RUNNING",
    UNKNOWN = "UNKNOWN",
}

enum ProviderServerStatus {
    RUNNING = "RUNNING",
    STARTING = "STARTING",
    STOPPING = "STOPPING",
    REBOOTING = "REBOOTING",
    STOPPED = "STOPPED",
}

enum QueryServerStatus {
    REACHABLE = "REACHABLE",
    UNREACHABLE = "UNREACHABLE",
}

enum ServerQueryType {
    STEAM = "STEAM",
    HTTP = "HTTP",
    NONE = "NONE",
}