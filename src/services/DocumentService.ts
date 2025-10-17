import { Prisma, Document as PrismaDocument } from "@prisma/client";
import { IDocumentRepository, documentRepository } from "../repositories/DocumentRepository";

export interface IDocumentService {
  createDocument(data: Prisma.DocumentCreateInput): Promise<PrismaDocument>;
  getDocumentById(id: string): Promise<PrismaDocument | null>;
  getAllDocuments(): Promise<PrismaDocument[]>;
  updateDocument(id: string, data: Prisma.DocumentUpdateInput): Promise<PrismaDocument>;
  deleteDocument(id: string): Promise<void>;
}

export class DocumentService implements IDocumentService {
  constructor(private repository: IDocumentRepository = documentRepository) {}

  async createDocument(data: Prisma.DocumentCreateInput) {
    return await this.repository.createDocument(data);
  }
  async getDocumentById(id: string) {
    return await this.repository.getDocumentById(id);
  }
  async getAllDocuments() {
    return await this.repository.getAllDocuments();
  }
  async updateDocument(id: string, data: Prisma.DocumentUpdateInput) {
    return await this.repository.updateDocument(id, data);
  }
  async deleteDocument(id: string) {
    return await this.repository.deleteDocument(id);
  }
}

export const documentService = new DocumentService();