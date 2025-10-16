import { Document as PrismaDocument, User, Process, ProcessStep } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { DocumentService } from "../src/services/DocumentService";
import prisma from "../prisma/prismaClient";

describe("DocumentService - regras e erros", () => {
  let service: DocumentService;
  let testUser: User;
  let testProcess: Process;
  let testStep: ProcessStep;
  let createdDocument: PrismaDocument;

  beforeAll(async () => {
    service = new DocumentService();

    testUser = await prisma.user.create({
      data: {
        name: "Usuário Teste Document",
        email: `document_test_${Date.now()}@email.com`,
        password: "123456",
        role: "COLABORADOR",
      },
    });

    testProcess = await prisma.process.create({
      data: {
        code: `document_code_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        department: "TI",
        createdAt: new Date(),
        createdById: testUser.id,
        name: "Processo Teste Document",
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
        title: "Passo Base para Document",
        description: "Descrição do passo base",
        ownerId: testUser.id,
        estimatedTime: 45,
      },
    });
  });

  afterAll(async () => {
    await prisma.document.deleteMany({ where: { stepId: testStep.id } });
    await prisma.processStep.delete({ where: { id: testStep.id } });
    await prisma.process.delete({ where: { id: testProcess.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
  });

  // createDocument
  it("createDocument - happy path", async () => {
    const documentData: Prisma.DocumentCreateInput = {
  title: "Manual de Processo",
  type: "PDF",
  link: "https://example.com/manual.pdf",
  description: "Descrição do documento",
  step: { connect: { id: testStep.id } },
  // Se quiser relacionar ao TaskStep, use:
  // taskStep: { connect: { id: testTaskStep.id } }
};

    createdDocument = await service.createDocument(documentData);
    expect(createdDocument).toHaveProperty("id");
    expect(createdDocument.stepId).toBe(testStep.id);
    expect(createdDocument.title).toBe("Manual de Processo");
    expect(createdDocument.link).toBe("https://example.com/manual.pdf");
  });

  it("createDocument - erro: dados inválidos", async () => {
    await expect(service.createDocument({} as Prisma.DocumentCreateInput)).rejects.toThrow();
  });

  // getDocumentById
  it("getDocumentById - happy path", async () => {
    const doc = await service.getDocumentById(createdDocument.id);
    expect(doc).not.toBeNull();
    expect(doc?.id).toBe(createdDocument.id);
  });

  it("getDocumentById - erro: id inexistente", async () => {
    const doc = await service.getDocumentById("id_inexistente");
    expect(doc).toBeNull();
  });

  // getAllDocuments
  it("getAllDocuments - happy path", async () => {
    const docs = await service.getAllDocuments();
    expect(Array.isArray(docs)).toBe(true);
    expect(docs.length).toBeGreaterThanOrEqual(1);
  });

  // updateDocument
  it("updateDocument - happy path", async () => {
    const updateData: Prisma.DocumentUpdateInput = {
      link: { set: "https://example.com/manual_v2.pdf" },
      title: { set: "Manual Atualizado" },
    };
    const updated = await service.updateDocument(createdDocument.id, updateData);
    expect(updated.link).toBe("https://example.com/manual_v2.pdf");
    expect(updated.title).toBe("Manual Atualizado");
  });

  it("updateDocument - erro: id inexistente", async () => {
    await expect(
      service.updateDocument("id_inexistente", { title: { set: "Novo" } })
    ).rejects.toThrow();
  });

  // deleteDocument
  it("deleteDocument - happy path", async () => {
    await expect(service.deleteDocument(createdDocument.id)).resolves.toBeUndefined();
    const doc = await service.getDocumentById(createdDocument.id);
    expect(doc).toBeNull();
  });

  it("deleteDocument - erro: id inexistente", async () => {
    await expect(service.deleteDocument("id_inexistente")).rejects.toThrow();
  });
});