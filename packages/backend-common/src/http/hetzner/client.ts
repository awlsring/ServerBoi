import { CreateFirewallRequest, CreateFirewallResponse } from "./firewall";
import { ListImagesRequest, ListImagesResponse } from "./images";
import { CreateServerRequest, CreateServerResponse, GetServerResponse, GetServerTypeResponse } from "./server";
import { ServerActionResponse } from "./server-action";
import { ListLocationsResponse } from "./location";

export interface HetznerError {
  readonly code?: string;
  readonly message?: string;
  readonly details?: string;
}

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

  private async getResponseError(response: Response): Promise<HetznerError | undefined> {
    const body = await response.json();
    if (body?.error) {
      return body.error;
    }
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
      const error = await this.getResponseError(response);
      throw new Error(`Request failed: ${response.statusText}\nMessage ${error?.message}`);
    }
    return response;
  }

  async getServerType(serverType: string): Promise<GetServerTypeResponse> {
    const response = await this.request(`/server_types/${serverType}`);
    return await response.json();
  }

  async createFirewall(request: CreateFirewallRequest): Promise<CreateFirewallResponse> {
    const response = await this.request(
      '/firewalls',
      {
        method: 'POST',
        body: JSON.stringify(request),
      },
    );

    return await response.json();
  }

  async listImages(request?: ListImagesRequest): Promise<ListImagesResponse> {
    let uri = '/images'

    // add query params for each field in request if set
    if (request) {
      const params = new URLSearchParams();
      if (request.type) {
        params.append('type', request.type);
      }
      if (request.status) {
        params.append('status', request.status);
      }
      if (request.name) {
        params.append('name', request.name);
      }
      if (request.sort) {
        params.append('sort', request.sort);
      }
      if (request.status) {
        params.append('status', request.status);
      }
      if (request.bound_to) {
        params.append('bound_tso', request.bound_to);
      }
      if (request.include_deprecated) {
        params.append('include_deprecated', request.include_deprecated.toString());
      }
      if (request.label_selector) {
        params.append('label_selector', request.label_selector);
      }
      if (request.architecture) {
        params.append('architecture', request.architecture);
      }
      if (request.page) {
        params.append('page', request.page.toString());
      }
      if (request.per_page) {
        params.append('per_page', request.per_page.toString());
      }
      uri += `?${params.toString()}`;
    }

    const response = await this.request(
      uri,
      {
        method: 'GET',
      },
    );

    return await response.json()
  }

  async listLocations(): Promise<ListLocationsResponse> {
    const response = await this.request(
      '/locations',
      {
        method: 'GET',
      },
    );

    return await response.json();
  }

  async createServer(request: CreateServerRequest): Promise<CreateServerResponse> {
    const response = await this.request(
      '/servers',
      {
        method: 'POST',
        body: JSON.stringify(request),
      },
    );

    return await response.json();
  }

  async deleteServer(serverId: string): Promise<ServerActionResponse> {
    const response = await this.request(
      `/servers/${serverId}`,
      {
        method: 'DELETE',
      },
    );

    return await response.json();
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