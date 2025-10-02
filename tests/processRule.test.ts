import { ProcessRule } from "../src/app/types/types";
import { ProcessRuleService } from "../src/services/ProcessRuleService";
import prisma from "../prisma/prismaClient";
import { faker } from "@faker-js/faker";
import { RuleType } from "@prisma/client";

describe("ProcessRuleService - regras e erros", () => {
  let service: ProcessRuleService;
  let testUser: any;
  let testProcess: any;
  let createdRule: any;

  beforeAll(async () => {
    service = new ProcessRuleService();
    testUser = await prisma.user.create({
      data: {
        name: "Usuário Teste Rule",
        email: `rule_test_${Date.now()}@email.com`,
        password: "123456",
        role: "COLABORADOR",
      },
    });
    testProcess = await prisma.process.create({
      data: {
        code: `rule_code_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        department: "TI",
        createdAt: new Date(),
        createdById: testUser.id,
        name: "Processo Teste Rule",
        inputs: [],
        outputs: [],
        stage: "DRAFT",
        resources: [],
        updatedAt: new Date(),
      },
    });
  });

  afterAll(async () => {
    await prisma.processRule.deleteMany({ where: { processId: testProcess.id } });
    await prisma.process.delete({ where: { id: testProcess.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
  });

  // createProcessRule
  it("createProcessRule - happy path", async () => {
    const params: Partial<ProcessRule> = {
  processId: testProcess.id,
  description: "Descrição da regra",
  mitigation: "Mitigação de teste",
  type: "BUSINESS_RULE"
};
createdRule = await service.createProcessRule(params);
expect(createdRule).toHaveProperty("id");
expect(createdRule.processId).toBe(testProcess.id);
expect(createdRule.description).toBe("Descrição da regra");
expect(createdRule.mitigation).toBe("Mitigação de teste");
  });

  it("createProcessRule - erro: dados inválidos", async () => {
    await expect(service.createProcessRule({})).rejects.toThrow();
  });

  // getProcessRuleById
  it("getProcessRuleById - happy path", async () => {
    const rule = await service.getProcessRuleById(createdRule.id);
    expect(rule).not.toBeNull();
    expect(rule?.id).toBe(createdRule.id);
  });

  it("getProcessRuleById - erro: id inexistente", async () => {
    const rule = await service.getProcessRuleById("id_inexistente");
    expect(rule).toBeNull();
  });

  // getAllProcessRules
  it("getAllProcessRules - happy path", async () => {
    const rules = await service.getAllProcessRules();
    expect(Array.isArray(rules)).toBe(true);
    expect(rules.length).toBeGreaterThanOrEqual(1);
  });

  // updateProcessRule
  it("updateProcessRule - happy path", async () => {
    const updated = await service.updateProcessRule(createdRule.id, {
  description: "Regra Atualizada",
});
expect(updated.description).toBe("Regra Atualizada");
  });

  it("updateProcessRule - erro: id inexistente", async () => {
    await expect(
  service.updateProcessRule("id_inexistente", { description: "Novo" } as Partial<ProcessRule>)
).rejects.toThrow();
  });

  // deleteProcessRule
  it("deleteProcessRule - happy path", async () => {
    await expect(service.deleteProcessRule(createdRule.id)).resolves.toBeUndefined();
    const rule = await service.getProcessRuleById(createdRule.id);
    expect(rule).toBeNull();
  });

  it("deleteProcessRule - erro: id inexistente", async () => {
    await expect(service.deleteProcessRule("id_inexistente")).rejects.toThrow();
  });
});