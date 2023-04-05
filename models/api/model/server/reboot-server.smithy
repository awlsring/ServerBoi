$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@http(method: "POST", uri: "/server/{id}/reboot", code: 200)
operation RebootServer {
    input: RebootServerInput,
    output: RebootServerOutput,
    errors: [
        ValidationException,
        InternalServerError,
        ResourceNotFoundError,
        InvalidInputError
    ]
}

@input
structure RebootServerInput {
    @httpLabel
    @required
    id: ServerIdentifier,

    force: Boolean,
}

@output
structure RebootServerOutput {
    @required
    success: Boolean,
}