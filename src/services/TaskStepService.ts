import { TaskStep } from "@/app/types/types";
import { ITaskStepRepository, taskStepRepository } from "../repositories/TaskStepRepository";

export interface ITaskStepService {
  createTaskStep(data: Partial<TaskStep>): Promise<TaskStep>;
  getTaskStepById(id: string): Promise<TaskStep | null>;
  getAllTaskSteps(): Promise<TaskStep[]>;
  updateTaskStep(id: string, data: TaskStep): Promise<TaskStep>;
  deleteTaskStep(id: string): Promise<void>;
}

export class TaskStepService implements ITaskStepService {
  constructor(private repository: ITaskStepRepository = taskStepRepository) {}

  async createTaskStep(data: Partial<TaskStep>) {
    return await this.repository.createTaskStep(data);
  }
  async getTaskStepById(id: string) {
    return await this.repository.getTaskStepById(id);
  }
  async getAllTaskSteps() {
    return await this.repository.getAllTaskSteps();
  }
  async updateTaskStep(id: string, data: TaskStep) {
    return await this.repository.updateTaskStep(id, data);
  }
  async deleteTaskStep(id: string) {
    return await this.repository.deleteTaskStep(id);
  }
}

export const taskStepService = new TaskStepService();