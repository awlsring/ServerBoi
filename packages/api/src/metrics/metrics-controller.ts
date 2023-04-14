export interface MetricsController {
  observeRequest(method: string, route: string, statusCode: number, duration: number): void
  dump(): Promise<string>
}