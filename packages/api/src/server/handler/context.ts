import { ProviderController, ServerController } from "@serverboi/services";
import { Config } from "../../config";

export interface ControllerContext {
  readonly server: ServerController;
  readonly provider: ProviderController;
}

export interface ServiceContext {
  user: string;
  controller: ControllerContext;
}