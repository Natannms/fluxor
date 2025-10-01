import { ProcessRule } from "@/app/types/types";
import prisma from "../../../prisma/prismaClient";
import { IProcessRuleAdapter } from "../AdapterInterface";
import { Prisma } from "@prisma/client";

export const ProcessRuleAdapter: IProcessRuleAdapter = {
  async create(data: Prisma.ProcessRuleUncheckedCreateInput): Promise<ProcessRule> {
    return await prisma.processRule.create({ data });
  },
  async findById(id: string): Promise<ProcessRule | null> {
    return await prisma.processRule.findUnique({ where: { id } });
  },
  async findAll(): Promise<ProcessRule[]> {
    return await prisma.processRule.findMany();
  },
  async update(id: string, data: Partial<ProcessRule>): Promise<ProcessRule> {
    return await prisma.processRule.update({ where: { id }, data });
  },
  async delete(id: string): Promise<void> {
    await prisma.processRule.delete({ where: { id } });
  },
};