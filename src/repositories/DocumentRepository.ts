import { Document } from "@/app/types/types";
import { DocumentAdapter } from "../adapters/postgres/DocumentAdapter";

export interface IDocumentRepository {
  createDocument(data: Partial<Document>): Promise<Document>;
  getDocumentById(id: string): Promise<Document | null>;
  getAllDocuments(): Promise<Document[]>;
  updateDocument(id: string, data: Document): Promise<Document>;
  deleteDocument(id: string): Promise<void>;
}

export class DocumentRepository implements IDocumentRepository {
  constructor(private adapter = DocumentAdapter) {}

  async createDocument(data: Partial<Document>) {
    return await this.adapter.create(data);
  }
  async getDocumentById(id: string) {
    return await this.adapter.findById(id);
  }
  async getAllDocuments() {
    return await this.adapter.findAll();
  }
  async updateDocument(id: string, data: Document) {
    return await this.adapter.update(id, data);
  }
  async deleteDocument(id: string) {
    return await this.adapter.delete(id);
  }
}

export const documentRepository = new DocumentRepository();