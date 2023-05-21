import { ShellScriptBuilder } from "../../src/file/shell";
import { DockerCompose } from "../../src/file/docker-compose";
import { writeFileSync } from "fs";

describe('ShellScriptBuilder', () => {
  it('should build a script', () => {
    const builder = new ShellScriptBuilder();
    builder.addComment('This is a comment');
    builder.addCommand('echo "Hello World"');
    expect(builder.build()).toEqual(`#!/bin/bash\n# This is a comment\necho "Hello World"`);
  });

  it('should build a script the creates a docker compose file', () => {
    const scriptBuilder = new ShellScriptBuilder();
    scriptBuilder.addCommand('set -e');
    scriptBuilder.addComment('Generating Docker Compose file');
    scriptBuilder.addCommand('cat > docker-compose.yml << EOF');
    scriptBuilder.addCommand('');

    const composeBuilder = new DockerCompose();
    composeBuilder.addService('web', {
      image: 'nginx',
      ports: ['80:80'],
    });

    const composeFile = composeBuilder.asYaml();
    scriptBuilder.addCommand(composeFile);
    scriptBuilder.addCommand('');
    scriptBuilder.addCommand('EOF');

    const script = scriptBuilder.build();
    console.log(script);

    expect(script).toEqual(`#!/bin/bash\nset -e\n# Generating Docker Compose file\ncat > docker-compose.yml << EOF\n\nversion: "3"\nservices:\n  web:\n    image: nginx\n    ports:\n      - 80:80\n\n\nEOF`);
  });
});
