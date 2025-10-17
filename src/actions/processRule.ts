import { ProcessRule } from "@/app/types/types";
import { processRuleService } from "@/services/ProcessRuleService";

export async function createProcessRule(data: Partial<ProcessRule>) {
  return await processRuleService.createProcessRule(data);
}

export async function getProcessRuleById(id: string) {
  return await processRuleService.getProcessRuleById(id);
}

export async function getAllProcessRules() {
  return await processRuleService.getAllProcessRules();
}

export async function updateProcessRule(id: string, data: Partial<ProcessRule>) {
  return await processRuleService.updateProcessRule(id, data);
}

export async function deleteProcessRule(id: string) {
  return await processRuleService.deleteProcessRule(id);
}