'use server'

import { PrismaClient } from "@prisma/client";
import { InvitePostgresAdapter } from "../adapters/postgres/InviteAdapter";
import { InviteRepository } from "../repositories/InviteRepository";
import { InviteService } from "../services/InviteService";
import { Invite } from "../app/types/types";

const prisma = new PrismaClient();
const adapter = new InvitePostgresAdapter(prisma);
const repository = new InviteRepository(adapter);
const service = new InviteService(repository);

export async function createInvite(data: Partial<Invite>) {
    return service.createInvite(data);
}

export async function getInvites(query: object = {}) {
    return service.getInvites(query);
}

export async function updateInvite(inviteId: string, data: Partial<Invite>) {
    return service.updateInvite(inviteId, data);
}

export async function deleteInvite(query: object) {
    return service.deleteInvite(query);
}

export async function findInviteByToken(token: string) {
    return service.findInviteByToken(token);
}