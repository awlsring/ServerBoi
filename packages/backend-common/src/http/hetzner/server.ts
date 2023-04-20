export interface GetServerResponse {
  server: Server;
}

export enum ServerStatus {
  INITIALIZING = "initializing",
  RUNNING = "running",
  STARTING = "starting",
  STOPPING = "stopping",
  OFF = "off",
  DELETING = "deleting",
  REBUILDING = "rebuilding",
  MIGRATING = "migrating",
  UNKNOWN = "unknown",
}

export interface Server {
  backup_window: string;
  created: string;
  datacenter: Datacenter;
  id: number;
  image: Image;
  included_traffic: number;
  ingoing_traffic: number;
  iso?: ISO;
  labels: Record<string, string>;
  load_balancers: any[];
  locked: boolean;
  name: string;
  outgoing_traffic: number;
  placement_group?: PlacementGroup;
  primary_disk_size: number;
  private_net: PrivateNet[];
  protection: Protection;
  public_net: PublicNet;
  rescue_enabled: boolean;
  server_type: ServerType;
  status: string;
  volumes: any[];
}

export interface Datacenter {
  description: string;
  id: number;
  location: Location;
  name: string;
  server_types: ServerTypes;
}

export interface Location {
  city: string;
  country: string;
  description: string;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  network_zone: string;
}

export interface ServerTypes {
  available: number[];
  available_for_migration: number[];
  supported: number[];
}

export interface Image {
  bound_to: any;
  created: string;
  created_from: CreatedFrom;
  deleted: any;
  deprecated: string;
  description: string;
  disk_size: number;
  id: number;
  image_size: number;
  labels: Record<string, string>;
  name: string;
  os_flavor: string;
  os_version: string;
  protection: Protection;
  rapid_deploy: boolean;
  status: string;
  type: string;
}

export interface CreatedFrom {
  id: number;
  name: string;
}

export interface Protection {
  delete: boolean;
  rebuild: boolean;
}

export interface ISO {
  architecture: string;
  deprecated: string;
  description: string;
  id: number;
  name: string;
  type: string;
}

export interface PrivateNet {
  alias_ips: any[];
  ip: string;
  mac_address: string;
  network: number;
}

export interface PublicNet {
  firewalls: Firewall[];
  floating_ips: number[];
  ipv4: IPv4;
  ipv6: IPv6;
}

export interface Firewall {
  id: number;
  status: string;
}

export interface IPv4 {
  blocked: boolean;
  dns_ptr: string;
  id: number;
  ip: string;
}

export interface IPv6 {
  blocked: boolean;
  dns_ptr: DnsPtr[];
  id: number;
  ip: string;
}

export interface DnsPtr {
  dns_ptr: string;
  ip: string;
}

export interface ServerType {
  cores: number;
  cpu_type: string;
  deprecated: boolean;
  description: string;
  disk: number;
  id: number;
  memory: number;
  name: string;
  prices: Price[];
  storage_type: string;
}

export interface Price {
  location: string;
  price_hourly: PriceData;
  price_monthly: PriceData;
}

export interface PriceData {
  gross: string;
  net: string;
}

export interface PlacementGroup {
  created: string;
  id: number;
  labels: Record<string, string>;
  name: string;
  servers: number[];
  type: string;
}
