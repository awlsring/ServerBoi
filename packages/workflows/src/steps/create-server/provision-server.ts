import { ApplicationTemplate, CreateServerTemplateOptionsDto } from "@serverboi/backend-common";
import { loadProvider } from "@serverboi/backend-common";
import { DockerCompose } from "../../file/docker-compose";
import { ShellScriptBuilder } from "../../file/shell";
import { ProvisionServerProviderOptions, ServerOptions } from "../../workflows/create-server";

export interface ProvisionServerInput {
  readonly serverId: string;
  readonly user: string;
  readonly applicationTemplate: ApplicationTemplate;
  readonly serverOptions: ServerOptions;
  readonly providerData: ProvisionServerProviderOptions;
  readonly templateOptions: CreateServerTemplateOptionsDto;
}

export interface ProvisionServerOutput {
  readonly identifier: string;
}

export async function ProvisionServer(input: ProvisionServerInput): Promise<ProvisionServerOutput> {
  const dockerCompose = await createDockerCompose(input.applicationTemplate, input.templateOptions);
  const provider = await loadProvider(input.providerData.provider, input.providerData.auth);

  const server = await provider.createServer({
    id: input.serverId,
    name: input.serverOptions.name,
    location: input.serverOptions.location,
    serverType: input.serverOptions.serverType,
    diskSize: input.serverOptions.diskSize,
    allowedPorts: input.templateOptions.ports.map(p => ({ port: p.host, protocol: p.protocol })),
    tags: {
      application: input.applicationTemplate.name,
      managedBy: "serverboi",
      createdAt: new Date().toISOString(),
      name: input.serverOptions.name,
      id: input.serverId,
    },
    cloudInit: createCloudInitScript(dockerCompose),
  })

  return {
    identifier: server.identifier,
  };
}

function createCloudInitScript(compose: DockerCompose): string {
  const script = new ShellScriptBuilder();

  script.addComment("Ensure system is updated");
  script.addCommand("apt-get update");
  script.addCommand("apt-get upgrade -y");

  script.addComment("Create the serverboi user")
  script.addCommand("useradd -m -G sudo -s /bin/bash serverboi");

  script.addComment("Add serverboi user to docker group");
  script.addCommand("usermod -aG docker serverboi");

  script.addComment("Install docker");
  script.addCommand("apt-get install -y docker.io");

  script.addComment("Install docker-compose");
  script.addCommand("apt-get install -y docker-compose");

  script.addComment("Create docker directory for serverboi user");
  script.addCommand("mkdir -p /home/serverboi/docker");
  script.addCommand("chown serverboi:serverboi /home/serverboi/docker");

  script.addComment("Create docker-compose file for application.");
  script.addCommand('cat > /home/serverboi/docker-compose.yaml << EOF');
  script.addCommand('');
  script.addCommand(compose.asYaml());
  script.addCommand('');
  script.addCommand('EOF');

  script.addComment("Change owner of docker-compose file");
  script.addCommand("chown serverboi:serverboi /home/serverboi/docker-compose.yaml");

  script.addComment("Change to serverboi user and start docker compose");
  script.addCommand("su serverboi");

  script.addComment("Change to docker directory");
  script.addCommand("cd /home/serverboi/docker");

  script.addComment("Start docker-compose");
  script.addCommand("docker-compose up -d");

  return script.build();
}

async function createDockerCompose(application: ApplicationTemplate, templateOptions: CreateServerTemplateOptionsDto): Promise<DockerCompose> {
  const compose = new DockerCompose("3.8")
  compose.addService(application.name, {
    image: application.image,
    ports: [
      ...templateOptions.ports.map(p => `${p.host}:${p.container}/${p.protocol}`),
      ...application.ports.map(p => `${p.host}:${p.container}/${p.protocol}`)
    ],
    volumes: application.volumes.map(v => `${v.host}:${v.container}`),
    environment: application.variables.map(v => {
      const variable = templateOptions.variables.find(vo => vo.name === v.name);
      if (variable === undefined) {
        if (v.default === undefined) {
          return `${v.name}=""`;
        }
        return `${v.name}=${v.default}`;
      } else {
        return `${v.name}=${variable.value}`;
      }
    })
  });

  return compose;
}