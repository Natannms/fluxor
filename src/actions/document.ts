import { Document } from "@/app/types/types";
import { documentService } from "@/services/DocumentService";

export async function createDocument(data: Document) {
  return await documentService.createDocument(data);
}

export async function getDocumentById(id: string) {
  return await documentService.getDocumentById(id);
}

export async function getAllDocuments() {
  return await documentService.getAllDocuments();
}

export async function updateDocument(id: string, data: Document) {
  return await documentService.updateDocument(id, data);
}

export async function deleteDocument(id: string) {
  return await documentService.deleteDocument(id);
}