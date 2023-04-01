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
    connectivity: ServerConnectivitySummary,
    
    @required
    owner: String,

    @required
    query: TrackServerQueryInput

    provider: TrackServerProviderInput

    providerServerData: TrackServerProviderDataInput

    capabilities: ServerCapabilities
}


structure TrackServerProviderInput {
    @required
    id: String

    @required
    name: String

    @required
    type: ProviderType
}

structure TrackServerProviderDataInput {
    @required
    identifier: String

    location: String

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