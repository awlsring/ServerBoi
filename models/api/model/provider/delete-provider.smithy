$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@idempotent
@http(method: "DELETE", uri: "/provider/{name}", code: 200)
operation DeleteProvider {
    input: DeleteProviderInput,
    output: DeleteProviderOutput,
    errors: [
        ValidationException,
        InternalServerError,
        ResourceNotFoundError,
    ]
}

@input
structure DeleteProviderInput {
    @required
    @httpLabel
    name: ProviderIdentifier
}

@output
structure DeleteProviderOutput {
    @required
    success: Boolean
}