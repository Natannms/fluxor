import { TaskStep } from "@/app/types/types";
import { TaskStepAdapter } from "../adapters/postgres/TaskStepAdapter";

export interface ITaskStepRepository {
  createTaskStep(data: Partial<TaskStep>): Promise<TaskStep>;
  getTaskStepById(id: string): Promise<TaskStep | null>;
  getAllTaskSteps(): Promise<TaskStep[]>;
  updateTaskStep(id: string, data: TaskStep): Promise<TaskStep>;
  deleteTaskStep(id: string): Promise<void>;
}

export class TaskStepRepository implements ITaskStepRepository {
  constructor(private adapter = TaskStepAdapter) {}

  async createTaskStep(data: Partial<TaskStep>) {
    return await this.adapter.create(data);
  }
  async getTaskStepById(id: string) {
    return await this.adapter.findById(id);
  }
  async getAllTaskSteps() {
    return await this.adapter.findAll();
  }
  async updateTaskStep(id: string, data: TaskStep) {
    return await this.adapter.update(id, data);
  }
  async deleteTaskStep(id: string) {
    return await this.adapter.delete(id);
  }
}

export const taskStepRepository = new TaskStepRepository();