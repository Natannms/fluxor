import { Document as PrismaDocument, Prisma } from "@prisma/client";
import { DocumentAdapter } from "../adapters/postgres/DocumentAdapter";

export interface IDocumentRepository {
  createDocument(data: Prisma.DocumentCreateInput): Promise<PrismaDocument>;
  getDocumentById(id: string): Promise<PrismaDocument | null>;
  getAllDocuments(): Promise<PrismaDocument[]>;
  updateDocument(id: string, data: Prisma.DocumentUpdateInput): Promise<PrismaDocument>;
  deleteDocument(id: string): Promise<void>;
}

export class DocumentRepository implements IDocumentRepository {
  constructor(private adapter = DocumentAdapter) {}

  async createDocument(data: Prisma.DocumentCreateInput) {
    return await this.adapter.create(data);
  }
  async getDocumentById(id: string) {
    return await this.adapter.findById(id);
  }
  async getAllDocuments() {
    return await this.adapter.findAll();
  }
  async updateDocument(id: string, data: Prisma.DocumentUpdateInput) {
    return await this.adapter.update(id, data);
  }
  async deleteDocument(id: string) {
    return await this.adapter.delete(id);
  }
}

export const documentRepository = new DocumentRepository();