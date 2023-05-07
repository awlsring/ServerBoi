$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@idempotent
@http(method: "DELETE", uri: "/server/{id}", code: 200)
operation DeleteServer {
    input: DeleteServerInput,
    output: DeleteServerOutput,
    errors: [
        ValidationException,
        ResourceNotFoundError,
        InternalServerError,
        InvalidInputError
    ]
}

@input
structure DeleteServerInput {
    @required
    @httpLabel
    id: ServerIdentifier
}

@output
structure DeleteServerOutput {
    @required
    success: Boolean
}