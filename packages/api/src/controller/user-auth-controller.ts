import { UserAuthDto } from "../dto/user-auth-dto";
import { UserAuthRepo } from "../persistence/user-auth-repo";
import * as crypto from "crypto";
import { PrismaRepoOptions } from "@serverboi/services";

export class UserAuthController {
  private repo: UserAuthRepo;

  constructor(cfg: PrismaRepoOptions) {
    this.repo = new UserAuthRepo(cfg);
  }

  private generateApiKey(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  async createKey(scope: string): Promise<UserAuthDto> {
    const apiKey = this.generateApiKey();
    return await this.repo.create(scope, apiKey);
  }

  async getUserAuth(key: string): Promise<UserAuthDto> {
    const user = await this.repo.findByKey(key);
    if (!user) {
      throw Error("UserController.getUserFromKey: user not found");
    }
    return user;
  }
}