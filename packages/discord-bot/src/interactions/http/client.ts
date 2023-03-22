export interface InteractionHttpClientOptions {
  readonly token: string;
  readonly version: string;
}

export class InteractionHttpClient {
  private readonly token: string;
  private readonly version: string;
  private readonly baseUrl: string
  private lastRequestTime: number;

  constructor(options: InteractionHttpClientOptions) {
    this.token = options.token;
    this.version = options.version;
    this.baseUrl = `https://discord.com/api/${this.version}`
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
      Authorization: `Bot ${this.token}`,
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

  async createInteractionResponse(
    interactionId: string,
    interactionToken: string,
    body: Record<string, any>,
  ): Promise<void> {
    await this.request(
      `/interactions/${interactionId}/${interactionToken}/callback`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    );
  }

  async getOriginalInteractionResponse(
    applicationId: string,
    interactionToken: string,
  ): Promise<any> {
    const response = await this.request(
      `/webhooks/${applicationId}/${interactionToken}/messages/@original`,
    );
    return response.json();
  }

  async editOriginalInteractionResponse(
    applicationId: string,
    interactionToken: string,
    body: Record<string, any>,
  ): Promise<any> {
    const response = await this.request(
      `/webhooks/${applicationId}/${interactionToken}/messages/@original`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
      },
    );
    return response.json();
  }

  async deleteOriginalInteractionResponse(
    applicationId: string,
    interactionToken: string,
  ): Promise<void> {
    await this.request(
      `/webhooks/${applicationId}/${interactionToken}/messages/@original`,
      {
        method: 'DELETE',
      },
    );
  }

  async createFollowupMessage(
    applicationId: string,
    interactionToken: string,
    body: Record<string, any>,
    ephemeral = false,
  ): Promise<any> {
    if (ephemeral) {
      body.flags = 64;
    }
    const response = await this.request(
      `/webhooks/${applicationId}/${interactionToken}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    );
    return response.json();
  }
  
  async getFollowupMessage(
    applicationId: string,
    interactionToken: string,
    messageId: string,
    ): Promise<any> {
    const response = await this.request(
      `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`,
      );
      return response.json();
    }

  async editFollowupMessage(
    applicationId: string,
    interactionToken: string,
    messageId: string,
    body: Record<string, any>,
    ephemeral = false,
  ): Promise<any> {
    if (ephemeral) {
      body.flags = 64;
    }
    const response = await this.request(
      `webhooks/${applicationId}/${interactionToken}/messages/${messageId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
      },
    );
    return response.json();
  }

  async deleteFollowupMessage(
    applicationId: string,
    interactionToken: string,
    messageId: string,
    body: Record<string, any>,
    ephemeral = false,
  ): Promise<any> {
    if (ephemeral) {
      body.flags = 64;
    }
    const response = await this.request(
      `webhooks/${applicationId}/${interactionToken}/messages/${messageId}`,
      {
        method: 'DELETE',
        body: JSON.stringify(body),
      },
    );
    return response.json();
  }
}