import { Config } from "../../config";

export interface ServiceContext {
  user?: string;
  key?: string;
  config: Config
}