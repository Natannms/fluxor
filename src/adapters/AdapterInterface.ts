import { Company, Process, Membership, ProcessStep, ProcessKPI, ProcessRule, ProcessReview } from "@/app/types/types";


// Interface genérica para adaptadores de banco de dados
export interface AdapterInterface {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    create<T>(collection: string, data: T): Promise<T>;
    read<T>(collection: string, query: object): Promise<T[]>;
    update<T>(collection: string, query: object, data: Partial<T>): Promise<number>;
    delete<T>(collection: string, query: object): Promise<number>;
}

export interface CompanyAdapterInterface {
    create(data: Partial<Company>): Promise<Company>;
    read(query: object): Promise<Company[]>;
    update(companyId: string, updateData: Partial<Company>): Promise<number>;
    delete(query: object): Promise<number>;
}

export interface MembershipAdapterInterface {
    create(data: Partial<Membership>): Promise<Membership>;
    read(query: object): Promise<Membership[]>;
    update(membershipId: string, updateData: Partial<Membership>): Promise<number>;
    delete(query: object): Promise<number>;
    findCompanyByUserId(userId: string): Promise<Company | null>;
}

export interface IProcessAdapter {
  create(data: Partial<Process>): Promise<Process>;
  findById(id: string): Promise<Process>;
  findAll(): Promise<Process[]>;
  update(id: string, data: Partial<Process>): Promise<Process>;
  delete(id: string): Promise<void>;
}

export interface IProcessStepAdapter {
  create(data: Partial<ProcessStep>): Promise<ProcessStep>;
  findById(id: string): Promise<ProcessStep | null>;
  findAll(): Promise<ProcessStep[]>;
  update(id: string, data: Partial<ProcessStep>): Promise<ProcessStep>;
  delete(id: string): Promise<void>;
}

export interface IProcessKPIAdapter {
  create(data: any): Promise<ProcessKPI>;
  findById(id: string): Promise<ProcessKPI | null>;
  findAll(): Promise<ProcessKPI[]>;
  update(id: string, data: Partial<ProcessKPI>): Promise<ProcessKPI>;
  delete(id: string): Promise<void>;
}

export interface IProcessRuleAdapter {
  create(data: Partial<ProcessRule>): Promise<ProcessRule>;
  findById(id: string): Promise<ProcessRule | null>;
  findAll(): Promise<ProcessRule[]>;
  update(id: string, data: Partial<ProcessRule>): Promise<ProcessRule>;
  delete(id: string): Promise<void>;
}

export interface IProcessReviewAdapter {
  create(data: any): Promise<ProcessReview>;
  findById(id: string): Promise<ProcessReview | null>;
  findAll(): Promise<ProcessReview[]>;
  update(id: string, data: Partial<ProcessReview>): Promise<ProcessReview>;
  delete(id: string): Promise<void>;
}

