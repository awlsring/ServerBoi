$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@http(method: "POST", uri: "/server/track", code: 200)
operation TrackServer {
    input: TrackServerInput,
    output: TrackServerOutput,
    errors: [
        ValidationException,
        InternalServerError,
        InvalidInputError
    ]
}

@input
structure TrackServerInput {
    @required
    scope: String
    
    @required
    application: String

    @required
    name: String,

    @required
    address: String,
    
    @required
    owner: String,

    @required
    query: TrackServerQueryInput

    platform: TrackServerPlatformInput

    capabilities: ServerCapabilities
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