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
    address: String,

    @required
    status: ServerStatusSummary,

    @required
    capabilities: ServerCapabilities,

    @required
    platform: ServerPlatformSummary,
    
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

structure ServerPlatformSummary {
    @required
    type: ServerPlatform,

    data: String,
}

structure ServerStatusSummary {
    @required
    status: ServerStatus,

    steam: SteamStatusSummary,
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
}

enum ServerPlatform {
    AWS_EC2 = "AWS_EC2",
    KUBERNETES = "KUBERNETES",
    DOCKER = "DOCKER",
    UNDEFINED = "UNDEFINED",
}

enum ServerQueryType {
    STEAM = "STEAM",
    HTTP = "HTTP",
    NONE = "NONE",
}