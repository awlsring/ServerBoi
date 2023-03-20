$version: "2.0"

namespace awlsring.serverboi.api

use smithy.framework#ValidationException
use aws.protocols#restJson1
@title("ServerBoi")

@restJson1
@httpBearerAuth
@httpApiKeyAuth(scheme: "ApiKey", name: "Authorization", in: "header")
service ServerBoi {
    version: "2022-10-20",
    operations: [Health]
}

@readonly
@http(method: "GET", uri: "/health", code: 200)
operation Health {
    output: HealthOutput,
    errors: [ValidationException]
}

@output
structure HealthOutput {
    @required
    success: Boolean
}