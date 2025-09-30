import { Process } from "@/app/types/types";
import prisma from "../../../prisma/prismaClient";
import { IProcessAdapter } from "../AdapterInterface";

export const ProcessAdapter: IProcessAdapter = {
  async create(data: Partial<Process>): Promise<Process> {
    return await prisma.process.create({ data });
  },
  async findById(id: string): Promise<Process> {
    return await prisma.process.findUnique({ where: { id } });
  },
  async findAll(): Promise<Process[]> {
    return await prisma.process.findMany();
  },
  async update(id: string, data: Partial<Process>): Promise<Process> {
    return await prisma.process.update({ where: { id }, data });
  },
  async delete(id: string): Promise<void> {
    await prisma.process.delete({ where: { id } });
  },
};