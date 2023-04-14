import { ProviderController, ServerController } from "@serverboi/backend-common";
import { Config } from "../../config";
import { MetricsController } from "../../metrics/metrics-controller";

export interface ControllerContext {
  readonly server: ServerController;
  readonly provider: ProviderController;
}

export interface ServiceContext {
  user: string;
  metrics: MetricsController
  controller: ControllerContext;
}