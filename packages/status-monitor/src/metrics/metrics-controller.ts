export interface MetricsController {
  observeBatchRun(batch_size: number, duration: number): void
  observeSingleRun(provider_type: string, query_type: string, application: string, provider_status: string, query_status: string, status: string, duration: number): void
  dump(): Promise<string>
}