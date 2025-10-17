import { Process } from "@/app/types/types";
import { IProcessRepository, processRepository } from "../repositories/ProcessRepository";

export interface IProcessService {
  createProcess(data: Partial<Process>): Promise<Process>;
  getProcessById(id: string): Promise<Process>;
  getAllProcesses(): Promise<Process[]>;
  updateProcess(id: string, data: Process): Promise<Process>;
  deleteProcess(id: string): Promise<void>;
}

export class ProcessService implements IProcessService {
  constructor(private repository: IProcessRepository = processRepository) {}

  async createProcess(data: Partial<Process>) {
    return await this.repository.createProcess(data);
    
  }
  async getProcessById(id: string) {
    return await this.repository.getProcessById(id);
  }
  async getAllProcesses() {
    return await this.repository.getAllProcesses();
  }
  async updateProcess(id: string, data: Process) {
    return await this.repository.updateProcess(id, data);
  }
  async deleteProcess(id: string) {
    return await this.repository.deleteProcess(id);
  }
}

export const processService = new ProcessService();