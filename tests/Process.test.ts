import { Process } from "../src/app/types/types";
import { ProcessService } from "../src/services/ProcessService";
import prisma from "../prisma/prismaClient";
import { faker } from "@faker-js/faker";

describe("ProcessService - regras e erros", () => {
  let service: ProcessService;
  let testUser: any;
  let createdProcess: any;

  beforeAll(async () => {
    service = new ProcessService();
    testUser = await prisma.user.create({
      data: {
        name: "Usuário Teste Process",
        email: `process_test_${Date.now()}@email.com`,
        password: "123456",
        role: "COLABORADOR",
      },
    });
  });

  afterAll(async () => {
    await prisma.process.deleteMany({ where: { createdById: testUser.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
  });

  // createProcess
  it("createProcess - happy path", async () => {
    const params: Partial<Process> = {
      code: `process_code_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      department: "TI",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: testUser.id,
      name: "Processo Teste",
      inputs: [],
      outputs: [],
      resources: [],
      stage: "DRAFT",
      description: "Descrição do processo",
      objective: "Objetivo do processo",
      scopeInclude: "Escopo incluído",
      scopeExclude: "Escopo excluído",
      trigger: "Gatilho do processo"
    };
    createdProcess = await service.createProcess(params);
    expect(createdProcess).toHaveProperty("id");
    expect(createdProcess.code).toBe(params.code);
    expect(createdProcess.name).toBe("Processo Teste");
  });

  it("createProcess - erro: dados inválidos", async () => {
    await expect(service.createProcess({})).rejects.toThrow();
  });

  // getProcessById
  it("getProcessById - happy path", async () => {
    const process = await service.getProcessById(createdProcess.id);
    expect(process).not.toBeNull();
    expect(process.id).toBe(createdProcess.id);
  });

  it("getProcessById - erro: id inexistente", async () => {
    const result = await service.getProcessById("id_inexistente");
    expect(result).toBeNull();
  });

  // getAllProcesses
  it("getAllProcesses - happy path", async () => {
    const processes = await service.getAllProcesses();
    expect(Array.isArray(processes)).toBe(true);
    expect(processes.length).toBeGreaterThanOrEqual(1);
  });

  // updateProcess
  it("updateProcess - happy path", async () => {
    const updated = await service.updateProcess(createdProcess.id, {
      ...createdProcess,
      name: "Processo Atualizado",
      updatedAt: new Date(),
    });
    expect(updated.name).toBe("Processo Atualizado");
  });

  it("updateProcess - erro: id inexistente", async () => {
    await expect(
      service.updateProcess("id_inexistente", { ...createdProcess, name: "Novo" })
    ).rejects.toThrow();
  });

  // deleteProcess
  it("deleteProcess - happy path", async () => {
    await expect(service.deleteProcess(createdProcess.id)).resolves.toBeUndefined();
    const result = await service.getProcessById(createdProcess.id);
    expect(result).toBeNull();
  });

  it("deleteProcess - erro: id inexistente", async () => {
    await expect(service.deleteProcess("id_inexistente")).rejects.toThrow();
  });
});