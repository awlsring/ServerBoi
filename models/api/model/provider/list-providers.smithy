$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@readonly
@http(method: "GET", uri: "/provider", code: 200)
operation ListProviders {
    input: ListProvidersInput,
    output: ListProvidersOutput,
    errors: [
        ValidationException,
        InternalServerError,
        InvalidInputError
    ]
}

@input 
structure ListProvidersInput {}

@output
structure ListProvidersOutput {
    @required
    summaries: ProviderSummaries
}