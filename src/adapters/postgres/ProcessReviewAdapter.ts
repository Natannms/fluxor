import { ProcessReview } from "@/app/types/types";
import prisma from "../../../prisma/prismaClient";
import { Prisma } from "@prisma/client";
import { IProcessReviewAdapter } from "../AdapterInterface";

export const ProcessReviewAdapter: IProcessReviewAdapter = {
 async create(data: Prisma.ProcessReviewUncheckedCreateInput): Promise<ProcessReview> {
  return await prisma.processReview.create({ data });
  },
  async findById(id: string): Promise<ProcessReview | null> {
    return await prisma.processReview.findUnique({ where: { id } });
  },
  async findAll(): Promise<ProcessReview[]> {
    return await prisma.processReview.findMany();
  },
  async update(id: string, data: Partial<ProcessReview>): Promise<ProcessReview> {
    return await prisma.processReview.update({ where: { id }, data });
  },
  async delete(id: string): Promise<void> {
    await prisma.processReview.delete({ where: { id } });
  },
};