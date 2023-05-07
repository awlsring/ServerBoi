$version: "2.0"

namespace awlsring.serverboi.api

use smithy.framework#ValidationException
use aws.protocols#restJson1

@title("ServerBoi REST API")

@restJson1
@httpBearerAuth
@httpApiKeyAuth(scheme: "ApiKey", name: "Authorization", in: "header")
@paginated(
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "pageSize"
)
service ServerBoi {
    version: "2023-03-19",
    operations: [ Health, TrackServer ],
    resources: [ 
        Server,
        Provider,
        Application,
        Execution,
    ]
}