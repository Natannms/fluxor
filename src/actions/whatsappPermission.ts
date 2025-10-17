'use server'

import { PrismaClient } from "@prisma/client";
import { WhatsappPermissionPostgresAdapter } from "@/adapters/postgres/WhatsappPermissionAdapter";
import { WhatsappPermissionRepository } from "@/repositories/WhatsappPermissionRepository";
import { WhatsappPermissionService } from "@/services/WhatsappPermissionService";

const prisma = new PrismaClient();
const adapter = new WhatsappPermissionPostgresAdapter(prisma);
const repository = new WhatsappPermissionRepository(adapter);
const service = new WhatsappPermissionService(repository);

export async function createWhatsappPermission(data: Partial<any>) {
  return service.createPermission(data);
}

export async function getWhatsappPermissionsByInstanceAndCompany(instanceId: string, companyId: string) {
  return service.getPermissionsByInstanceAndCompany(instanceId, companyId);
}

export async function deleteWhatsappPermission(id: string) {
  return service.deletePermission(id);
}

export async function getWhatsappPermissionsByMembership(membershipId: string) {
  return service.getPermissionsByMembership(membershipId);
}

export async function getWhatsappPermissionsByCompany(companyId: string) {
  return service.getPermissionsByCompany(companyId);
}