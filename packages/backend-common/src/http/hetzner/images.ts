export interface ListImagesRequest {
  readonly name?: string;
  readonly sort?: "id" | "id:asc" | "id:desc" | "name" | "name:asc" | "name:desc" | "created" | "created:asc" | "created:desc";
  readonly type?: "system" | "snapshot" | "backup" | "app";
  readonly status?: "available" | "creating"
  readonly bound_to?: string;
  readonly include_deprecated?: boolean;
  readonly label_selector?: string;
  readonly architecture?: string;
  readonly page?: number;
  readonly per_page?: number;
}

export interface ListImagesResponse {
  readonly images: Image[];
  readonly meta: {
    readonly pagination: {
      readonly page: number;
      readonly per_page: number;
      readonly previous_page?: number;
      readonly next_page: number;
      readonly last_page: number;
      readonly total_entries: number;
    }
  }
}

export interface Image {
  readonly architecture: string;
  readonly bound_to?: number;
  readonly created: string;
  readonly created_from?: {
    readonly id: number;
    readonly name: string;
  };
  readonly deleted?: string;
  readonly deprecated?: string;
  readonly description: string;
  readonly disk_size: number;
  readonly id: number;
  readonly image_size?: number;
  readonly labels: Record<string, string>;
  readonly name?: string;
  readonly os_flavor: string;
  readonly os_version?: string;
  readonly protection: {
    readonly delete: boolean;
  };
  readonly rapid_deploy: boolean;
  readonly status: string;
  readonly type: string;
}
