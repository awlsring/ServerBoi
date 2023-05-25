import { ProviderServerStatus } from "@serverboi/ssdk";
import { ProviderServerDataDto, ProviderServerDescriptionDto } from "../dto/server-dto";
import { ProviderAuthDto, ProviderDto } from "../dto/provider-dto";
import { AwsEc2Provider } from "./aws-ec2";
import { KubernetesProvider, KubernetesProviderOptions } from "./kubernetes";
import { HetznerProvider } from "./hetzner";

export interface CreateServerInput {
  readonly id: string;
  readonly name: string;
  readonly location: string;
  readonly serverType: string;
  readonly diskSize: number;
  readonly allowedPorts: { port: number, protocol: string}[];
  readonly tags: Record<string, string>;
  readonly cloudInit: string;
  readonly providerData?: any;
}

export interface Provider {
  getServerStatus(serverData: ProviderServerDataDto): Promise<ProviderServerStatus>;
  createServer(input: CreateServerInput): Promise<ProviderServerDataDto>;
  describeServer(serverData: ProviderServerDataDto): Promise<ProviderServerDescriptionDto>;
  deleteServer(serverData: ProviderServerDataDto): Promise<void>;
  startServer(serverData: ProviderServerDataDto): Promise<void>;
  stopServer(serverData: ProviderServerDataDto): Promise<void>;
  rebootServer(serverData: ProviderServerDataDto): Promise<void>;
}

export async function loadProvider(provider: ProviderDto, auth: ProviderAuthDto): Promise<Provider> {
  switch (provider.type) {
    case "AWS":
      if (!provider.subType) {
        throw new Error("Missing AWS subtype");
      }
      switch (provider.subType) {
        case "EC2":
          return new AwsEc2Provider(auth);
        default:
          throw new Error(`Unknown AWS subtype ${provider.subType}`);
      }
    case "KUBERNETES":
      if (!provider.data) {
        throw new Error("Provider has no needed kubernetes data");
      }
      const data = provider.data as unknown as KubernetesProviderOptions
      const k8sCfg: KubernetesProviderOptions = {
        endpoint: data.endpoint,
        allowUnsecure: true,
      }
      return new KubernetesProvider(k8sCfg, auth);
    case "HETZNER":
      return new HetznerProvider(auth);
    default:
      throw new Error(`Unknown provider type ${provider.type}`);
  }
}