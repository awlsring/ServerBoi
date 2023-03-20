import { Querent, Status } from "./common";

export class HttpQuerent implements Querent {

  constructor(private readonly address: string) {}

  async Query(): Promise<Status> {
    try {
      const response = await fetch(this.address);
      return {
        status: response.ok ? "RUNNING" : "UNREACHABLE",
      };
    } catch (e) {
      return {
        status: "UNREACHABLE",
      };
    }
  }
}