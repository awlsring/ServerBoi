import { DescribeInstancesCommand, EC2Client, RebootInstancesCommand, StartInstancesCommand, StopInstancesCommand } from "@aws-sdk/client-ec2";
import { ProviderServerStatus } from "@serverboi/ssdk";
import { ProviderAuthDto } from "../dto/provider-dto";
import { ProviderServerDataDto } from "../dto/server-dto";
import { Provider } from "./provider";

export interface AwsEc2ProviderOptions {
  readonly region: string;
}

export class AwsEc2Provider implements Provider {
  readonly client: EC2Client;

  constructor(cfg: AwsEc2ProviderOptions, auth: ProviderAuthDto) {
    if (!auth.secret) {
      throw new Error("Missing secret on provider auth");
    }

    this.client = new EC2Client({ region: cfg.region, credentials: { accessKeyId: auth.key, secretAccessKey: auth.secret } });
  }

  async getServerStatus(serverData: ProviderServerDataDto): Promise<ProviderServerStatus> {
    const instance = await this.client.send(new DescribeInstancesCommand({ InstanceIds: [serverData.identifier] }))

    if (!instance.Reservations || instance.Reservations.length === 0) {
      return ProviderServerStatus.STOPPED; // unknown;
    }

    if (!instance.Reservations[0].Instances || instance.Reservations[0].Instances.length === 0) {
      return ProviderServerStatus.STOPPED; // unknown;
    }

    if (!instance.Reservations[0].Instances[0].State) {
      return ProviderServerStatus.STOPPED; // unknown;
    }

    const state = instance.Reservations[0].Instances[0].State.Name;

    switch (state) {
      case "running":
        return ProviderServerStatus.RUNNING;
      case "pending":
        return ProviderServerStatus.STARTING;
      case "stopped":
        return ProviderServerStatus.STOPPED;
      case "stopping":
      case "shutting-down":
        return ProviderServerStatus.STOPPING;
      default:
        return ProviderServerStatus.STOPPED // unknown;
    }
  }

  async startServer(serverData: ProviderServerDataDto): Promise<void> {
    await this.client.send(new StartInstancesCommand({ InstanceIds: [serverData.identifier] }))
  }

  async stopServer(serverData: ProviderServerDataDto): Promise<void> {
    await this.client.send(new StopInstancesCommand({ InstanceIds: [serverData.identifier] }))
  }

  async rebootServer(serverData: ProviderServerDataDto): Promise<void> {
    await this.client.send(new RebootInstancesCommand({ InstanceIds: [serverData.identifier] }))
  }
}