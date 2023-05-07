$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@http(method: "POST", uri: "/server", code: 200)
operation CreateServer {
    input: CreateServerInput,
    output: CreateServerOutput,
    errors: [
        ValidationException,
        InternalServerError,
        InvalidInputError
    ]
}

@input
structure CreateServerInput {
    @required
    scope: String
    
    @required
    application: String

    @required
    name: String,

    @required
    providerOptions: CreateServerProviderOptions

    @required
    capabilities: ServerCapabilities
}

structure CreateServerProviderOptions {
    @required
    provider: String

    location: String

    data: Document
}

@output
structure CreateServerOutput {
    @required
    executionId: String
}