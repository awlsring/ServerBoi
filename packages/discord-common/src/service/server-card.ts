import { ServerSummary } from "@serverboi/client";
import { ServerCardDto } from "../dto/server-card-dto";
import { formServerEmbedMessage } from "../embeds/server-embed";
import { DiscordHttpClient } from "../http/client";
import { ServerCardRepo } from "../persistence/server-card-repo";
import { logger } from "@serverboi/common";

export interface DeleteCardInput {
  serverId?: string
  messageId?: string
}

export class ServerCardService {
  private readonly logger = logger.child({ name: 'ServerCardService' })
  constructor(
    private readonly cardRepo: ServerCardRepo,
    private readonly http: DiscordHttpClient,
  ) {}

  async listCards() {
    this.logger.debug('Listing cards')
    return await this.cardRepo.findAll()
  }

  async createCard(channelId: string, summary: ServerSummary) {
    this.logger.debug(`Creating card for server ${summary.id}`)
    const message = await this.http.createMessage(channelId, formServerEmbedMessage(summary))
    await this.cardRepo.create({
      messageId: message.id,
      serverId: summary.id!,
      channelId: channelId,
      ownerId: summary.owner!,
    })
  }

  async getCardFromServer(serverId: string) {
    this.logger.debug(`Getting card for server ${serverId}`)
    const card = await this.cardRepo.findByServerId(serverId)
    if (!card) {
      this.logger.debug(`Card for server ${serverId} not found`)
      throw new Error(`Card with server ID ${serverId} not found`)
    }
    return card
  }

  async getCardFromMessage(messageId: string) {
    this.logger.debug(`Getting card for message ${messageId}`)
    const card = await this.cardRepo.findByMessageId(messageId)
    if (!card) {
      this.logger.debug(`Card for message ${messageId} not found`)
      throw new Error(`Card with message ID ${messageId} not found`)
    }
    return card
  }

  async refreshCard(card: ServerCardDto, summary: ServerSummary) {
    this.logger.debug(`Refreshing card for server ${summary.id}`)
    try {
      await this.http.editMessage(card.channelId, card.messageId, formServerEmbedMessage(summary))
    } catch (e) {
      this.logger.error(e)
      await this.regenerateCard(card.id, summary)
    }
  }

  async regenerateCard(id: string, summary: ServerSummary) {
    this.logger.debug(`Regenerating card for server ${summary.id}`)
    const card = await this.cardRepo.findById(id)
    if (!card) {
      this.logger.debug(`Card for server ${summary.id} not found`)
      throw new Error(`Card with ID ${id} not found`)
    }
    const message = await this.http.createMessage(card.channelId, formServerEmbedMessage(summary))
    await this.cardRepo.update(card.id, {
      messageId: message.id,
    })
  }

  async deleteCard(input: DeleteCardInput) {
    this.logger.debug(`Deleting card for server ${input.serverId ?? input.messageId}`)
    let card: ServerCardDto | null = null
    if (input.serverId) {
      this.logger.debug(`Finding card by server ID ${input.serverId}`)
      card = await this.cardRepo.findByServerId(input.serverId)
    }

    if (input.messageId) {
      this.logger.debug(`Finding card by message ID ${input.messageId}`)
      card = await this.cardRepo.findByMessageId(input.messageId)
    }
    if (!card) {
      this.logger.debug(`Card for server ${input.serverId ?? input.messageId} not found`)
      throw new Error(`Card not found`)
    }
    try {
      await this.http.deleteMessage(card.channelId, card.messageId)
    } catch (e) {
      this.logger.error(e)
    }
    await this.cardRepo.delete(card.id)
  }
}