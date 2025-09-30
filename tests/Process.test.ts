import { Process } from "@/app/types/types";
import { ProcessService } from "../src/services/ProcessService";
import prisma from "../prisma/prismaClient";

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
      // Cria uma empresa real para usar nos testes
      testCompany = await prisma.company.create({
        data: {
          name: "Empresa Teste",
          email: `company_test_${Date.now()}@email.com`,
          password: "123456",
          role: "COLABORADOR",
        },
      });
  });
    afterAll(async () => {
      // Remove o usuário criado
      await prisma.user.delete({ where: { id: testUser.id } });
      // Remove a empresa criada
      await prisma.company.delete({ where: { id: testCompany.id } });
    });

    it("shoud create a process", async () => {
        const service = new ProcessService();
        const parans: Process = {
            code:"PC01",
            department: "TI",
            createdAt: new Date(),
            createdById: testUser.id,
            id: "123456",
            name: "Processo Teste",
            companyId: testCompany.id,
            inputs: [],
            outputs: [],
            stage: "DRAFT",
            resources: [],
            updatedAt: new Date(),
        }
        const process = await service.createProcess(parans)
    } )
})