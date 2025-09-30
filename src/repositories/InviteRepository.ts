import { Invite } from "@/app/types/types";

export interface InviteRepositoryInterface {
    createInvite(data: Partial<Invite>): Promise<Invite>;
    getInvites(query: object): Promise<Invite[]>;
    updateInvite(inviteId: string, updateData: Partial<Invite>): Promise<number>;
    deleteInvite(query: object): Promise<number>;
    findInviteByToken(token: string): Promise<Invite | null>
}

export class InviteRepository implements InviteRepositoryInterface {
    private adapter: any;
    
    constructor(adapter: any) {
        this.adapter = adapter;
    }
    async findInviteByToken(token: string): Promise<Invite | null> {
        return this.adapter.findByToken(token);
    }

    async createInvite(data: Partial<Invite>): Promise<Invite> {
        return this.adapter.create(data);
    }

    async getInvites(query: object): Promise<Invite[]> {
        return this.adapter.read(query);
    }

    async updateInvite(inviteId: string, updateData: Partial<Invite>): Promise<number> {
        return this.adapter.update(inviteId, updateData);
    }

    async deleteInvite(query: object): Promise<number> {
        return this.adapter.delete(query);
    }
}