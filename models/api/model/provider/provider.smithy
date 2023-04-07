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

    data: String
}

enum ProviderType {
    AWS = "AWS",
    KUBERNETES = "KUBERNETES",
    UNDEFINED = "UNDEFINED",
}

list ProviderSummaries {
    member: ProviderSummary
}