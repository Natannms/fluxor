import { IDepartmentRepository } from "@/repositories/DepartmentRepository";

export interface DepartmentServiceInterface<T> {
  createDepartment(data: Partial<T>): Promise<T>;
  getDepartments(query: object): Promise<T[]>;
  updateDepartment(id: string, data: Partial<T>): Promise<number>;
  deleteDepartment(query: object): Promise<number>;
  getDepartmentsByCompany(companyId: string): Promise<T[]>;
}

export class DepartmentService implements DepartmentServiceInterface<any> {
  constructor(private repo: IDepartmentRepository) {}

  async createDepartment(data: Partial<any>) {
    return this.repo.createDepartment(data);
  }
  async getDepartments(query: object) {
    return this.repo.getDepartments(query);
  }
  async updateDepartment(id: string, data: Partial<any>) {
    return this.repo.updateDepartment(id, data);
  }
  async deleteDepartment(query: object) {
    return this.repo.deleteDepartment(query);
  }
  async getDepartmentsByCompany(companyId: string) {
    return this.repo.getDepartmentsByCompany(companyId);
  }
}