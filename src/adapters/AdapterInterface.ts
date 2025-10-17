import { Company } from "@/app/types/types";
import { Membership } from "@/app/types/types";

// Interface genérica para adaptadores de banco de dados
export interface AdapterInterface {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    create<T>(collection: string, data: T): Promise<T>;
    read<T>(collection: string, query: object): Promise<T[]>;
    update<T>(collection: string, query: object, data: Partial<T>): Promise<number>;
    delete<T>(collection: string, query: object): Promise<number>;
}

// Interface específica para Company
export interface CompanyAdapterInterface {
    create(data: Partial<Company>): Promise<Company>;
    read(query: object): Promise<Company[]>;
    update(companyId: string, updateData: Partial<Company>): Promise<number>;
    delete(query: object): Promise<number>;
}

// Interface específica para Membership
export interface MembershipAdapterInterface {
    create(data: Partial<Membership>): Promise<Membership>;
    read(query: object): Promise<Membership[]>;
    update(membershipId: string, updateData: Partial<Membership>): Promise<number>;
    delete(query: object): Promise<number>;
    findCompanyByUserId(userId: string): Promise<Company | null>;
    readByCompanyWithRelations(companyId: string): Promise<Membership[]>;
    findByUserIdWithRelations(userId: string): Promise<Membership | null>;
}

// Interface específica para Department
export interface DepartmentAdapterInterface {
  create(data: Partial<any>): Promise<any>;
  read(query: object): Promise<any[]>;
  update(departmentId: string, data: Partial<any>): Promise<number>;
  delete(query: object): Promise<number>;
  readByCompany(companyId: string): Promise<any[]>;
}

// novo: interface para adapter de permissões de WhatsApp
export interface WhatsappPermissionAdapterInterface {
  create(data: Partial<any>): Promise<any>;
  read(query: object): Promise<any[]>;
  deleteById(id: string): Promise<number>;
  readByInstanceAndCompany(instanceId: string, companyId: string): Promise<any[]>;
}

export interface IProjectAdapter {
  create(data: any): Promise<any>;
  findById(id: string): Promise<any>;
  findAll(): Promise<any[]>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<void>;
}