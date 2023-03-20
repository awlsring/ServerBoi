$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@http(method: "POST", uri: "/server/track", code: 200)
operation TrackServer {
    input: TrackServerInput,
    output: TrackServerOutput,
    errors: [
        ValidationException
    ]
}

@input
structure TrackServerInput {
    @required
    application: String

    @required
    name: String,

    @required
    address: String,
    
    @required
    owner: String,

    platform: TrackServerPlatformInput

    capabilities: ServerCapabilities

    query: TrackServerQueryInput
}


structure TrackServerPlatformInput {
    @required
    type: ServerPlatform

    data: String
}

structure TrackServerQueryInput {
    @required
    type: ServerQueryType

    address: String

    port: Integer
}

@output
structure TrackServerOutput {
    @required
    summary: ServerSummary
}