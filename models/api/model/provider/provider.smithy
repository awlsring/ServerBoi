$version: "2.0"

namespace awlsring.serverboi.api
use smithy.framework#ValidationException

resource Provider {
    identifiers: { name: ProviderIdentifier },
    read: GetProvider,
    list: ListProviders,
    create: CreateProvider,
    delete: DeleteProvider,
}

string ProviderIdentifier

structure ProviderSummary {
    @required
    name: ProviderIdentifier,

    @required
    type: ProviderType,
}

enum ProviderType {
    AWS_EC2 = "AWS_EC2",
    KUBERNETES = "KUBERNETES",
    UNDEFINED = "UNDEFINED",
}

list ProviderSummaries {
    member: ProviderSummary
}