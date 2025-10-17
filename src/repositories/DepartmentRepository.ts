import { DepartmentAdapterInterface } from "@/adapters/AdapterInterface";

export interface IDepartmentRepository {
  createDepartment(data: Partial<any>): Promise<any>;
  getDepartments(query: object): Promise<any[]>;
  updateDepartment(id: string, data: Partial<any>): Promise<number>;
  deleteDepartment(query: object): Promise<number>;
  getDepartmentsByCompany(companyId: string): Promise<any[]>;
}

export class DepartmentRepository implements IDepartmentRepository {
  constructor(private adapter: DepartmentAdapterInterface) {}

  async createDepartment(data: Partial<any>) {
    return this.adapter.create(data);
  }
  async getDepartments(query: object) {
    return this.adapter.read(query);
  }
  async updateDepartment(id: string, data: Partial<any>) {
    return this.adapter.update(id, data);
  }
  async deleteDepartment(query: object) {
    return this.adapter.delete(query);
  }
  async getDepartmentsByCompany(companyId: string) {
    return this.adapter.readByCompany(companyId);
  }
}