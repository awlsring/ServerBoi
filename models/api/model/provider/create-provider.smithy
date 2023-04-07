$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@http(method: "POST", uri: "/provider", code: 200)
operation CreateProvider {
    input: CreateProviderInput,
    output: CreateProviderOutput,
    errors: [
        ValidationException,
        InternalServerError,
        InvalidInputError
    ]
}

@input
structure CreateProviderInput {
    @required
    name: String

    @required
    type: ProviderType,
    
    @required
    auth: CreateProviderAuthInput

    data: String
}

structure CreateProviderAuthInput {
    @required
    key: String

    secret: String
}

@output
structure CreateProviderOutput {
    @required
    summary: ProviderSummary
}