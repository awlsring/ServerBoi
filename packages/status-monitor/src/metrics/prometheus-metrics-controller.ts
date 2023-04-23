import { PrometheusMetricController, PrometheusMetricControllerOptions } from "@serverboi/common";
import { Histogram } from "prom-client";

export class StatusMonitorPrometheusMetrics extends PrometheusMetricController {
  readonly agg: Histogram;
  readonly single: Histogram;

  constructor(options: PrometheusMetricControllerOptions) {
    super(options);
    this.agg = this.createHistogram('batch_run_duration', 'Status Monitor batch run duration', ['batch_size'], [500,1000,2000,5000,10000,20000,50000,100000]);
    this.single = this.createHistogram('run_duration', 'Status Monitor single server duration', ["provider_type", "query_type", "application", "provider_status", "query_status", "status"], [100,250,500,1000,2000,5000,10000]);
  }

  observeBatchRun(batch_size: number, duration: number) {
    this.agg.observe({ batch_size }, duration);
  }

  observeSingleRun(provider_type: string, query_type: string, application: string, provider_status: string, query_status: string, status: string, duration: number) {
    this.single.observe({ provider_type, query_type, application, provider_status, query_status, status }, duration);
  }

}