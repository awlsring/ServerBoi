import { GetServerResponse, Server } from "./server";
import { ServerActionResponse } from "./server-action";

export interface HetznerHttpClientOptions {
  readonly token: string;
  readonly version: string;
}

export class HetznerHttpClient {
  private readonly token: string;
  private readonly version: string;
  private readonly baseUrl: string
  private lastRequestTime: number;

  constructor(options: HetznerHttpClientOptions) {
    this.token = options.token;
    this.version = options.version;
    this.baseUrl = `https://api.hetzner.cloud/${this.version}`
    this.lastRequestTime = 0;
  }

  private async checkRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < 500) {
      const delay = 500 - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    this.lastRequestTime = Date.now();
  }

  private async request(url: string, init?: RequestInit): Promise<Response> {
    await this.checkRateLimit();
    const headers = {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
    const response = await fetch(this.baseUrl + url, {
      headers,
      ...init,
    });
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.request(url, init);
    }
    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }
    return response;
  }

  async getServer(serverId: string): Promise<GetServerResponse> {
    const response = await this.request(
      `/servers/${serverId}`,
      {
        method: 'GET',
      },
    );

    return await response.json();
  }

  async startServer(serverId: string): Promise<ServerActionResponse> {
    const response = await this.request(
      `/servers/${serverId}/actions/poweron`,
      {
        method: 'POST',
      },
    );

    return await response.json();
  }

  async stopServer(serverId: string, force?: boolean): Promise<ServerActionResponse> {
    let url = `/servers/${serverId}/actions/shutdown`;
    if (force) {
      url = `/servers/${serverId}/actions/poweroff`;
    }
    const response = await this.request(
      url,
      {
        method: 'POST',
      },
    );

    return await response.json();
  }

  async rebootServer(serverId: string, force?: boolean): Promise<ServerActionResponse> {
    let url = `/servers/${serverId}/actions/reboot`;
    if (force) {
      url = `/servers/${serverId}/actions/reset`;
    }
    const response = await this.request(
      url,
      {
        method: 'POST',
      },
    );

    return await response.json();
  }
}