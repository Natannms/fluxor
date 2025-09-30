import { Prisma, PrismaClient } from "@prisma/client";
import { CompanyAdapterInterface } from "../AdapterInterface";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Company } from "@/app/types/types";

type prismaType = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>

export class CompanyPostgresAdapter implements CompanyAdapterInterface { 
    conn: prismaType
    constructor(conn:prismaType) {
        this.conn = conn;
    }
   
    async create(data: Partial<Company>): Promise<Company> {
        return this.conn.company.create({ data: data as any });
    }

    async read(query: object): Promise<Company[]> {
        return this.conn.company.findMany({ where: query });
    }

    async update(companyId: string, updateData: Partial<Company>): Promise<number> {
        const result = await this.conn.company.update({
            where: { id: companyId },
            data: updateData as any
        });
        return result ? 1 : 0;
    }

    async delete(query: object): Promise<number> {
        const result = await this.conn.company.deleteMany({ where: query });
        return result.count;
    }
}