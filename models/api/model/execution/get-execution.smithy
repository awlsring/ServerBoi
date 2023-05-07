$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@readonly
@http(method: "GET", uri: "/execution/{id}", code: 200)
operation GetExecution {
    input: GetExecutionInput,
    output: GetExecutionOutput,
        errors: [
        ValidationException,
        InternalServerError,
        ResourceNotFoundError,
    ]
}

@input
structure GetExecutionInput {
    @httpLabel
    @required
    id: ExecutionId,
}

@output
structure GetExecutionOutput {
    @required
    summary: ExecutionSummary
}