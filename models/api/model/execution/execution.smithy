$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

resource Execution {
    identifiers: { id: ExecutionId },
    read: GetExecution,
    list: ListExecutions,
}

string ExecutionId

structure ExecutionSummary {
    @required
    id: ExecutionId,

    @required
    workflowType: WorkflowType,

    @required
    status: ExecutionStatus,

    @required
    createdAt: Long,

    @required
    input: Document,

    currentStep: String,

    endedAt: Long,

    output: Document

    error: ExecutionError
}

structure ExecutionError {
    @required
    name: String

    message: String
}

list ExecutionSummaries {
    member: ExecutionSummary,
}

enum WorkflowType {
    CREATE_SERVER = "CREATE_SERVER",
}

enum ExecutionStatus {
    RUNNING = "RUNNING",
    SUCCEEDED = "SUCCEEDED",
    FAILED = "FAILED",
}