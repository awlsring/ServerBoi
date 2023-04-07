import { PrismaRepoOptions } from "../persistence/prisma-repo-options";
import { NewProviderDto, ProviderDto } from "../dto/provider-dto";
import { ProviderRepo } from "../persistence/provider-repo";

export class ProviderController {
  private providerRepo: ProviderRepo;

  constructor(cfg: PrismaRepoOptions) {
    this.providerRepo = new ProviderRepo(cfg);
  }

  async createProvider(input: NewProviderDto): Promise<ProviderDto> {
    const provider = await this.providerRepo.find(input.name, input.owner);
    if (provider) {
      throw new Error("Provider already exists");
    }
    return await this.providerRepo.create(input);
  }

  async deleteProvider(name: string, ownerId: string): Promise<void> {
    const provider = await this.providerRepo.find(name, ownerId);
    if (!provider) {
      throw new Error("Provider doesn't exists");
    }
    await this.providerRepo.delete(provider.id);
  }

  async getProvider(name: string, ownerId: string): Promise<ProviderDto> {
    const provider = await this.providerRepo.find(name, ownerId);
    if (!provider) {
      throw new Error("Provider not found");
    }
    return provider;
  }

  async listProviders(ownerId: string, amount?: number, skip?: number): Promise<ProviderDto[]> {
    return await this.providerRepo.findAll(ownerId, amount, skip);
  }
}