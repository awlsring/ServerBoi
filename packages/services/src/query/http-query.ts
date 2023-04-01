import { ServerStatusDto } from "../dto/server-dto";
import { Querent } from "./common";

export class HttpQuerent implements Querent {
  private readonly type = "HTTP";
  constructor(private readonly address: string) {}

  async Query(): Promise<ServerStatusDto> {
    try {
      const response = await fetch(this.address);
      return {
        type: this.type,
        status: response.ok ? "RUNNING" : "UNREACHABLE",
      };
    } catch (e) {
      return {
        type: this.type,
        status: "UNREACHABLE",
      };
    }
  }
}