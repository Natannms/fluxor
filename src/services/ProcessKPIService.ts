import { ProcessKPI } from "@/app/types/types";
import { IProcessKPIRepository, processKPIRepository } from "../repositories/ProcessKPIRepository";

export interface IProcessKPIService {
  createProcessKPI(data: Partial<ProcessKPI>): Promise<ProcessKPI>;
  getProcessKPIById(id: string): Promise<ProcessKPI | null>;
  getAllProcessKPIs(): Promise<ProcessKPI[]>;
  updateProcessKPI(id: string, data: Partial<ProcessKPI>): Promise<ProcessKPI>;
  deleteProcessKPI(id: string): Promise<void>;
}

export class ProcessKPIService implements IProcessKPIService {
  constructor(private repository: IProcessKPIRepository = processKPIRepository) {}

  async createProcessKPI(data: Partial<ProcessKPI>) {
    return await this.repository.createProcessKPI(data);
  }
  async getProcessKPIById(id: string) {
    return await this.repository.getProcessKPIById(id);
  }
  async getAllProcessKPIs() {
    return await this.repository.getAllProcessKPIs();
  }
  async updateProcessKPI(id: string, data: Partial<ProcessKPI>) {
    return await this.repository.updateProcessKPI(id, data);
  }
  async deleteProcessKPI(id: string) {
    return await this.repository.deleteProcessKPI(id);
  }
}

export const processKPIService = new ProcessKPIService();