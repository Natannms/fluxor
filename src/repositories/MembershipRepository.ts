import { Membership } from "@/app/types/types";
import { MembershipAdapterInterface } from "../adapters/AdapterInterface";

export interface IMembershipRepository {
    createMembership(data: Partial<Membership>): Promise<Membership>;
    getMemberships(query: object): Promise<Membership[]>;
    updateMembership(membershipId: string, updateData: Partial<Membership>): Promise<number>;
    deleteMembership(query: object): Promise<number>;
    findCompanyByUserId(userId: string): Promise<any>;
    getMembershipsByCompany(companyId: string): Promise<Membership[]>;
    findMembershipByUserId(userId: string): Promise<Membership | null>;
}

export class MembershipRepository implements IMembershipRepository {
    private adapter: MembershipAdapterInterface;

    constructor(adapter: MembershipAdapterInterface) {
        this.adapter = adapter;
    }

    async createMembership(data: Partial<Membership>): Promise<Membership> {
        return this.adapter.create(data);
    }

    async getMemberships(query: object): Promise<Membership[]> {
        return this.adapter.read(query);
    }

    async updateMembership(membershipId: string, updateData: Partial<Membership>): Promise<number> {
        return this.adapter.update(membershipId, updateData);
    }

    async deleteMembership(query: object): Promise<number> {
        return this.adapter.delete(query);
    }

    async findCompanyByUserId(userId: string) {
        return await this.adapter.findCompanyByUserId(userId);
    }

    async getMembershipsByCompany(companyId: string): Promise<Membership[]> {
        return this.adapter.readByCompanyWithRelations(companyId);
    }

    async findMembershipByUserId(userId: string): Promise<Membership | null> {
        return this.adapter.findByUserIdWithRelations(userId);
    }
}