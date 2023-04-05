$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@http(method: "POST", uri: "/server/{id}/stop", code: 200)
operation StopServer {
    input: StopServerInput,
    output: StopServerOutput,
    errors: [
        ValidationException,
        InternalServerError,
        ResourceNotFoundError,
        InvalidInputError
    ]
}

@input
structure StopServerInput {
    @httpLabel
    @required
    id: ServerIdentifier,

    force: Boolean,
}

@output
structure StopServerOutput {
    @required
    success: Boolean,
}