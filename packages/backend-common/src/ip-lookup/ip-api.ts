import { promisify } from 'util';
import dns from 'dns';
import { logger } from '@serverboi/common';

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

  // errors
  error: boolean,
  reason: string,
  reserved: boolean,
}

export interface ServerLocation {
  readonly city: string;
  readonly region: string;
  readonly country: string;
  readonly emoji: string;
}

export class IPAPIClient {
  private logger = logger.child({ name: "IPAPIClient" });

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

  private isPrivateIPAddress(ipAddress: string): boolean {
    const octets = ipAddress.split('.').map(octet => Number(octet));
    if (octets.length !== 4) {
      return false;
    }
    if (octets[0] === 10) {
      return true;
    }
    if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) {
      return true;
    }
    if (octets[0] === 192 && octets[1] === 168) {
      return true;
    }
    return false;
  }

  private isTailscaleAddress(ipAddress: string): boolean {
    const pattern = /^100\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    return pattern.test(ipAddress);
  }

  public async getIPInfo(address: string): Promise<ServerLocation> {
    const ip = await this.resolveIp(address);

    if (!ip) {
      this.logger.error(`Failed to get IP info for ${address}`);
      return {
        city: 'Unknown',
        region: 'Unknown',
        country: 'Unknown',
        emoji: '😔',
      };
    }

    // check if tailscale
    if (this.isTailscaleAddress(ip)) {
      this.logger.debug(`Found Tailscale address ${ip}`);
      return {
        city: 'Tailscale',
        region: 'Tailscale',
        country: 'Tailscale',
        emoji: '🧜‍♀️',
      };
    }

    if (this.isPrivateIPAddress(ip)) {
      this.logger.debug(`Found private address ${ip}`);
      return {
        city: 'Private',
        region: 'Private',
        country: 'Private',
        emoji: '🤫',
      };
    }

    const response = await fetch(`https://ipapi.co/${ip}/json`);
    if (!response.ok) {
      this.logger.error(`Failed to get IP info for ${address}`);
      return {
        city: 'Unknown',
        region: 'Unknown',
        country: 'Unknown',
        emoji: '😔',
      };
    }
    const ipApiResponse = await response.json() as IPAPIResponse;
    if (ipApiResponse.reserved) {
      this.logger.error(`Failed to get IP info for ${address}`);
      return {
        city: 'Private',
        region: 'Private',
        country: 'Private',
        emoji: '🤫',
      };
    }
    return {
      city: ipApiResponse.city,
      region: ipApiResponse.region_code,
      country: ipApiResponse.country_code,
      emoji: this.getFlagEmoji(ipApiResponse.country_code),
    }
  }
}