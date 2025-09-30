import { Prisma, PrismaClient } from "@prisma/client";
import { MembershipAdapterInterface } from "../AdapterInterface";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Membership } from "@/app/types/types";
import prisma from "../../../prisma/prismaClient";

type prismaType = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;

export class MembershipPostgresAdapter implements MembershipAdapterInterface {
    conn: prismaType;
    constructor(conn: prismaType) {
        this.conn = conn;
    }

    async create(data: Partial<Membership>): Promise<Membership> {
        return this.conn.membership.create({ data: data as any });
    }

    async read(query: object): Promise<Membership[]> {
        return this.conn.membership.findMany({ where: query });
    }

    async update(membershipId: string, updateData: Partial<Membership>): Promise<number> {
        const result = await this.conn.membership.update({
            where: { id: membershipId },
            data: updateData as any
        });
        return result ? 1 : 0;
    }

    async delete(query: object): Promise<number> {
        const result = await this.conn.membership.deleteMany({ where: query });
        return result.count;
    }

    async findCompanyByUserId(userId: string) {
        const membership = await prisma.membership.findFirst({
            where: { userId },
            include: { company: true },
        });
        return membership?.company || null;
    }
}