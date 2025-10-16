import { Prisma, Document as PrismaDocument } from "@prisma/client";
import { documentService } from "@/services/DocumentService";

export async function createDocument(data: Prisma.DocumentCreateInput): Promise<PrismaDocument> {
  return await documentService.createDocument(data);
}

export async function getDocumentById(id: string): Promise<PrismaDocument | null> {
  return await documentService.getDocumentById(id);
}

export async function getAllDocuments(): Promise<PrismaDocument[]> {
  return await documentService.getAllDocuments();
}

export async function updateDocument(id: string, data: Prisma.DocumentUpdateInput): Promise<PrismaDocument> {
  return await documentService.updateDocument(id, data);
}

export async function deleteDocument(id: string): Promise<void> {
  return await documentService.deleteDocument(id);
}