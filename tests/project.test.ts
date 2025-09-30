import { ProjectService } from "../src/services/ProjectService";
import prisma from "../prisma/prismaClient";

describe("ProjectService", () => {
  let createdId: string;
  let testUser: any;
  const projectService = new ProjectService();
  beforeAll(async () => {

    // Cria um usuário real para usar nos testes
    testUser = await prisma.user.create({
      data: {
        name: "Usuário Teste Project",
        email: `project_test_${Date.now()}@email.com`,
        password: "123456",
        role: "COLABORADOR",
      },
    });
  });

  afterAll(async () => {
    // Remove o usuário criado
    await prisma.user.delete({ where: { id: testUser.id } });
  });

  it("should create a project", async () => {
    // const projectService = new ProjectService();
    const project = await projectService.createProject({
      title: "Projeto Teste",
      clientName: "Cliente Teste",
      createdById: testUser.id,
      stage: "OPORTUNIDADE",
    });
    expect(project).toHaveProperty("id");
    createdId = project.id;
  });

  it("should get a project by id", async () => {
    const project = await projectService.getProjectById(createdId);
    expect(project).not.toBeNull();
    expect(project.id).toBe(createdId);
  });

  it("should update a project", async () => {
    const updated = await projectService.updateProject(createdId, { title: "Novo Título" });
    expect(updated.title).toBe("Novo Título");
  });

  it("should get all projects", async () => {
    const projects = await projectService.getAllProjects();
    expect(Array.isArray(projects)).toBe(true);
  });

  it("should delete a project", async () => {
    await projectService.deleteProject(createdId);
    const project = await projectService.getProjectById(createdId);
    expect(project).toBeNull();
  });
});