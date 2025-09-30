import { Process } from "@/app/types/types";
import { IProcessAdapter } from "../adapters/AdapterInterface";
import { ProcessAdapter } from "../adapters/postgres/ProcessAdapter";

export interface IProcessRepository {
  createProcess(data: Process): Promise<Process>;
  getProcessById(id: string): Promise<Process>;
  getAllProcesses(): Promise<Process[]>;
  updateProcess(id: string, data: Process): Promise<Process>;
  deleteProcess(id: string): Promise<void>;
}

export class ProcessRepository implements IProcessRepository {
  constructor(private adapter: IProcessAdapter = ProcessAdapter) {}

  async createProcess(data: Process) {
    return await this.adapter.create(data);
  }
  async getProcessById(id: string) {
    return await this.adapter.findById(id);
  }
  async getAllProcesses() {
    return await this.adapter.findAll();
  }
  async updateProcess(id: string, data: Process) {
    return await this.adapter.update(id, data);
  }
  async deleteProcess(id: string) {
    return await this.adapter.delete(id);
  }
}

export const processRepository = new ProcessRepository();