export interface ListLocationsResponse {
  readonly locations: Location[];
}

export interface Location {
  readonly city: string;
  readonly country: string;
  readonly description: string;
  readonly id: number;
  readonly latitude: number;
  readonly longitude: number;
  readonly name: string;
  readonly network_zone: string;
}