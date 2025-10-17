import { ProcessStep } from "@/app/types/types";
import { processStepService } from "@/services/ProcessStepService";

export async function createProcessStep(data: ProcessStep) {
  return await processStepService.createProcessStep(data);
}

export async function getProcessStepById(id: string) {
  return await processStepService.getProcessStepById(id);
}

export async function getAllProcessSteps() {
  return await processStepService.getAllProcessSteps();
}

export async function updateProcessStep(id: string, data: ProcessStep) {
  return await processStepService.updateProcessStep(id, data);
}

export async function deleteProcessStep(id: string) {
  return await processStepService.deleteProcessStep(id);
}