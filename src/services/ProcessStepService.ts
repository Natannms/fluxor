import { ProcessStep } from "@/app/types/types";
import { IProcessStepRepository, processStepRepository } from "../repositories/ProcessStepRepository";

export interface IProcessStepService {
  createProcessStep(data: Partial<ProcessStep>): Promise<ProcessStep>;
  getProcessStepById(id: string): Promise<ProcessStep | null>;
  getAllProcessSteps(): Promise<ProcessStep[]>;
  updateProcessStep(id: string, data: ProcessStep): Promise<ProcessStep>;
  deleteProcessStep(id: string): Promise<void>;
}

export class ProcessStepService implements IProcessStepService {
  constructor(private repository: IProcessStepRepository = processStepRepository) {}

  async createProcessStep(data: Partial<ProcessStep>) {
    return await this.repository.createProcessStep(data);
  }
  async getProcessStepById(id: string): Promise<ProcessStep | null> {
    return await this.repository.getProcessStepById(id);
  }
  async getAllProcessSteps() {
    return await this.repository.getAllProcessSteps();
  }
  async updateProcessStep(id: string, data: ProcessStep) {
    return await this.repository.updateProcessStep(id, data);
  }
  async deleteProcessStep(id: string) {
    return await this.repository.deleteProcessStep(id);
  }
}

export const processStepService = new ProcessStepService();