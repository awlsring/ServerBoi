import { ServerSummary } from "@serverboi/client";
import { ServerCardDto } from "../dto/server-card-dto";
import { formServerEmbedMessage } from "../embeds/server-embed";
import { DiscordHttpClient } from "../http/client";
import { ServerCardRepo } from "../persistence/server-card-repo";

export interface DeleteCardInput {
  serverId?: string
  messageId?: string
}

export class ServerCardService {
  constructor(
    private readonly cardRepo: ServerCardRepo,
    private readonly http: DiscordHttpClient,
  ) {}

  async listCards() {
    return await this.cardRepo.findAll()
  }

  async createCard(channelId: string, summary: ServerSummary) {
    const message = await this.http.createMessage(channelId, formServerEmbedMessage(summary))
    await this.cardRepo.create({
      messageId: message.id,
      serverId: summary.id!,
      channelId: channelId,
      ownerId: summary.owner!,
    })
  }

  async getCardFromServer(serverId: string) {
    const card = await this.cardRepo.findByServerId(serverId)
    if (!card) {
      throw new Error(`Card with server ID ${serverId} not found`)
    }
    return card
  }

  async getCardFromMessage(messageId: string) {
    const card = await this.cardRepo.findByMessageId(messageId)
    if (!card) {
      throw new Error(`Card with message ID ${messageId} not found`)
    }
    return card
  }

  async refreshCard(card: ServerCardDto, summary: ServerSummary) {
    try {
      await this.http.editMessage(card.channelId, card.messageId, formServerEmbedMessage(summary))
    } catch (e) {
      console.log(e)
      await this.regenerateCard(card.id, summary)
    }
  }

  async regenerateCard(id: string, summary: ServerSummary) {
    const card = await this.cardRepo.findById(id)
    if (!card) {
      throw new Error(`Card with ID ${id} not found`)
    }
    const message = await this.http.createMessage(card.channelId, formServerEmbedMessage(summary))
    await this.cardRepo.update(card.id, {
      messageId: message.id,
    })
  }

  async deleteCard(input: DeleteCardInput) {
    let card: ServerCardDto | null = null
    if (input.serverId) {
      card = await this.cardRepo.findByServerId(input.serverId)
    }

    if (input.messageId) {
      card = await this.cardRepo.findByMessageId(input.messageId)
    }
    if (!card) {
      throw new Error(`Card not found`)
    }
    try {
      await this.http.deleteMessage(card.channelId, card.messageId)
    } catch (e) {
      console.error(e)
    }
    await this.cardRepo.delete(card.id)
  }
}