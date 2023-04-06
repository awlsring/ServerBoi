import { DescribeInstancesCommand, EC2Client, RebootInstancesCommand, StartInstancesCommand, StopInstancesCommand } from "@aws-sdk/client-ec2";
import { ProviderAuthDto } from "../dto/provider-dto";
import { ProviderServerDataDto } from "../dto/server-dto";
import { Provider, State, Status } from "./provider";

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

  async getServerStatus(serverData: ProviderServerDataDto): Promise<Status> {
    const instance = await this.client.send(new DescribeInstancesCommand({ InstanceIds: [serverData.identifier] }))

    if (!instance.Reservations || instance.Reservations.length === 0) {
      return { state: State.UNKNOWN };
    }

    if (!instance.Reservations[0].Instances || instance.Reservations[0].Instances.length === 0) {
      return { state: State.UNKNOWN };
    }

    if (!instance.Reservations[0].Instances[0].State) {
      return { state: State.UNKNOWN };
    }

    const state = instance.Reservations[0].Instances[0].State.Name;

    switch (state) {
      case "running":
        return { state: State.RUNNING };
      case "pending":
        return { state: State.STARTING };
      case "stopped":
        return { state: State.STOPPED };
      case "stopping":
      case "shutting-down":
        return { state: State.STOPPING };
      default:
        return { state: State.UNKNOWN };
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