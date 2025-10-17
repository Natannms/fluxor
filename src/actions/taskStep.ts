import { TaskStep } from "@/app/types/types";
import { taskStepService } from "@/services/TaskStepService";

export async function createTaskStep(data: TaskStep) {
  return await taskStepService.createTaskStep(data);
}

export async function getTaskStepById(id: string) {
  return await taskStepService.getTaskStepById(id);
}

export async function getAllTaskSteps() {
  return await taskStepService.getAllTaskSteps();
}

export async function updateTaskStep(id: string, data: TaskStep) {
  return await taskStepService.updateTaskStep(id, data);
}

export async function deleteTaskStep(id: string) {
  return await taskStepService.deleteTaskStep(id);
}