import * as fs from "fs";
import * as path from "path";
import yaml from 'js-yaml';

export interface ApplicationTemplate {
  readonly version: string;
  readonly name: string;
  readonly image: string;
  readonly variables: ApplicationTemplateVariables[];
  readonly healthCheck: ApplicationTemplateHealthCheckProtocol;
  readonly connectivity: ApplicationTemplateConnectivityProtocol;
  readonly volumes: ApplicationTemplateVolumes[];
  readonly ports: ApplicationTemplatePorts[];
}

export interface ApplicationTemplateHealthCheckProtocol {
  readonly protocol: string;
  readonly portName: string;
}

export interface ApplicationTemplateConnectivityProtocol {
  readonly protocol: string;
  readonly portName: string;
}

export interface ApplicationTemplateVariables {
  readonly name: string;
  readonly default?: string;
}

export interface ApplicationTemplateVolumes {
  readonly host: string;
  readonly container: string;
}

export interface ApplicationTemplatePorts {
  readonly host: number;
  readonly container: number;
  readonly protocol: string;
  readonly name: string;
}

export interface ApplicationTemplateSpecs {
  readonly cores: string;
  readonly memory: string;
  readonly storage: string;
  readonly architectures: string[];
}

export function loadTemplate(name: string, version?: number): ApplicationTemplate {
  const templatePath = path.join(__dirname, "templates", `${name}.json`);
  const templates = yaml.load(fs.readFileSync(templatePath, "utf8")) as ApplicationTemplate[];

  if (version === undefined) {
    return templates.sort((a, b) => {
      const aVersion = parseInt(a.version);
      const bVersion = parseInt(b.version);

      if (aVersion > bVersion) {
        return 1;
      } else if (aVersion < bVersion) {
        return -1;
      } else {
        return 0;
      }
    }
    )[0];
  }

  const template = templates.find(t => t.version === version.toString());

  if (template === undefined) {
    throw new Error(`Template ${name} with version ${version} not found`);
  }

  return template;
}