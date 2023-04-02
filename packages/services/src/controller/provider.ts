import { PrismaRepoOptions } from "../persistence/prisma-repo-options";
import { NewProviderDto, ProviderDto } from "../dto/provider-dto";
import { ProviderRepo } from "../persistence/provider-repo";

export class ProviderController {
  private providerRepo: ProviderRepo;

  constructor(cfg: PrismaRepoOptions) {
    this.providerRepo = new ProviderRepo(cfg);
  }

  async trackServer(input: NewProviderDto): Promise<ProviderDto> {
    return await this.providerRepo.create(input);
  }

  async untrackServer(name: string, ownerId: string): Promise<void> {
    await this.providerRepo.delete(name, ownerId);
  }

  async getProvider(name: string, ownerId: string): Promise<ProviderDto> {
    return await this.providerRepo.find(name, ownerId);
  }

  async listServers(ownerId: string, amount?: number, skip?: number): Promise<ProviderDto[]> {
    return await this.providerRepo.findAll(ownerId, amount, skip);
  }
}