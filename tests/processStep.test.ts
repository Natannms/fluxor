import { ProcessStep } from "@/app/types/types";
import { ProcessStepService } from "../src/services/ProcessStepService";
import prisma from "../prisma/prismaClient";
import { faker } from "@faker-js/faker";

describe("ProcessStepService", () => {
  let testUser: any;
  let testProcess: any;

  beforeAll(async () => {
    // Cria um usuário real para usar nos testes
    testUser = await prisma.user.create({
      data: {
        name: "Usuário Teste Step",
        email: `step_test_${Date.now()}@email.com`,
        password: "123456",
        role: "COLABORADOR",
      },
    });

    // Cria um processo real para usar nos testes
    testProcess = await prisma.process.create({
      data: {
        code: `step_code_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        department: "TI",
        createdAt: new Date(),
        createdById: testUser.id,
        name: "Processo Teste Step",
        inputs: [],
        outputs: [],
        stage: "DRAFT",
        resources: [],
        updatedAt: new Date(),
      },
    });
  });

  afterAll(async () => {
    // Remove o usuário e o processo criados
    //await prisma.process.delete({ where: { id: testProcess.id } });
    //await prisma.user.delete({ where: { id: testUser.id } });
  });

  it("should create a process step", async () => {
    const service = new ProcessStepService();
    const params: Partial<ProcessStep> = {
      processId: testProcess.id,
      order: 1,
      title: "Primeiro Passo",
      description: "Descrição do passo",
      ownerId: testUser.id,
      estimatedTime: 60,
    };
    const step = await service.createProcessStep(params);
    expect(step).toHaveProperty("id");
    expect(step.processId).toBe(testProcess.id);
    expect(step.title).toBe("Primeiro Passo");
  });

  describe("ProcessStepService - regras e erros", () => {
    let service: ProcessStepService;
    let testUser: any;
    let testProcess: any;
    let createdStep: any;
  
    beforeAll(async () => {
      service = new ProcessStepService();
      testUser = await prisma.user.create({
        data: {
          name: "Usuário Teste Step",
          email: `step_test_${Date.now()}@email.com`,
          password: "123456",
          role: "COLABORADOR",
        },
      });
      testProcess = await prisma.process.create({
        data: {
          code: `code_${Date.now()}`,
          department: "TI",
          createdAt: new Date(),
          createdById: testUser.id,
          name: "Processo Teste Step",
          inputs: [],
          outputs: [],
          stage: "DRAFT",
          resources: [],
          updatedAt: new Date(),
        },
      });
    });
  
    afterAll(async () => {
      await prisma.processStep.deleteMany({ where: { processId: testProcess.id } });
      await prisma.process.delete({ where: { id: testProcess.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
    });
  
    // createProcessStep
    it("createProcessStep - happy path", async () => {
      const params: Partial<ProcessStep> = {
        processId: testProcess.id,
        order: 1,
        title: "Primeiro Passo",
        description: "Descrição do passo",
        ownerId: testUser.id,
        estimatedTime: 60,
      };
      createdStep = await service.createProcessStep(params);
      expect(createdStep).toHaveProperty("id");
      expect(createdStep.processId).toBe(testProcess.id);
    });
  
    it("createProcessStep - erro: dados inválidos", async () => {
      await expect(service.createProcessStep({})).rejects.toThrow();
    });
  
    // getProcessStepById
    it("getProcessStepById - happy path", async () => {
      const step = await service.getProcessStepById(createdStep.id);
      expect(step).not.toBeNull();
      expect(step?.id).toBe(createdStep.id);
    });
  
    it("getProcessStepById - erro: id inexistente", async () => {
      const step = await service.getProcessStepById("id_inexistente");
      expect(step).toBeNull();
    });
  
    // getAllProcessSteps
    it("getAllProcessSteps - happy path", async () => {
      const steps = await service.getAllProcessSteps();
      expect(Array.isArray(steps)).toBe(true);
      expect(steps.length).toBeGreaterThanOrEqual(1);
    });
  
    // updateProcessStep
    it("updateProcessStep - happy path", async () => {
      const updated = await service.updateProcessStep(createdStep.id, {
        ...createdStep,
        title: "Passo Atualizado",
      });
      expect(updated.title).toBe("Passo Atualizado");
    });
  
    it("updateProcessStep - erro: id inexistente", async () => {
      await expect(
        service.updateProcessStep("id_inexistente", { title: "Novo" } as ProcessStep)
      ).rejects.toThrow();
    });
  
    // deleteProcessStep
    it("deleteProcessStep - happy path", async () => {
      await expect(service.deleteProcessStep(createdStep.id)).resolves.toBeUndefined();
      const step = await service.getProcessStepById(createdStep.id);
      expect(step).toBeNull();
    });
  
    it("deleteProcessStep - erro: id inexistente", async () => {
      await expect(service.deleteProcessStep("id_inexistente")).rejects.toThrow();
    });
  });
});

