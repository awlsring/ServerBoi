$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@readonly
@http(method: "GET", uri: "/application/{name}", code: 200)
operation GetApplication {
    input: GetApplicationInput,
    output: GetApplicationOutput,
        errors: [
        ValidationException,
        InternalServerError,
        ResourceNotFoundError,
    ]
}

@input
structure GetApplicationInput {
    @httpLabel
    @required
    name: ApplicationName,
}

@output
structure GetApplicationOutput {
    @required
    summary: ApplicationSummary
}