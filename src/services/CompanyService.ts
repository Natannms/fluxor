import { Company } from "@/app/types/types";
import { CompanyRepositoryIterface } from "../repositories/CompanyRepository";

export interface CompanyServiceInterface<T> {
    createCompany(data: Partial<T>): Promise<T>;
    getCompanies(query: object): Promise<T[]>;
    updateCompany(companyId: string, data: Partial<T>): Promise<number>;
    deleteCompany(query: object): Promise<number>;
}

export class CompanyService implements CompanyServiceInterface<Company> {
    private repository: CompanyRepositoryIterface;

    constructor(repository: CompanyRepositoryIterface) {
        this.repository = repository;
    }

    async createCompany(data: Partial<Company>): Promise<Company> {
        return this.repository.createCompany(data);
    }

    async getCompanies(query: object): Promise<Company[]> {
        return this.repository.getCompanies(query);
    }

    async updateCompany(companyId: string, data: Partial<Company>): Promise<number> {
        return this.repository.updateCompany(companyId, data);
    }

    async deleteCompany(query: object): Promise<number> {
        return this.repository.deleteCompany(query);
    }
}