import { createServer } from 'http';
import { Registry, Metric, Gauge, collectDefaultMetrics, Counter, Histogram } from 'prom-client';
import { logger } from '../logger/logger';

export interface PrometheusMetricControllerOptions {
  readonly app: string;
  readonly prefix: string;
  readonly server?: {
    readonly port?: number;
  };
}

export abstract class PrometheusMetricController {
  readonly logger = logger.child({ name: "PrometheusMetricController" });
  readonly registry: Registry;
  readonly metrics: Map<string, Metric>;
  readonly contentType: string;

  constructor(options: PrometheusMetricControllerOptions) {
    this.registry = new Registry();
    this.metrics = new Map();
    this.registry.setDefaultLabels({
      app: options.app,
      prefix: options.prefix,
    });
    this.contentType = this.registry.contentType;

    collectDefaultMetrics({ register: this.registry });

    if (options.server) {
      this.logger.info(`Starting metrics server on port ${options.server.port ?? 9090}`, );
      this.createServer(options.server.port ?? 9090);
    }
  }

  protected createCounter(name: string, help: string, labels?: string[]): Counter {
    const counter = new Counter({
      name,
      help,
      labelNames: labels,
    });

    this.registry.registerMetric(counter);
    this.metrics.set(name, counter);

    return counter;
  }

  protected createGauge(name: string, help: string, labels?: string[]): Gauge {
    const gauge = new Gauge({
      name,
      help,
      labelNames: labels,
    });

    this.registry.registerMetric(gauge);
    this.metrics.set(name, gauge);

    return gauge;
  }

  protected createHistogram(name: string, help: string, labels?: string[], buckets?: number[]): Histogram {
    const histogram = new Histogram({
      name,
      help,
      labelNames: labels,
      buckets: buckets
    });

    this.registry.registerMetric(histogram);
    this.metrics.set(name, histogram);

    return histogram;
  }

  async dump() {
    return await this.registry.metrics();
  }

  private async createServer(port: number) {
    const server = createServer(async (req, res) => {
      if (req.url === "/metrics") {
        const metricsDump = await this.dump();
        res.writeHead(200, {
          "Content-Type": this.contentType,
        }).end(metricsDump);
        return;
      }
    });

    server.listen(port);
  }

}