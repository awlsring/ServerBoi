$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@http(method: "POST", uri: "/track", code: 200)
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
    connectivity: ServerConnectivitySummary,
    
    @required
    query: TrackServerQueryInput

    provider: String

    providerServerData: TrackServerProviderDataInput

    capabilities: ServerCapabilities
}

structure TrackServerProviderDataInput {
    @required
    identifier: String

    location: String

    data: Document
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