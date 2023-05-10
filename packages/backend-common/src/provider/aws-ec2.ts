import { AuthorizeSecurityGroupIngressCommand, CreateSecurityGroupCommand, DeleteSecurityGroupCommand, DescribeImagesCommand, DescribeInstancesCommand, EC2Client, RebootInstancesCommand, RunInstancesCommand, StartInstancesCommand, StopInstancesCommand, TerminateInstancesCommand } from "@aws-sdk/client-ec2";
import { ProviderServerStatus } from "@serverboi/ssdk";
import { ProviderAuthDto } from "../dto/provider-dto";
import { ProviderServerDataDto } from "../dto/server-dto";
import { logger } from "@serverboi/common";
import { CreateServerInput, Provider } from "./provider";

export class AwsEc2Provider implements Provider {
  private logger = logger.child({ name: "AwsEc2Provider" });

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
    this.logger.debug(`Creating new client for region ${region}`);
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

  async createServer(input: CreateServerInput): Promise<ProviderServerDataDto> {
    const client = await this.getClient(input.location);

    this.logger.debug(`Selecting image for ${input.id}`);
    const amis = await client.send(new DescribeImagesCommand({
      Filters: [
        {
          Name: "name",
          Values: ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-*"]
        },
        {
          Name: "architecture",
          Values: [input.architecture]
        },
        {
          Name: "owner-alias",
          Values: ["amazon"]
        },
        {
          Name: "hypervisor",
          Values: ["xen"]
        },
        {
          Name: "root-device-type",
          Values: ["ebs"]
        },
        {
          Name: "virtualization-type",
          Values: ["hvm"]
        },
        {
          Name: "image-type",
          Values: ["machine"]
        },
      ]
    }));
    if (!amis.Images || amis.Images.length === 0) {
      throw new Error("No AMI found");
    }
    
    this.logger.debug(`Creating security group for ${input.id}`);
    const securityGroup = await client.send(new CreateSecurityGroupCommand({
      Description: `ServerBoi security group for ${input.id}`,
      GroupName: `${input.name}-${input.id}-sg`,
    }));

    this.logger.debug(`Allowing ingress for deesired ports on security group ${securityGroup.GroupId}`);
    await client.send(new AuthorizeSecurityGroupIngressCommand({
      GroupId: securityGroup.GroupId!,
      IpPermissions: input.allowedPorts.map(port => ({
        FromPort: port.port,
        ToPort: port.port,
        IpProtocol: port.protcol,
        IpRanges: [{ CidrIp: "0.0.0.0/0"}],
        Ipv6Ranges: [{ CidrIpv6: "::/0"}],
      }))
    }));

    const tags = {
      "SecurityGroup": securityGroup.GroupId!,
      ...input.tags,
    }
    this.logger.debug(`Creating instance for ${input.id}`);
    const instance = await client.send(new RunInstancesCommand({
      ImageId: amis.Images[0].ImageId,
      InstanceType: input.serverType,
      MaxCount: 1,
      MinCount: 1,
      UserData: input.cloudInit,
      SecurityGroupIds: [securityGroup.GroupId!],
      BlockDeviceMappings: [{
        DeviceName: "/dev/sda1",
        VirtualName: "root",
        Ebs: {
          DeleteOnTermination: true,
          VolumeSize: input.diskSize,
          VolumeType: "gp2"
        }
      }],
      TagSpecifications: [{
        ResourceType: "instance",
        Tags: Object.entries(tags).map(([key, value]) => ({ Key: key, Value: value }))
      }]
    }));

    return {
      identifier: instance.Instances![0].InstanceId!,
      location: input.location,
    }
  }

  async deleteServer(serverData: ProviderServerDataDto): Promise<void> {
    const client = await this.getClient(serverData.location);

    this.logger.debug(`Describing instance ${serverData.identifier}`);
    const describeResponse = await client.send(new DescribeInstancesCommand({ InstanceIds: [serverData.identifier] }));
    if (!describeResponse.Reservations || describeResponse.Reservations.length === 0) {
      throw new Error("No instance found");
    }
    if (!describeResponse.Reservations[0].Instances || describeResponse.Reservations[0].Instances.length === 0) {
      throw new Error("No instance found");
    }
    const instance = describeResponse.Reservations[0].Instances[0];

    this.logger.debug(`Check if security group is on instance ${serverData.identifier}`);
    const securityGroup = instance.Tags?.find(tag => tag.Key === "SecurityGroup");
    if (securityGroup) {
      this.logger.debug(`Deleting security group ${securityGroup.Value}`);
      try {
        await client.send(new DeleteSecurityGroupCommand({ GroupId: securityGroup.Value }));
      } catch (e) {
        this.logger.warn(`Failed to delete security group ${securityGroup.Value}`, e);
      }
    }

    this.logger.debug(`Terminating instance ${serverData.identifier}`);
    await client.send(new TerminateInstancesCommand({ InstanceIds: [serverData.identifier] }));
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