import { promisify } from 'util';
import dns from 'dns';

export interface IPAPIResponse {
  ip: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country_code: string;
  country_code_iso3: string;
  country_name: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
  hostname: string;
}

export interface ServerLocation {
  readonly city: string;
  readonly region: string;
  readonly country: string;
  readonly emoji: string;
}

export class IPAPIClient {
  private getFlagEmoji(countryCode: string): string {
    const codePoints = countryCode.toUpperCase().split('').map(c => 127397 + c.charCodeAt(0));
    const emoji = String.fromCodePoint(...codePoints);
    if (!emoji) {
      throw new Error(`Failed to get flag emoji for ${countryCode}`);
    }
    return emoji;
  }

  private async resolveHostname(hostname: string): Promise<string | null> {
    const resolve4Async = promisify(dns.resolve4);
    try {
      const ips: string[] = await resolve4Async(hostname);
      return ips[0];
    } catch {
      throw new Error(`Failed to resolve hostname ${hostname}`);
    }
  }

  private async resolveIp(input: string): Promise<string | null> {
    const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if (ipRegex.test(input)) {
      return input;
    }
  
    const ipPortRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+$/;
    if (ipPortRegex.test(input)) {
      return input.split(':')[0];
    }

    const hostnamePortRegex = /^([\w\d-]+\.)*[\w\d-]+\.\w{2,}:\d+$/;
    if (hostnamePortRegex.test(input)) {
      return await this.resolveHostname(input.split(':')[0]);
    }
  
    return await this.resolveHostname(input);
  }

  public async getIPInfo(address: string): Promise<ServerLocation> {
    const ip = await this.resolveIp(address);
    const response = await fetch(`https://ipapi.co/${ip}/json`);
    if (!response.ok) {
      console.error(`Failed to get IP info for ${address}`);
      return {
        city: 'Unknown',
        region: 'Unknown',
        country: 'Unknown',
        emoji: '😔',
      };
    }
    const ipApiResponse = await response.json() as IPAPIResponse;
    console.log(ipApiResponse)
    return {
      city: ipApiResponse.city,
      region: ipApiResponse.region_code,
      country: ipApiResponse.country_code,
      emoji: this.getFlagEmoji(ipApiResponse.country_code),
    }
  }
}