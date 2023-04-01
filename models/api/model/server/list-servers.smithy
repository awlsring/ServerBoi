$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@readonly
@http(method: "GET", uri: "/server", code: 200)
operation ListServers {
    output: ListServersOutput,
        errors: [
        ValidationException,
        InternalServerError,
        InvalidInputError
    ]
}

@output
structure ListServersOutput {
    @required
    summaries: ServerSummaries
}