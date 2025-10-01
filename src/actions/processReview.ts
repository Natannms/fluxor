import { ProcessReview } from "@/app/types/types";
import { processReviewService } from "@/services/ProcessReviewService";

export async function createProcessReview(data: Partial<ProcessReview>) {
  return await processReviewService.createProcessReview(data);
}

export async function getProcessReviewById(id: string) {
  return await processReviewService.getProcessReviewById(id);
}

export async function getAllProcessReviews() {
  return await processReviewService.getAllProcessReviews();
}

export async function updateProcessReview(id: string, data: Partial<ProcessReview>) {
  return await processReviewService.updateProcessReview(id, data);
}

export async function deleteProcessReview(id: string) {
  return await processReviewService.deleteProcessReview(id);
}