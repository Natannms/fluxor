import { ProcessKPI } from "@/app/types/types";
import { ProcessKPIService } from "../src/services/ProcessKPIService";
import prisma from "../prisma/prismaClient";
import { faker } from "@faker-js/faker";

describe("ProcessKPIService - regras e erros", () => {
  let service: ProcessKPIService;
  let testUser: any;
  let testProcess: any;
  let createdKPI: any;

  beforeAll(async () => {
    service = new ProcessKPIService();
    testUser = await prisma.user.create({
      data: {
        name: "Usuário Teste KPI",
        email: `kpi_test_${Date.now()}@email.com`,
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
        name: "Processo Teste KPI",
        inputs: [],
        outputs: [],
        stage: "DRAFT",
        resources: [],
        updatedAt: new Date(),
      },
    });
  });

  afterAll(async () => {
    await prisma.processKPI.deleteMany({ where: { processId: testProcess.id } });
    await prisma.process.delete({ where: { id: testProcess.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
  });

  // createProcessKPI
  it("createProcessKPI - happy path", async () => {
    const params: Partial<ProcessKPI> = {
      processId: testProcess.id,
      name: "Tempo Médio",
      value: 10,
      unit: "horas",
    };
    createdKPI = await service.createProcessKPI(params);
    expect(createdKPI).toHaveProperty("id");
    expect(createdKPI.processId).toBe(testProcess.id);
    expect(createdKPI.name).toBe("Tempo Médio");
  });

  it("createProcessKPI - erro: dados inválidos", async () => {
    await expect(service.createProcessKPI({})).rejects.toThrow();
  });

  // getProcessKPIById
  it("getProcessKPIById - happy path", async () => {
    const kpi = await service.getProcessKPIById(createdKPI.id);
    expect(kpi).not.toBeNull();
    expect(kpi?.id).toBe(createdKPI.id);
  });

  it("getProcessKPIById - erro: id inexistente", async () => {
    const kpi = await service.getProcessKPIById("id_inexistente");
    expect(kpi).toBeNull();
  });

  // getAllProcessKPIs
  it("getAllProcessKPIs - happy path", async () => {
    const kpis = await service.getAllProcessKPIs();
    expect(Array.isArray(kpis)).toBe(true);
    expect(kpis.length).toBeGreaterThanOrEqual(1);
  });

  // updateProcessKPI
  it("updateProcessKPI - happy path", async () => {
    const updated = await service.updateProcessKPI(createdKPI.id, {
      ...createdKPI,
      value: 20,
    });
    expect(updated.value).toBe(20);
  });

  it("updateProcessKPI - erro: id inexistente", async () => {
    await expect(
      service.updateProcessKPI("id_inexistente", { value: 99 } as ProcessKPI)
    ).rejects.toThrow();
  });

  // deleteProcessKPI
  it("deleteProcessKPI - happy path", async () => {
    await expect(service.deleteProcessKPI(createdKPI.id)).resolves.toBeUndefined();
    const kpi = await service.getProcessKPIById(createdKPI.id);
    expect(kpi).toBeNull();
  });

  it("deleteProcessKPI - erro: id inexistente", async () => {
    await expect(service.deleteProcessKPI("id_inexistente")).rejects.toThrow();
  });
});