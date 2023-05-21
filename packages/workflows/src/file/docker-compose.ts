import YAML from 'yaml';

export interface DockerComposeFile {
  readonly version: string; 
  readonly services: { [serviceName: string]: ServiceConfig };
}

export interface ServiceConfig {
  readonly image: string;
  readonly ports?: string[];
  readonly volumes?: string[];
  readonly environment?: string[];
}

export class DockerCompose {
  private services: { [serviceName: string]: ServiceConfig };
  private version: string;

  constructor(version: string = '3') {
    this.version = version;
    this.services = {};
  }

  addService(serviceName: string, serviceConfig: any) {
    this.services[serviceName] = serviceConfig;
  }

  asYaml(): string {
    return YAML.stringify(this.asFile());
  }

  asFile(): DockerComposeFile {
    return {
      version: this.version,
      services: this.services,
    };
  }
}
