import { ProcessRule } from "@/app/types/types";
import { IProcessRuleRepository, processRuleRepository } from "../repositories/ProcessRuleRepository";

export interface IProcessRuleService {
  createProcessRule(data: Partial<ProcessRule>): Promise<ProcessRule>;
  getProcessRuleById(id: string): Promise<ProcessRule | null>;
  getAllProcessRules(): Promise<ProcessRule[]>;
  updateProcessRule(id: string, data: Partial<ProcessRule>): Promise<ProcessRule>;
  deleteProcessRule(id: string): Promise<void>;
}

export class ProcessRuleService implements IProcessRuleService {
  constructor(private repository: IProcessRuleRepository = processRuleRepository) {}

  async createProcessRule(data: Partial<ProcessRule>) {
    return await this.repository.createProcessRule(data);
  }
  async getProcessRuleById(id: string) {
    return await this.repository.getProcessRuleById(id);
  }
  async getAllProcessRules() {
    return await this.repository.getAllProcessRules();
  }
  async updateProcessRule(id: string, data: Partial<ProcessRule>) {
    return await this.repository.updateProcessRule(id, data);
  }
  async deleteProcessRule(id: string) {
    return await this.repository.deleteProcessRule(id);
  }
}

export const processRuleService = new ProcessRuleService();