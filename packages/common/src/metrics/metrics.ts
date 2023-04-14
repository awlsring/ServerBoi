export interface Metrics {
  count(name: string, labels?: Record<string, string | number>): void;
}