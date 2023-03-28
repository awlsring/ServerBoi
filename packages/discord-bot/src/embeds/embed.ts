import { EmbedType } from 'discord-api-types/v10';

export interface EmbedFooter {
  readonly text: string;
  readonly iconUrl?: string;
  readonly proxyIconUrl?: string;
}

export interface EmbedImage {
  readonly url?: string;
  readonly proxyUrl?: string;
  readonly height?: number;
  readonly width?: number;
}

export interface EmbedThumbnail {
  readonly url?: string;
  readonly proxyUrl?: string;
  readonly height?: number;
  readonly width?: number;
}

export interface EmbedVideo {
  readonly url?: string;
  readonly height?: number;
  readonly width?: number;
}

export interface EmbedProvider {
  readonly name?: string;
  readonly url?: string;
}

export interface EmbedAuthor {
  readonly name?: string;
  readonly url?: string;
  readonly iconUrl?: string;
  readonly proxyIconUrl?: string;
}

export interface EmbedField {
  readonly name: string;
  readonly value: string;
  readonly inline?: boolean;
}

export class EmbedOptions {
  public readonly title?: string;
  public readonly type?: EmbedType;
  public readonly description?: string;
  public readonly url?: string;
  public readonly timestamp?: Date;
  public readonly color?: number;
  public readonly footer?: EmbedFooter;
  public readonly image?: EmbedImage;
  public readonly thumbnail?: EmbedThumbnail;
  public readonly video?: EmbedVideo;
  public readonly provider?: EmbedProvider;
  public readonly author?: EmbedAuthor;
  public readonly fields?: EmbedField[];
}

export class Embed {
  public readonly title?: string;
  public readonly type?: EmbedType;
  public readonly description?: string;
  public readonly url?: string;
  public readonly timestamp?: Date;
  public readonly color?: number;
  public readonly footer?: EmbedFooter;
  public readonly image?: EmbedImage;
  public readonly thumbnail?: EmbedThumbnail;
  public readonly video?: EmbedVideo;
  public readonly provider?: EmbedProvider;
  public readonly author?: EmbedAuthor;
  public readonly fields?: EmbedField[];

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

  public toApiData(): EmbedOptions {
    return {
      title: this.title,
      type: this.type,
      description: this.description,
      url: this.url,
      timestamp: this.timestamp,
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