import { ProcessReview } from "@/app/types/types";
import { IProcessReviewRepository, processReviewRepository } from "../repositories/ProcessReviewRepository";

export interface IProcessReviewService {
  createProcessReview(data: Partial<ProcessReview>): Promise<ProcessReview>;
  getProcessReviewById(id: string): Promise<ProcessReview | null>;
  getAllProcessReviews(): Promise<ProcessReview[]>;
  updateProcessReview(id: string, data: Partial<ProcessReview>): Promise<ProcessReview>;
  deleteProcessReview(id: string): Promise<void>;
}

export class ProcessReviewService implements IProcessReviewService {
  constructor(private repository: IProcessReviewRepository = processReviewRepository) {}

  async createProcessReview(data: Partial<ProcessReview>) {
    return await this.repository.createProcessReview(data);
  }
  async getProcessReviewById(id: string) {
    return await this.repository.getProcessReviewById(id);
  }
  async getAllProcessReviews() {
    return await this.repository.getAllProcessReviews();
  }
  async updateProcessReview(id: string, data: Partial<ProcessReview>) {
    return await this.repository.updateProcessReview(id, data);
  }
  async deleteProcessReview(id: string) {
    return await this.repository.deleteProcessReview(id);
  }
}

export const processReviewService = new ProcessReviewService();