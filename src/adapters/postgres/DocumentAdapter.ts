import { Document } from "@/app/types/types";
import prisma from "../../../prisma/prismaClient";
import { Prisma } from "@prisma/client";

export const DocumentAdapter = {
  async create(data: Prisma.DocumentUncheckedCreateInput): Promise<Document> {
    return await prisma.document.create({ data });
  },
  async findById(id: string): Promise<Document | null> {
    return await prisma.document.findUnique({ where: { id } });
  },
  async findAll(): Promise<Document[]> {
    return await prisma.document.findMany();
  },
  async update(id: string, data: Partial<Document>): Promise<Document> {
    return await prisma.document.update({ where: { id }, data });
  },
  async delete(id: string): Promise<void> {
    await prisma.document.delete({ where: { id } });
  },
};