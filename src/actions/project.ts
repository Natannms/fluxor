import { projectService } from "@/services/ProjectService";

export async function createProject(data: any) {
  return await projectService.createProject(data);
}

export async function getProjectById(id: string) {
  return await projectService.getProjectById(id);
}

export async function getAllProjects() {
  return await projectService.getAllProjects();
}

export async function updateProject(id: string, data: any) {
  return await projectService.updateProject(id, data);
}

export async function deleteProject(id: string) {
  return await projectService.deleteProject(id);
}