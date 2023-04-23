export interface MetricsController {
  observeBatchRun(batch_size: number, duration: number): void
  observeSingleRun(result: string, duration: number): void
  dump(): Promise<string>
}