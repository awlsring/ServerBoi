$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

resource Application {
    identifiers: { name: ApplicationName },
    read: GetApplication,
    list: ListApplications,
}

string ApplicationName

string ImageName

structure ApplicationSummary {
    @required
    name: ApplicationName,

    @required
    alternateNames: StringList,

    architecture: ArchitectureType,

    template: ApplicationTemplate,
}

list ApplicationSummaries {
    member: ApplicationSummary,
}

structure ApplicationTemplate {
    @required
    variables: ApplicationVariables,

    @required
    image: ImageName,

    volumes: StringList,

    ports: StringList,
}

structure ApplicationVariable {
    @required
    name: String,

    default: String,
}

list ApplicationVariables {
    member: ApplicationVariable,
}

enum ArchitectureType {
    X86_64 = "x86_64",
    ARM64 = "arm64",
}