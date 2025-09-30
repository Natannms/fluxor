import { IProjectAdapter } from "../adapters/AdapterInterface";
import { ProjectAdapter } from "../adapters/postgres/ProjectAdapter";

export interface IProjectRepository {
  createProject(data: any): Promise<any>;
  getProjectById(id: string): Promise<any>;
  getAllProjects(): Promise<any[]>;
  updateProject(id: string, data: any): Promise<any>;
  deleteProject(id: string): Promise<void>;
}

export class ProjectRepository implements IProjectRepository {
  constructor(private adapter: IProjectAdapter = ProjectAdapter) {}

  async createProject(data: any) {
    return await this.adapter.create(data);
  }
  async getProjectById(id: string) {
    return await this.adapter.findById(id);
  }
  async getAllProjects() {
    return await this.adapter.findAll();
  }
  async updateProject(id: string, data: any) {
    return await this.adapter.update(id, data);
  }
  async deleteProject(id: string) {
    return await this.adapter.delete(id);
  }
}

export const projectRepository = new ProjectRepository();