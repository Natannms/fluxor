import { Document } from "@/app/types/types";
import { IDocumentRepository, documentRepository } from "../repositories/DocumentRepository";

export interface IDocumentService {
  createDocument(data: Partial<Document>): Promise<Document>;
  getDocumentById(id: string): Promise<Document | null>;
  getAllDocuments(): Promise<Document[]>;
  updateDocument(id: string, data: Document): Promise<Document>;
  deleteDocument(id: string): Promise<void>;
}

export class DocumentService implements IDocumentService {
  constructor(private repository: IDocumentRepository = documentRepository) {}

  async createDocument(data: Partial<Document>) {
    return await this.repository.createDocument(data);
  }
  async getDocumentById(id: string) {
    return await this.repository.getDocumentById(id);
  }
  async getAllDocuments() {
    return await this.repository.getAllDocuments();
  }
  async updateDocument(id: string, data: Document) {
    return await this.repository.updateDocument(id, data);
  }
  async deleteDocument(id: string) {
    return await this.repository.deleteDocument(id);
  }
}

export const documentService = new DocumentService();