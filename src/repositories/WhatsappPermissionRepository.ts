import { WhatsappPermissionAdapterInterface } from "@/adapters/AdapterInterface";

export interface IWhatsappPermissionRepository {
  createPermission(data: Partial<any>): Promise<any>;
  getPermissions(query: object): Promise<any[]>;
  getPermissionsByInstanceAndCompany(instanceId: string, companyId: string): Promise<any[]>;
  deletePermission(id: string): Promise<number>;
}

export class WhatsappPermissionRepository implements IWhatsappPermissionRepository {
  constructor(private adapter: WhatsappPermissionAdapterInterface) {}

  async createPermission(data: Partial<any>) {
    return this.adapter.create(data);
  }
  async getPermissions(query: object) {
    return this.adapter.read(query);
  }
  async getPermissionsByInstanceAndCompany(instanceId: string, companyId: string) {
    return this.adapter.readByInstanceAndCompany(instanceId, companyId);
  }
  async deletePermission(id: string) {
    return this.adapter.deleteById(id);
  }
}