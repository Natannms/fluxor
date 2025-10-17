'use server'

import { PrismaClient } from "@prisma/client";
import { DepartmentPostgresAdapter } from "@/adapters/postgres/DepartmentAdapter";
import { DepartmentRepository } from "@/repositories/DepartmentRepository";
import { DepartmentService } from "@/services/DepartmentService";

const prisma = new PrismaClient();
const adapter = new DepartmentPostgresAdapter(prisma);
const repository = new DepartmentRepository(adapter);
const service = new DepartmentService(repository);

export async function createDepartment(data: Partial<any>) {
  return service.createDepartment(data);
}

export async function getDepartmentsByCompany(companyId: string) {
  return service.getDepartmentsByCompany(companyId);
}