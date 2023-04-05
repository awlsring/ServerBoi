$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@http(method: "POST", uri: "/server/{id}/start", code: 200)
operation StartServer {
    input: StartServerInput,
    output: StartServerOutput,
    errors: [
        ValidationException,
        InternalServerError,
        ResourceNotFoundError,
    ]
}

@input
structure StartServerInput {
    @httpLabel
    @required
    id: ServerIdentifier,
}

@output
structure StartServerOutput {
    @required
    success: Boolean,
}