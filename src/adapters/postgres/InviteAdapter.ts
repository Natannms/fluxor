import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Invite } from "@/app/types/types";

type prismaType = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;

export class InvitePostgresAdapter {
    conn: prismaType;
    constructor(conn: prismaType) {
        this.conn = conn;
    }

    async create(data: Partial<Invite>): Promise<Invite> {
        return this.conn.invite.create({ data: data as any });
    }

    async read(query: object): Promise<Invite[]> {
        return this.conn.invite.findMany({ where: query });
    }

    async update(inviteId: string, updateData: Partial<Invite>): Promise<number> {
        const result = await this.conn.invite.update({
            where: { id: inviteId },
            data: updateData as any
        });
        return result ? 1 : 0;
    }

    async delete(query: object): Promise<number> {
        const result = await this.conn.invite.deleteMany({ where: query });
        return result.count;
    }

    async findByToken(token: string): Promise<Invite | null> {
        return this.conn.invite.findUnique({ where: { token } });
    }
}