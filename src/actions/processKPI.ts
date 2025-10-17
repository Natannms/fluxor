import { ProcessKPI } from "@/app/types/types";
import { processKPIService } from "@/services/ProcessKPIService";

export async function createProcessKPI(data: Partial<ProcessKPI>) {
  return await processKPIService.createProcessKPI(data);
}

export async function getProcessKPIById(id: string) {
  return await processKPIService.getProcessKPIById(id);
}

export async function getAllProcessKPIs() {
  return await processKPIService.getAllProcessKPIs();
}

export async function updateProcessKPI(id: string, data: Partial<ProcessKPI>) {
  return await processKPIService.updateProcessKPI(id, data);
}

export async function deleteProcessKPI(id: string) {
  return await processKPIService.deleteProcessKPI(id);
}