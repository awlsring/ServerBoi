$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@readonly
@http(method: "GET", uri: "/execution", code: 200)
operation ListExecutions {
    input: ListExecutionsInput,
    output: ListExecutionsOutput,
    errors: [
        ValidationException,
        InternalServerError,
        InvalidInputError
    ]
}

@input 
structure ListExecutionsInput {}

@output
structure ListExecutionsOutput {
    @required
    summaries: ExecutionSummaries
}