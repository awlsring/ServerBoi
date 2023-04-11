import { ProviderServerStatus } from "@serverboi/ssdk";
import { ProviderServerDataDto } from "../dto/server-dto";

export interface Provider {
  getServerStatus(serverData: ProviderServerDataDto): Promise<ProviderServerStatus>;
  startServer(serverData: ProviderServerDataDto): Promise<void>;
  stopServer(serverData: ProviderServerDataDto): Promise<void>;
  rebootServer(serverData: ProviderServerDataDto): Promise<void>;
}