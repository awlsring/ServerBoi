export interface CreateFirewallRequest {
  readonly apply_to: {
    readonly server: { readonly id: number };
    readonly type: string;
  }[],
  readonly labels?: { [key: string]: string },
  readonly name: string,
  readonly rules: FirewallRule[],
}

export interface CreateFirewallResponse {
  readonly actions: any;
  readonly firewall: Firewall;
}

export interface Firewall {
  readonly applied_to: any;
  readonly created: string;
  readonly id: number;
  readonly labels: { [key: string]: string };
  readonly name: string;
  readonly rules: FirewallRule[];
}

export interface FirewallRule {
  readonly description?: string;
  readonly direction: string;
  readonly destionation_ips?: string[];
  readonly protocol: string;
  readonly source_ips?: string[];
  readonly port: string;
}