import { ProcessKPI } from "@/app/types/types";
import { IProcessKPIAdapter } from "../adapters/AdapterInterface";
import { ProcessKPIAdapter } from "../adapters/postgres/ProcessKPIAdapter";

export interface IProcessKPIRepository {
  createProcessKPI(data: Partial<ProcessKPI>): Promise<ProcessKPI>;
  getProcessKPIById(id: string): Promise<ProcessKPI | null>;
  getAllProcessKPIs(): Promise<ProcessKPI[]>;
  updateProcessKPI(id: string, data: Partial<ProcessKPI>): Promise<ProcessKPI>;
  deleteProcessKPI(id: string): Promise<void>;
}

export class ProcessKPIRepository implements IProcessKPIRepository {
  constructor(private adapter: IProcessKPIAdapter = ProcessKPIAdapter) {}

  async createProcessKPI(data: Partial<ProcessKPI>) {
    return await this.adapter.create(data);
  }
  async getProcessKPIById(id: string) {
    return await this.adapter.findById(id);
  }
  async getAllProcessKPIs() {
    return await this.adapter.findAll();
  }
  async updateProcessKPI(id: string, data: Partial<ProcessKPI>) {
    return await this.adapter.update(id, data);
  }
  async deleteProcessKPI(id: string) {
    return await this.adapter.delete(id);
  }
}

export const processKPIRepository = new ProcessKPIRepository();