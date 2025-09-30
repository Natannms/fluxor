import { Invite } from "@/app/types/types";
import { InviteRepositoryInterface } from "../repositories/InviteRepository";

export interface InviteServiceInterface<T> {
    createInvite(data: Partial<T>): Promise<T>;
    getInvites(query: object): Promise<T[]>;
    updateInvite(inviteId: string, data: Partial<T>): Promise<number>;
    deleteInvite(query: object): Promise<number>;
    findInviteByToken(token: string): Promise<Invite | null>;
}

export class InviteService implements InviteServiceInterface<Invite> {
    private repository: InviteRepositoryInterface;
    
    constructor(repository: InviteRepositoryInterface) {
        this.repository = repository;
    }
    async findInviteByToken(token: string): Promise<Invite | null> {
        return this.repository.findInviteByToken(token);
    }

    async createInvite(data: Partial<Invite>): Promise<Invite> {
        return this.repository.createInvite(data);
    }

    async getInvites(query: object): Promise<Invite[]> {
        return this.repository.getInvites(query);
    }

    async updateInvite(inviteId: string, data: Partial<Invite>): Promise<number> {
        return this.repository.updateInvite(inviteId, data);
    }

    async deleteInvite(query: object): Promise<number> {
        return this.repository.deleteInvite(query);
    }
}