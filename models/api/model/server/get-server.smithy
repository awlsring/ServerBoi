$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@readonly
@http(method: "GET", uri: "/server/{id}", code: 200)
operation GetServer {
    input: GetServerInput,
    output: GetServerOutput,
        errors: [
        ValidationException,
        InternalServerError,
        ResourceNotFoundError,
    ]
}

@input
structure GetServerInput {
    @httpLabel
    @required
    id: ServerIdentifier,
}

@output
structure GetServerOutput {
    @required
    summary: ServerSummary
}