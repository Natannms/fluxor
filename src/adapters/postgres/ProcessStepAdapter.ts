import { ProcessStep } from "@/app/types/types";
import prisma from "../../../prisma/prismaClient";
import { IProcessStepAdapter } from "../AdapterInterface";
import { Prisma } from "@prisma/client";

export const ProcessStepAdapter: IProcessStepAdapter = {
  async create(data: Prisma.ProcessStepUncheckedCreateInput): Promise<ProcessStep> {
    return await prisma.processStep.create({ data });
  },
  async findById(id: string): Promise<ProcessStep | null> {
    return await prisma.processStep.findUnique({ where: { id } });
  },
  async findAll(): Promise<ProcessStep[]> {
    return await prisma.processStep.findMany();
  },
  async update(id: string, data: Partial<ProcessStep>): Promise<ProcessStep> {
    return await prisma.processStep.update({ where: { id }, data });
  },
  async delete(id: string): Promise<void> {
    await prisma.processStep.delete({ where: { id } });
  },
};