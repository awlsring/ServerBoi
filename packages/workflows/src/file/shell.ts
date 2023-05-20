export class ShellScriptBuilder {
  private script: string;

  constructor() {
    this.script = '#!/bin/bash\n';
  }

  addCommand(command: string) {
    this.script += command + '\n';
  }

  addComment(comment: string) {
    this.script += `# ${comment}\n`;
  }

  build(): string {
    return this.script.trim();
  }
}
