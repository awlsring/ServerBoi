import { APIEmbed, APIEmbedAuthor, APIEmbedField, APIEmbedFooter, APIEmbedImage, APIEmbedProvider, APIEmbedThumbnail, APIEmbedVideo, EmbedType } from 'discord-api-types/v10';

export class EmbedOptions {
  public readonly title?: string;
  public readonly type?: EmbedType;
  public readonly description?: string;
  public readonly url?: string;
  public readonly timestamp?: Date;
  public readonly color?: number;
  public readonly footer?: APIEmbedFooter;
  public readonly image?: APIEmbedImage;
  public readonly thumbnail?: APIEmbedThumbnail;
  public readonly video?: APIEmbedVideo;
  public readonly provider?: APIEmbedProvider;
  public readonly author?: APIEmbedAuthor;
  public readonly fields?: APIEmbedField[];
}

export class Embed {
  public readonly title?: string;
  public readonly type?: EmbedType;
  public readonly description?: string;
  public readonly url?: string;
  public readonly timestamp?: Date;
  public readonly color?: number;
  public readonly footer?: APIEmbedFooter;
  public readonly image?: APIEmbedImage;
  public readonly thumbnail?: APIEmbedThumbnail;
  public readonly video?: APIEmbedVideo;
  public readonly provider?: APIEmbedProvider;
  public readonly author?: APIEmbedAuthor;
  public readonly fields?: APIEmbedField[];

  constructor(options: EmbedOptions) {
    this.title = options.title;
    this.type = options.type;
    this.description = options.description;
    this.url = options.url;
    this.timestamp = options.timestamp;
    this.color = options.color;
    this.footer = options.footer;
    this.image = options.image;
    this.thumbnail = options.thumbnail;
    this.video = options.video;
    this.provider = options.provider;
    this.author = options.author;
    this.fields = options.fields;
  }

  public toApiData(): APIEmbed {
    return {
      title: this.title,
      type: this.type,
      description: this.description,
      url: this.url,
      timestamp: this.timestamp?.toISOString(),
      color: this.color,
      footer: this.footer,
      image: this.image,
      thumbnail: this.thumbnail,
      video: this.video,
      provider: this.provider,
      author: this.author,
      fields: this.fields
    }
  }
}