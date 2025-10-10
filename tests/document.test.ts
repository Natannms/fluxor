import { Document } from "../src/app/types/types";
import { DocumentService } from "../src/services/DocumentService";
import prisma from "../prisma/prismaClient";

describe("DocumentService - regras e erros", () => {
  let service: DocumentService;
  let testUser: any;
  let testProcess: any;
  let testStep: any;
  let createdDocument: any;

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
    const params: Partial<Document> = {
      stepId: testStep.id,
      name: "Manual de Processo",
      url: "https://example.com/manual.pdf",
      uploadedById: testUser.id,
      uploadedAt: new Date(),
    };

    createdDocument = await service.createDocument(params);
    expect(createdDocument).toHaveProperty("id");
    expect(createdDocument.stepId).toBe(testStep.id);
    expect(createdDocument.name).toBe("Manual de Processo");
    expect(createdDocument.url).toBe("https://example.com/manual.pdf");
  });

  it("createDocument - erro: dados inválidos", async () => {
    await expect(service.createDocument({})).rejects.toThrow();
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
    const updated = await service.updateDocument(createdDocument.id, {
      ...createdDocument,
      url: "https://example.com/manual_v2.pdf",
      name: "Manual Atualizado",
    });
    expect(updated.url).toBe("https://example.com/manual_v2.pdf");
    expect(updated.name).toBe("Manual Atualizado");
  });

  it("updateDocument - erro: id inexistente", async () => {
    await expect(
      service.updateDocument("id_inexistente", { name: "Novo" } as Document)
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