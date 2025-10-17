import { Membership } from "@/app/types/types";
import { IMembershipRepository } from "@/repositories/MembershipRepository";

export interface MembershipServiceInterface<T> {
    createMembership(data: Partial<T>): Promise<T>;
    getMemberships(query: object): Promise<T[]>;
    updateMembership(membershipId: string, data: Partial<T>): Promise<number>;
    deleteMembership(query: object): Promise<number>;
    findCompanyByUserId(userId: string): Promise<any>;

}

export class MembershipService implements MembershipServiceInterface<Membership> {
    private repository: IMembershipRepository;

    constructor(repository: IMembershipRepository) {
        this.repository = repository;
    }
    async findCompanyByUserId(userId: string) {
    return await this.repository.findCompanyByUserId(userId);
  }
    async createMembership(data: Partial<Membership>): Promise<Membership> {
        return this.repository.createMembership(data);
    }

    async getMemberships(query: object): Promise<Membership[]> {
        return this.repository.getMemberships(query);
    }

    async updateMembership(membershipId: string, data: Partial<Membership>): Promise<number> {
        return this.repository.updateMembership(membershipId, data);
    }

    async deleteMembership(query: object): Promise<number> {
        return this.repository.deleteMembership(query);
    }

    async getMembershipsByCompany(companyId: string): Promise<Membership[]> {
        return this.repository.getMembershipsByCompany(companyId);
    }
    async findMembershipByUserId(userId: string) {
        return await this.repository.findMembershipByUserId(userId);
    }
}