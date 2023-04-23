import { APIChannel, APIUser, RESTPostAPIChannelMessageJSONBody } from "discord-api-types/v10"

export interface DiscordHttpClientOptions {
  readonly token: string;
  readonly version: string;
}

export class DiscordHttpClient {
  private readonly token: string;
  private readonly version: string;
  private readonly baseUrl: string
  private lastRequestTime: number;

  constructor(options: DiscordHttpClientOptions) {
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
      `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
      },
    );
    return await response.json();
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
      `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`,
      {
        method: 'DELETE',
        body: JSON.stringify(body),
      },
    );
    return await response.json();
  }

  async createMessage(channelId: string, message: RESTPostAPIChannelMessageJSONBody,) {
    const response = await this.request(`/channels/${channelId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
    return await response.json();
  }

  async replyToMessage(channelId: string, messageId: string, message: RESTPostAPIChannelMessageJSONBody,) {
    let msg = message;
    msg.message_reference = {
      message_id: messageId,
    };

    const response = await this.request(`/channels/${channelId}/messages`, {
      method: 'POST',
      body: JSON.stringify(msg),
    });
    return await response.json();
  }

  async editMessage(channelId: string, messageId: string, body: Record<string, any>,) {
    const response = await this.request(`/channels/${channelId}/messages/${messageId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    return await response.json();
  }

  async deleteMessage(channelId: string, messageId: string) {
    try {
      const response = await this.request(`/channels/${channelId}/messages/${messageId}`, {
        method: 'DELETE',
      });
      
      if (response.status === 204) {
        console.log('Message deleted successfully');
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }

  async messageUser(userId: string, message: RESTPostAPIChannelMessageJSONBody,) {
    const resp = await this.request(`/users/@me/channels`, {
      method: 'POST',
      body: JSON.stringify({
        recipient_id: userId,
      }),
    });

    const channel = await resp.json() as APIChannel
    await this.createMessage(channel.id, message);
  }

  async getUser(userId: string): Promise<APIUser> {
    const response = await this.request(`/users/${userId}`);
    return await response.json();
  }
}