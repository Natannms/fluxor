import { Process } from "@/app/types/types";
import { ProcessService } from "../src/services/ProcessService";
import prisma from "../prisma/prismaClient";
import { faker } from "@faker-js/faker";

describe("ProcessService", () => {
    let testUser: any;
    let testCompany: any;
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
      //await prisma.user.delete({ where: { id: testUser.id } });
      // Remove a empresa criada
      //await prisma.company.delete({ where: { id: testCompany.id } });
    });

    it("shoud create a process", async () => {
        const service = new ProcessService();
        const parans: Partial<Process> = {
            code: faker.lorem.word(),
            department: "TI",
            createdAt: new Date(),
            createdById: testUser.id,
            name: "Processo Teste",
            inputs: [],
            outputs: [],
            stage: "DRAFT",
            resources: [],
            updatedAt: new Date(),
        }
        const process = await service.createProcess(parans)
        expect(process).toHaveProperty("id")
    } )
})