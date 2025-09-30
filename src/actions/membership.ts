'use server'

import { PrismaClient } from "@prisma/client";
import { MembershipPostgresAdapter } from "../adapters/postgres/MembershipAdapter";
import { MembershipRepository } from "../repositories/MembershipRepository";
import { Membership } from "../app/types/types";
import { MembershipService } from "@/services/MembershipService";

const prisma = new PrismaClient();
const adapter = new MembershipPostgresAdapter(prisma);
const repository = new MembershipRepository(adapter);
const service = new MembershipService(repository);

export async function createMembership(data: Partial<Membership>) {
    return service.createMembership(data);
}

export async function getMemberships(query: object = {}) {
    return service.getMemberships(query);
}

export async function updateMembership(membershipId: string, data: Partial<Membership>) {
    return service.updateMembership(membershipId, data);
}

export async function deleteMembership(query: object) {
    return service.deleteMembership(query);
}

export async function findCompanyByUserId(userId: string) {
  return await service.findCompanyByUserId(userId);
}