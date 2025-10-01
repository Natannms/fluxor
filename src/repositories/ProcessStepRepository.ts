import { ProcessStep } from "@/app/types/types";
import { IProcessStepAdapter } from "../adapters/AdapterInterface";
import { ProcessStepAdapter } from "../adapters/postgres/ProcessStepAdapter";

export interface IProcessStepRepository {
  createProcessStep(data: Partial<ProcessStep>): Promise<ProcessStep>;
  getProcessStepById(id: string): Promise<ProcessStep | null>;
  getAllProcessSteps(): Promise<ProcessStep[]>;
  updateProcessStep(id: string, data: ProcessStep): Promise<ProcessStep>;
  deleteProcessStep(id: string): Promise<void>;
}

export class ProcessStepRepository implements IProcessStepRepository {
  constructor(private adapter: IProcessStepAdapter = ProcessStepAdapter) {}

  async createProcessStep(data: Partial<ProcessStep>) {
    return await this.adapter.create(data);
  }
  async getProcessStepById(id: string) {
    return await this.adapter.findById(id);
  }
  async getAllProcessSteps() {
    return await this.adapter.findAll();
  }
  async updateProcessStep(id: string, data: ProcessStep) {
    return await this.adapter.update(id, data);
  }
  async deleteProcessStep(id: string) {
    return await this.adapter.delete(id);
  }
}

export const processStepRepository = new ProcessStepRepository();