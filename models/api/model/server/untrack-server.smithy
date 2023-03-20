$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@idempotent
@http(method: "DELETE", uri: "/server/{id}", code: 200)
operation UntrackServer {
    input: UntrackServerInput,
    output: UntrackServerOutput,
    errors: [
        ValidationException
    ]
}

@input
structure UntrackServerInput {
    @required
    @httpLabel
    id: ServerIdentifier
}

@output
structure UntrackServerOutput {
    @required
    success: Boolean
}