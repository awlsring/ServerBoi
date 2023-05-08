$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

@http(method: "POST", uri: "/server", code: 200)
operation CreateServer {
    input: CreateServerInput,
    output: CreateServerOutput,
    errors: [
        ValidationException,
        InternalServerError,
        InvalidInputError
    ]
}

@input
structure CreateServerInput {
    @required
    scope: String
    
    @required
    application: String

    @required
    name: String,

    @required
    providerOptions: CreateServerProviderOptions

    @required
    templateOptions: CreateServerTemplateOptions

    @required
    capabilities: ServerCapabilities
}

structure CreateServerProviderOptions {
    @required
    provider: String

    location: String

    data: Document
}

structure CreateServerTemplateOptions {
    @required
    variables: CreateServerApplicationVariables

    @required
    ports: CreateServerApplicationPorts

    templateVersion: String
}

structure CreateServerApplicationVariable {
    @required
    name: String

    @required
    value: String
}

list CreateServerApplicationVariables {
    member: CreateServerApplicationVariable
}

structure CreateServerApplicationPort {
    @required
    host: Integer

    @required
    container: Integer
}

list CreateServerApplicationPorts {
    member: CreateServerApplicationPort
}

@output
structure CreateServerOutput {
    @required
    executionId: String
}