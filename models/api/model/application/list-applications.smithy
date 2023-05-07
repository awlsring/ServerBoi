$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@readonly
@http(method: "GET", uri: "/application", code: 200)
operation ListApplications {
    input: ListApplicationsInput,
    output: ListApplicationsOutput,
    errors: [
        ValidationException,
        InternalServerError,
        InvalidInputError
    ]
}

@input 
structure ListApplicationsInput {}

@output
structure ListApplicationsOutput {
    @required
    summaries: ApplicationSummaries
}