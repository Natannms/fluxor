import { IProjectRepository, projectRepository } from "../repositories/ProjectRepository";

export interface IProjectService {
  createProject(data: any): Promise<any>;
  getProjectById(id: string): Promise<any>;
  getAllProjects(): Promise<any[]>;
  updateProject(id: string, data: any): Promise<any>;
  deleteProject(id: string): Promise<void>;
}

export class ProjectService implements IProjectService {
  constructor(private repository: IProjectRepository = projectRepository) {}

  async createProject(data: any) {
    return await this.repository.createProject(data);
  }
  async getProjectById(id: string) {
    return await this.repository.getProjectById(id);
  }
  async getAllProjects() {
    return await this.repository.getAllProjects();
  }
  async updateProject(id: string, data: any) {
    return await this.repository.updateProject(id, data);
  }
  async deleteProject(id: string) {
    return await this.repository.deleteProject(id);
  }
}

export const projectService = new ProjectService();