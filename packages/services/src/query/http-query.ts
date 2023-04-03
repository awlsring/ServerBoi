import { ServerStatusDto } from "../dto/server-dto";
import { Querent } from "./common";
import { URL } from "url";

export class HttpQuerent implements Querent {
  private readonly type = "HTTP";
  private url: URL;
  constructor(address: string, port: number) {
    if (address.includes("http") || address.includes("https")) {
      this.url = new URL(address);
      return;
    }
    if (port == 80) {
      this.url = new URL(`http://${address}`);
      return;
    }
    if (port == 443) {
      this.url = new URL(`https://${address}`);
      return;
    }
    this.url = new URL(`https://${address}`);
  }

  async Query(): Promise<ServerStatusDto> {
    try {
      const response = await fetch(this.url.toString());
      return {
        type: this.type,
        status: response.ok ? "RUNNING" : "UNREACHABLE",
      };
    } catch (e) {
      console.error(e);
      return {
        type: this.type,
        status: "UNREACHABLE",
      };
    }
  }
}