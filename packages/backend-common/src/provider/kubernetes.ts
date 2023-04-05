import { AppsV1Api, CoreV1Api, KubeConfig } from "@kubernetes/client-node";
import { ProviderAuthDto } from "../dto/provider-dto";

export interface KubernetesProviderOptions {
  readonly endpoint: string;
  readonly allowUnsecure: boolean;
  readonly namespace: string;
}

export interface Status {
  readonly state: string;
}

export class KubernetesProvider {
  private readonly core: CoreV1Api;
  private readonly apps: AppsV1Api;

  constructor(cfg: KubernetesProviderOptions, auth: ProviderAuthDto) {
    const config = new KubeConfig();

    if (cfg.allowUnsecure) {
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    }

    const cluster = {
      name: 'cluster',
      server: cfg.endpoint,
    };

    const user = {
      name: 'serverboi',
      token: auth.key,
    };
    
    const context = {
        name: 'context',
        user: user.name,
        cluster: cluster.name,
    };

    config.loadFromOptions({
      clusters: [cluster],
      users: [user],
      contexts: [context],
      currentContext: context.name,
    })

    this.core = config.makeApiClient(CoreV1Api);
    this.apps = config.makeApiClient(AppsV1Api);
  }

  async getDeploymentStatus(namespace: string, name: string): Promise<Status> {
    const res = await this.apps.readNamespacedDeployment(name, namespace);

    const status = res.body.status 

    if (!status) {
      return { state: "UNKNOWN" }
    }

    if (status.replicas != 0) {
      if (status.availableReplicas == status.replicas && status.unavailableReplicas === 0) {
        return { state: "RUNNING" }
      } else {
        return { state: "STARTING" }
      }
    } else {
      if (status.availableReplicas == status.replicas && status.unavailableReplicas === 0) {
        return { state: "STOPPED" }
      } else {
        return { state: "STOPPING" }
      }
    }
  }
}