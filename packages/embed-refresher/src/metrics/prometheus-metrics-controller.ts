import { PrometheusMetricController, PrometheusMetricControllerOptions } from "@serverboi/common";
import { Histogram } from "prom-client";

export class EmbedRefresherPrometheusMetrics extends PrometheusMetricController {
  readonly agg: Histogram;
  readonly single: Histogram;

  constructor(options: PrometheusMetricControllerOptions) {
    super(options);
    this.agg = this.createHistogram('batch_run_duration', 'Batch run duration', ['batch_size'], [500,1000,2000,5000,10000,20000,50000,100000]);
    this.single = this.createHistogram('run_duration', 'Single run duration', ["result"], [100,250,500,1000,2000,5000,10000]);
  }

  observeBatchRun(batch_size: number, duration: number) {
    this.agg.observe({ batch_size }, duration);
  }

  observeSingleRun(result: string, duration: number) {
    this.single.observe({ result }, duration);
  }

}