import { AppsV1Api, CoreV1Api, KubeConfig } from "@kubernetes/client-node";
import { ProviderServerStatus } from "@serverboi/ssdk";
import { ProviderAuthDto } from "../dto/provider-dto";
import { ProviderServerDataDto } from "../dto/server-dto";
import { logger } from "@serverboi/common";
import { CreateServerInput, Provider } from "./provider";

export interface KubernetesProviderOptions {
  readonly endpoint: string;
  readonly allowUnsecure?: boolean;
}

export interface KubernetesProviderServerData extends ProviderServerDataDto {
  readonly namespace: string;
  readonly replicaCount: number;
  readonly allowUnsecure: boolean;
}

export class KubernetesProvider implements Provider {
  private logger = logger.child({ name: "KubernetesProvider" });
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

  private loadData(serverData: ProviderServerDataDto): KubernetesProviderServerData {
    if (!serverData.data) {
      throw new Error("Missing data on server data");
    }
    
    const k8sData = serverData.data as KubernetesProviderServerData
    if (!k8sData.namespace) {
      throw new Error("Missing namespace on kubernetes server data");
    }

    if (!k8sData.replicaCount) {
      throw new Error("Missing replica count on kubernetes server data");
    }

    return {
      ...serverData,
      ...k8sData,
    };
  }

  async getServerStatus(serverData: ProviderServerDataDto): Promise<ProviderServerStatus> {
    const data = this.loadData(serverData);
    const res = await this.apps.readNamespacedDeployment(data.identifier, data.namespace);

    const status = res.body.status 

    if (!status) {
      return ProviderServerStatus.STOPPED;
    }

    if (status.replicas != 0) {
      if (status.availableReplicas == status.replicas && (status.unavailableReplicas === 0 || status.unavailableReplicas === undefined)) {
        return ProviderServerStatus.RUNNING
      } else {
        return ProviderServerStatus.STARTING
      }
    } else {
      if (status.availableReplicas == status.replicas && (status.unavailableReplicas === 0 || status.unavailableReplicas === undefined)) {
        return ProviderServerStatus.STOPPED
      } else {
        return ProviderServerStatus.STOPPING
      }
    }
  }

  async createServer(input: CreateServerInput): Promise<ProviderServerDataDto> {
    throw new Error("Method not implemented.");
  }

  async deleteServer(serverData: ProviderServerDataDto): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async startServer(serverData: ProviderServerDataDto): Promise<void> {
    const data = this.loadData(serverData);
    const deployment = await this.apps.readNamespacedDeployment(data.identifier, data.namespace);

    if (!deployment.body.spec) {
      throw new Error("Deployment spec is missing");
    }

    if (deployment.body.spec.replicas === data.replicaCount) {
      return;
    }

    deployment.body.spec.replicas = data.replicaCount;
    await this.apps.replaceNamespacedDeployment(serverData.identifier, data.namespace, deployment.body);
  }

  async stopServer(serverData: ProviderServerDataDto): Promise<void> {
    const data = this.loadData(serverData);
    const deployment = await this.apps.readNamespacedDeployment(data.identifier, data.namespace);

    if (!deployment.body.spec) {
      throw new Error("Deployment spec is missing");
    }

    if (deployment.body.spec.replicas !== data.replicaCount) {
      throw new Error("Deployment isn't running");
    }

    deployment.body.spec.replicas = 0;
    await this.apps.replaceNamespacedDeployment(data.identifier, data.namespace, deployment.body);
  }

  async rebootServer(serverData: ProviderServerDataDto): Promise<void> {
    await this.stopServer(serverData);
    await this.startServer(serverData);
  }

}