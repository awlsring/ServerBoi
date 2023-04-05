import { AppsV1Api, CoreV1Api, KubeConfig } from "@kubernetes/client-node";
import { ProviderAuthDto } from "../dto/provider-dto";
import { Provider, ProviderServerData, State, Status } from "./provider";

export interface KubernetesProviderOptions {
  readonly endpoint: string;
  readonly allowUnsecure: boolean;
}

export interface KubernetesProviderServerData extends ProviderServerData{
  readonly namespace: string;
  readonly replicaCount: number;
}

export class KubernetesProvider implements Provider {
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

  async getServerStatus(serverData: KubernetesProviderServerData): Promise<Status> {
    const res = await this.apps.readNamespacedDeployment(serverData.identifier, serverData.namespace);

    const status = res.body.status 

    if (!status) {
      return { state: State.UNKNOWN }
    }

    if (status.replicas != 0) {
      if (status.availableReplicas == status.replicas && (status.unavailableReplicas === 0 || status.unavailableReplicas === undefined)) {
        return { state: State.RUNNING }
      } else {
        return { state: State.STARTING }
      }
    } else {
      if (status.availableReplicas == status.replicas && (status.unavailableReplicas === 0 || status.unavailableReplicas === undefined)) {
        return { state: State.STOPPED }
      } else {
        return { state: State.STOPPING }
      }
    }
  }

  async startServer(serverData: KubernetesProviderServerData): Promise<void> {
    const deployment = await this.apps.readNamespacedDeployment(serverData.identifier, serverData.namespace);

    if (!deployment.body.spec) {
      throw new Error("Deployment spec is missing");
    }

    if (deployment.body.spec.replicas === serverData.replicaCount) {
      return;
    }

    deployment.body.spec.replicas = serverData.replicaCount;
    await this.apps.replaceNamespacedDeployment(serverData.identifier, serverData.namespace, deployment.body);
  }

  async stopServer(serverData: KubernetesProviderServerData): Promise<void> {
    const deployment = await this.apps.readNamespacedDeployment(serverData.identifier, serverData.namespace);

    if (!deployment.body.spec) {
      throw new Error("Deployment spec is missing");
    }

    if (deployment.body.spec.replicas !== serverData.replicaCount) {
      throw new Error("Deployment isn't running");
    }

    deployment.body.spec.replicas = 0;
    await this.apps.replaceNamespacedDeployment(serverData.identifier, serverData.namespace, deployment.body);
  }

  async rebootServer(serverData: KubernetesProviderServerData): Promise<void> {
    await this.stopServer(serverData);
    await this.startServer(serverData);
  }

}