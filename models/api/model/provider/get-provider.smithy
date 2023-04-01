$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@readonly
@http(method: "GET", uri: "/provider/{name}", code: 200)
operation GetProvider {
    input: GetProviderInput,
    output: GetProviderOutput,
        errors: [
        ValidationException,
        InternalServerError,
        ResourceNotFoundError,
    ]
}

@input
structure GetProviderInput {
    @httpLabel
    @required
    name: ProviderIdentifier,
}

@output
structure GetProviderOutput {
    @required
    summary: ProviderSummary
}