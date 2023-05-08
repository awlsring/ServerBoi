import { ExecutionController, ProviderController, ServerController } from "@serverboi/backend-common";
import { MetricsController } from "../../metrics/metrics-controller";

export interface ControllerContext {
  readonly server: ServerController;
  readonly provider: ProviderController;
  readonly execution: ExecutionController;
}

export interface ServiceContext {
  user: string;
  metrics: MetricsController
  controller: ControllerContext;
}