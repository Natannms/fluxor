'use server'
import { PrismaClient } from "@prisma/client";
import { CompanyPostgresAdapter } from "../adapters/postgres/CompanyAdapter";
import { CompanyRepository } from "../repositories/CompanyRepository";
import { CompanyService } from "../services/CompanyService";
import { Company } from "../app/types/types";

const prisma = new PrismaClient();
const adapter = new CompanyPostgresAdapter(prisma);
const repository = new CompanyRepository(adapter);
const service = new CompanyService(repository);

export async function createCompany(data: Partial<Company>) {
    return service.createCompany(data);
}

export async function getCompanies(query: object = {}) {
    return service.getCompanies(query);
}

export async function updateCompany(companyId: string, data: Partial<Company>) {
    return service.updateCompany(companyId, data);
}

export async function deleteCompany(query: object) {
    return service.deleteCompany(query);
}