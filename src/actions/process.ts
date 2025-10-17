import { Process } from "@/app/types/types";
import { processService } from "@/services/ProcessService";

export async function createProcess(data: Partial<Process>) {
  return await processService.createProcess(data);
}

export async function getProcessById(id: string) {
  return await processService.getProcessById(id);
}

export async function getAllProcesses() {
  return await processService.getAllProcesses();
}

export async function updateProcess(id: string, data: Process) {
  return await processService.updateProcess(id, data);
}

export async function deleteProcess(id: string) {
  return await processService.deleteProcess(id);
}