import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import prisma from "../../../prisma/prismaClient";
import { WhatsappPermissionAdapterInterface } from "../AdapterInterface";

type prismaType = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;

export class WhatsappPermissionPostgresAdapter implements WhatsappPermissionAdapterInterface {
  conn: prismaType;
  constructor(conn: prismaType) {
    this.conn = conn;
  }

  async create(data: Partial<any>): Promise<any> {
    return this.conn.whatsappInstancePermission.create({ data: data as any });
  }

  async read(query: object): Promise<any[]> {
    return this.conn.whatsappInstancePermission.findMany({
      where: query as any,
      include: { company: true, membership: { include: { user: true } }, department: true },
    });
  }

  async deleteById(id: string): Promise<number> {
    const res = await this.conn.whatsappInstancePermission.delete({ where: { id } });
    return res ? 1 : 0;
  }

  async readByInstanceAndCompany(instanceId: string, companyId: string): Promise<any[]> {
    return this.conn.whatsappInstancePermission.findMany({
      where: { instanceId, companyId },
      include: { company: true, membership: { include: { user: true } }, department: true },
    });
  }
}