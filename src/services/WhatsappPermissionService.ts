import { IWhatsappPermissionRepository } from "@/repositories/WhatsappPermissionRepository";

export class WhatsappPermissionService {
  constructor(private repo: IWhatsappPermissionRepository) {}

  async createPermission(data: Partial<any>) {
    // valida: precisa de companyId, instanceId e targetType
    if (!data.companyId || !data.instanceId || !data.targetType) {
      throw new Error("Dados insuficientes para criar permissão");
    }
    return this.repo.createPermission(data);
  }

  async getPermissionsByInstanceAndCompany(instanceId: string, companyId: string) {
    return this.repo.getPermissionsByInstanceAndCompany(instanceId, companyId);
  }

  async deletePermission(id: string) {
    return this.repo.deletePermission(id);
  }

  async getPermissionsByMembership(membershipId: string) {
    return this.repo.getPermissions({ membershipId });
  }

  async getPermissionsByCompany(companyId: string) {
    return this.repo.getPermissions({ companyId });
  }
}