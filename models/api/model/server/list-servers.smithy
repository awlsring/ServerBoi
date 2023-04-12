$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@readonly
@http(method: "GET", uri: "/server", code: 200)
operation ListServers {
    input: ListServersInput,
    output: ListServersOutput,
    errors: [
        ValidationException,
        InternalServerError,
        InvalidInputError
    ]
}

@input
structure ListServersInput {
    @httpQuery("scope")
    scope: String,
}

@output
structure ListServersOutput {
    @required
    summaries: ServerSummaries
}