$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@idempotent
@http(method: "PUT", uri: "/server/{id}", code: 200)
operation UpdateServer {
    input: UpdateServerInput,
    output: UpdateServerOutput,
    errors: [
        ValidationException,
        InternalServerError,
        ResourceNotFoundError,
        InvalidInputError
    ]
}

@input
structure UpdateServerInput {
    @httpLabel
    @required
    id: ServerIdentifier,

    name: String,

    application: String

    address: String,
}

@output
structure UpdateServerOutput {
    @required
    summary: ServerSummary
}