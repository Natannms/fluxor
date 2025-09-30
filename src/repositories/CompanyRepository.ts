import { Company } from "@/app/types/types";
import { CompanyAdapterInterface } from "../adapters/AdapterInterface";


export interface CompanyRepositoryIterface {
    createCompany(data: Partial<Company>): Promise<Company>;
    getCompanies(query: object): Promise<Company[]>;
    updateCompany(companyId: string, updateData: Partial<Company>): Promise<number>;
    deleteCompany(query: object): Promise<number>;
}

export class CompanyRepository {
    private adapter: CompanyAdapterInterface;

    constructor(adapter: CompanyAdapterInterface) {
        this.adapter = adapter;
    }

    async createCompany(data: Partial<Company>): Promise<Company> {
        return this.adapter.create(data);
    }

    async getCompanies(query: object): Promise<Company[]> {
        return this.adapter.read(query);
    }

    async updateCompany(companyId: string, updateData: Partial<Company>): Promise<number> {
        return this.adapter.update(companyId, updateData);
    }

    async deleteCompany(query: object): Promise<number> {
        return this.adapter.delete(query);
    }
}