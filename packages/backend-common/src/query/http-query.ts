import { ServerStatusDto } from "../dto/server-dto";
import { Connectivity, QuerentBase } from "./common";
import { URL } from "url";
import { QueryServerStatus, ServerQueryType } from "@serverboi/ssdk";

export class HttpQuerent extends QuerentBase {
  protected readonly type = ServerQueryType.HTTP;
  private url: URL;
  constructor(connectivity: Connectivity) {
    super(connectivity);

    if (this.connectivity.address.includes("http") || this.connectivity.address.includes("https")) {
      this.url = new URL(this.connectivity.address);
      return;
    }
    if (this.connectivity.port == 80) {
      this.url = new URL(`http://${this.connectivity.address}`);
      return;
    }
    if (this.connectivity.port == 443) {
      this.url = new URL(`https://${this.connectivity.address}`);
      return;
    }
    this.url = new URL(`https://${this.connectivity.address}`);
  }

  async Query(): Promise<Partial<ServerStatusDto>> {
    try {
      const response = await fetch(this.url.toString());
      return {
        query: response.ok ? QueryServerStatus.REACHABLE : QueryServerStatus.UNREACHABLE,
      };
    } catch (e) {
      console.error(e);
      return {
        query: QueryServerStatus.UNREACHABLE,
      };
    }
  }
}