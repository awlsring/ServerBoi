import { PrometheusMetricController, PrometheusMetricControllerOptions } from "@serverboi/common";
import { Histogram } from "prom-client";

export class ApiServicePrometheusMetrics extends PrometheusMetricController {
  readonly requests: Histogram;

  constructor(options: PrometheusMetricControllerOptions) {
    super(options);
    this.requests = this.createHistogram('request_duration', 'HTTP Request duration', ['method', 'route', 'statusCode'], [1,2,3,4,5,10,25,50,100,250,500,1000,2000,5000,10000]);
  }

  observeRequest(method: string, route: string, statusCode: number, duration: number) {
    this.requests.observe({ method, route, statusCode }, duration);
  }

}