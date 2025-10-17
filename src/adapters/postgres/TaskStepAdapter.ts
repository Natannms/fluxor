import { TaskStep } from "@/app/types/types";
import prisma from "../../../prisma/prismaClient";
import { Prisma } from "@prisma/client";

export const TaskStepAdapter = {
  async create(data: Prisma.TaskStepUncheckedCreateInput): Promise<TaskStep> {
    return await prisma.taskStep.create({ data });
  },
  async findById(id: string): Promise<TaskStep | null> {
    return await prisma.taskStep.findUnique({ where: { id } });
  },
  async findAll(): Promise<TaskStep[]> {
    return await prisma.taskStep.findMany();
  },
  async update(id: string, data: Partial<TaskStep>): Promise<TaskStep> {
    return await prisma.taskStep.update({ where: { id }, data });
  },
  async delete(id: string): Promise<void> {
    await prisma.taskStep.delete({ where: { id } });
  },
};