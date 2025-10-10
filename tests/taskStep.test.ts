import { TaskStep } from "../src/app/types/types";
import { TaskStepService } from "../src/services/TaskStepService";
import prisma from "../prisma/prismaClient";

describe("TaskStepService - regras e erros", () => {
  let service: TaskStepService;
  let testUser: any;
  let testProcess: any;
  let testStep: any;
  let createdTaskStep: any;

  beforeAll(async () => {
    service = new TaskStepService();

    testUser = await prisma.user.create({
      data: {
        name: "Usuário Teste TaskStep",
        email: `taskstep_test_${Date.now()}@email.com`,
        password: "123456",
        role: "COLABORADOR",
      },
    });

    testProcess = await prisma.process.create({
      data: {
        code: `taskstep_code_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        department: "TI",
        createdAt: new Date(),
        createdById: testUser.id,
        name: "Processo Teste TaskStep",
        inputs: [],
        outputs: [],
        stage: "DRAFT",
        resources: [],
        updatedAt: new Date(),
      },
    });

    testStep = await prisma.processStep.create({
      data: {
        processId: testProcess.id,
        order: 1,
        title: "Passo Base para TaskStep",
        description: "Descrição do passo base",
        ownerId: testUser.id,
        estimatedTime: 30,
      },
    });
  });

  afterAll(async () => {
    await prisma.taskStep.deleteMany({ where: { stepId: testStep.id } });
    await prisma.processStep.delete({ where: { id: testStep.id } });
    await prisma.process.delete({ where: { id: testProcess.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
  });

  // createTaskStep
  it("createTaskStep - happy path", async () => {
    const params: Partial<TaskStep> = {
      stepId: testStep.id,
      title: "Tarefa do Passo",
      description: "Descrição da tarefa",
      assignedToId: testUser.id,
      dueDate: new Date(),
      status: "PENDING",
    };

    createdTaskStep = await service.createTaskStep(params);
    expect(createdTaskStep).toHaveProperty("id");
    expect(createdTaskStep.stepId).toBe(testStep.id);
    expect(createdTaskStep.title).toBe("Tarefa do Passo");
    expect(createdTaskStep.status).toBe("PENDING");
  });

  it("createTaskStep - erro: dados inválidos", async () => {
    await expect(service.createTaskStep({})).rejects.toThrow();
  });

  // getTaskStepById
  it("getTaskStepById - happy path", async () => {
    const task = await service.getTaskStepById(createdTaskStep.id);
    expect(task).not.toBeNull();
    expect(task?.id).toBe(createdTaskStep.id);
  });

  it("getTaskStepById - erro: id inexistente", async () => {
    const task = await service.getTaskStepById("id_inexistente");
    expect(task).toBeNull();
  });

  // getAllTaskSteps
  it("getAllTaskSteps - happy path", async () => {
    const tasks = await service.getAllTaskSteps();
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThanOrEqual(1);
  });

  // updateTaskStep
  it("updateTaskStep - happy path", async () => {
    const updated = await service.updateTaskStep(createdTaskStep.id, {
      ...createdTaskStep,
      status: "IN_PROGRESS",
      title: "Tarefa Atualizada",
    });
    expect(updated.status).toBe("IN_PROGRESS");
    expect(updated.title).toBe("Tarefa Atualizada");
  });

  it("updateTaskStep - erro: id inexistente", async () => {
    await expect(
      service.updateTaskStep("id_inexistente", { title: "Novo" } as TaskStep)
    ).rejects.toThrow();
  });

  // deleteTaskStep
  it("deleteTaskStep - happy path", async () => {
    await expect(service.deleteTaskStep(createdTaskStep.id)).resolves.toBeUndefined();
    const task = await service.getTaskStepById(createdTaskStep.id);
    expect(task).toBeNull();
  });

  it("deleteTaskStep - erro: id inexistente", async () => {
    await expect(service.deleteTaskStep("id_inexistente")).rejects.toThrow();
  });
});