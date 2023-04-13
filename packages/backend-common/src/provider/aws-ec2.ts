import { DescribeInstancesCommand, EC2Client, RebootInstancesCommand, StartInstancesCommand, StopInstancesCommand } from "@aws-sdk/client-ec2";
import { ProviderServerStatus } from "@serverboi/ssdk";
import { ProviderAuthDto } from "../dto/provider-dto";
import { ProviderServerDataDto } from "../dto/server-dto";
import { Provider } from "./provider";

export class AwsEc2Provider implements Provider {
  private clients = new Map<string, EC2Client>();
  private readonly auth: ProviderAuthDto;

  constructor(auth: ProviderAuthDto) {
    if (!auth.secret) {
      throw new Error("Missing secret on provider auth");
    }
    this.auth = auth;
  }

  async getClient(region?: string): Promise<EC2Client> {
    if (!region) {
      throw new Error("Missing region");
    }

    if (this.clients.has(region)) {
      return this.clients.get(region)!;
    }
    const client = new EC2Client({ region: region, credentials: { accessKeyId: this.auth.key, secretAccessKey: this.auth.secret! } })
    this.clients.set(region, client);
    return client;
  }

  async getServerStatus(serverData: ProviderServerDataDto): Promise<ProviderServerStatus> {
    const client = await this.getClient(serverData.location);
    const instance = await client.send(new DescribeInstancesCommand({ InstanceIds: [serverData.identifier] }))

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
    const client = await this.getClient(serverData.location);
    await client.send(new StartInstancesCommand({ InstanceIds: [serverData.identifier] }))
  }

  async stopServer(serverData: ProviderServerDataDto): Promise<void> {
    const client = await this.getClient(serverData.location);
    await client.send(new StopInstancesCommand({ InstanceIds: [serverData.identifier] }))
  }

  async rebootServer(serverData: ProviderServerDataDto): Promise<void> {
    const client = await this.getClient(serverData.location);
    await client.send(new RebootInstancesCommand({ InstanceIds: [serverData.identifier] }))
  }
}