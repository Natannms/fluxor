import { ProcessRule } from "@/app/types/types";
import { IProcessRuleAdapter } from "../adapters/AdapterInterface";
import { ProcessRuleAdapter } from "../adapters/postgres/ProcessRuleAdapter";

export interface IProcessRuleRepository {
  createProcessRule(data: Partial<ProcessRule>): Promise<ProcessRule>;
  getProcessRuleById(id: string): Promise<ProcessRule | null>;
  getAllProcessRules(): Promise<ProcessRule[]>;
  updateProcessRule(id: string, data: Partial<ProcessRule>): Promise<ProcessRule>;
  deleteProcessRule(id: string): Promise<void>;
}

export class ProcessRuleRepository implements IProcessRuleRepository {
  constructor(private adapter: IProcessRuleAdapter = ProcessRuleAdapter) {}

  async createProcessRule(data: Partial<ProcessRule>) {
    return await this.adapter.create(data);
  }
  async getProcessRuleById(id: string) {
    return await this.adapter.findById(id);
  }
  async getAllProcessRules() {
    return await this.adapter.findAll();
  }
  async updateProcessRule(id: string, data: Partial<ProcessRule>) {
    return await this.adapter.update(id, data);
  }
  async deleteProcessRule(id: string) {
    return await this.adapter.delete(id);
  }
}

export const processRuleRepository = new ProcessRuleRepository();