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

    subType: ProviderSubtype

    data: Document
}

enum ProviderType {
    AWS = "AWS",
    KUBERNETES = "KUBERNETES",
    HETZNER = "HETZNER",
    UNDEFINED = "UNDEFINED",
}

enum ProviderSubtype {
    EC2 = "EC2"
}

list ProviderSummaries {
    member: ProviderSummary
}