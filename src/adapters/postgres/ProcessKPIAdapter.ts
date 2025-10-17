import { ProcessKPI } from "@/app/types/types";
import prisma from "../../../prisma/prismaClient";
import { Prisma } from "@prisma/client";// gambiarra
import { IProcessKPIAdapter } from "../AdapterInterface";

export const ProcessKPIAdapter: IProcessKPIAdapter = {
  async create(data: Prisma.ProcessKPICreateInput): Promise<ProcessKPI> {
    return await prisma.processKPI.create({ data });
  },
  async findById(id: string): Promise<ProcessKPI | null> {
    return await prisma.processKPI.findUnique({ where: { id } });
  },
  async findAll(): Promise<ProcessKPI[]> {
    return await prisma.processKPI.findMany();
  },
  async update(id: string, data: Partial<ProcessKPI>): Promise<ProcessKPI> {
    return await prisma.processKPI.update({ where: { id }, data });
  },
  async delete(id: string): Promise<void> {
    await prisma.processKPI.delete({ where: { id } });
  },
};