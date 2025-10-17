import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import prisma from "../../../prisma/prismaClient";
import { DepartmentAdapterInterface } from "../AdapterInterface";

type prismaType = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;

export class DepartmentPostgresAdapter implements DepartmentAdapterInterface {
  conn: prismaType;
  constructor(conn: prismaType) {
    this.conn = conn;
  }

  async create(data: Partial<any>): Promise<any> {
    return this.conn.department.create({ data: data as any });
  }

  async read(query: object): Promise<any[]> {
    return this.conn.department.findMany({ where: query });
  }

  async update(departmentId: string, data: Partial<any>): Promise<number> {
    const res = await this.conn.department.update({ where: { id: departmentId }, data: data as any });
    return res ? 1 : 0;
  }

  async delete(query: object): Promise<number> {
    const res = await this.conn.department.deleteMany({ where: query });
    return res.count;
  }

  async readByCompany(companyId: string): Promise<any[]> {
    return this.conn.department.findMany({ where: { companyId } });
  }
}