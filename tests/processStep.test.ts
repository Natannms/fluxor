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
        code: faker.lorem.word(),
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
});