import prisma from "../../../prisma/prismaClient";
import { IProjectAdapter } from "../AdapterInterface";

export const ProjectAdapter: IProjectAdapter = {
  async create(data) {
    return await prisma.project.create({ data });
  },
  async findById(id) {
    return await prisma.project.findUnique({ where: { id } });
  },
  async findAll() {
    return await prisma.project.findMany();
  },
  async update(id, data) {
    return await prisma.project.update({ where: { id }, data });
  },
  async delete(id) {
    await prisma.project.delete({ where: { id } });
  },
};