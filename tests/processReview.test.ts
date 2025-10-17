import { ProcessReview, ReviewStatus } from "../src/app/types/types";
import { ProcessReviewService } from "../src/services/ProcessReviewService";
import prisma from "../prisma/prismaClient";
import { faker } from "@faker-js/faker";

describe("ProcessReviewService - regras e erros", () => {
  let service: ProcessReviewService;
  let testUser: any;
  let testProcess: any;
  let createdReview: any;

  beforeAll(async () => {
    service = new ProcessReviewService();
    testUser = await prisma.user.create({
      data: {
        name: "Usuário Teste Review",
        email: `review_test_${Date.now()}@email.com`,
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
        name: "Processo Teste Review",
        inputs: [],
        outputs: [],
        stage: "DRAFT",
        resources: [],
        updatedAt: new Date(),
      },
    });
  });

  afterAll(async () => {
    await prisma.processReview.deleteMany({ where: { processId: testProcess.id } });
    await prisma.process.delete({ where: { id: testProcess.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
  });

  // createProcessReview
  it("createProcessReview - happy path", async () => {
    const params: Partial<ProcessReview> = {
      processId: testProcess.id,
      reviewerId: testUser.id,
      status: ReviewStatus.PENDING,
      comments: "Primeira revisão",
    };
    createdReview = await service.createProcessReview(params);
    expect(createdReview).toHaveProperty("id");
    expect(createdReview.processId).toBe(testProcess.id);
    expect(createdReview.status).toBe(ReviewStatus.PENDING);
  });

  it("createProcessReview - erro: dados inválidos", async () => {
    await expect(service.createProcessReview({})).rejects.toThrow();
  });

  // getProcessReviewById
  it("getProcessReviewById - happy path", async () => {
    const review = await service.getProcessReviewById(createdReview.id);
    expect(review).not.toBeNull();
    expect(review?.id).toBe(createdReview.id);
  });

  it("getProcessReviewById - erro: id inexistente", async () => {
    const review = await service.getProcessReviewById("id_inexistente");
    expect(review).toBeNull();
  });

  // getAllProcessReviews
  it("getAllProcessReviews - happy path", async () => {
    const reviews = await service.getAllProcessReviews();
    expect(Array.isArray(reviews)).toBe(true);
    expect(reviews.length).toBeGreaterThanOrEqual(1);
  });

  // updateProcessReview
  it("updateProcessReview - happy path", async () => {
    const updated = await service.updateProcessReview(createdReview.id, {
      ...createdReview,
      status: ReviewStatus.APPROVED,
    });
    expect(updated.status).toBe(ReviewStatus.APPROVED);
  });

  it("updateProcessReview - erro: id inexistente", async () => {
    await expect(
      service.updateProcessReview("id_inexistente", { status: ReviewStatus.REJECTED } as ProcessReview)
    ).rejects.toThrow();
  });

  // deleteProcessReview
  it("deleteProcessReview - happy path", async () => {
    await expect(service.deleteProcessReview(createdReview.id)).resolves.toBeUndefined();
    const review = await service.getProcessReviewById(createdReview.id);
    expect(review).toBeNull();
  });

  it("deleteProcessReview - erro: id inexistente", async () => {
    await expect(service.deleteProcessReview("id_inexistente")).rejects.toThrow();
  });
});