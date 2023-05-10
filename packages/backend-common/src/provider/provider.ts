import { ProviderServerStatus } from "@serverboi/ssdk";
import { ProviderServerDataDto } from "../dto/server-dto";

export interface Provider {
  getServerStatus(serverData: ProviderServerDataDto): Promise<ProviderServerStatus>;
  createServer(options: any): Promise<ProviderServerDataDto>;
  deleteServer(serverData: ProviderServerDataDto): Promise<void>;
  startServer(serverData: ProviderServerDataDto): Promise<void>;
  stopServer(serverData: ProviderServerDataDto): Promise<void>;
  rebootServer(serverData: ProviderServerDataDto): Promise<void>;
}