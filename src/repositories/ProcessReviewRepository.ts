import { ProcessReview } from "@/app/types/types";
import { IProcessReviewAdapter } from "../adapters/AdapterInterface";
import { ProcessReviewAdapter } from "../adapters/postgres/ProcessReviewAdapter";

export interface IProcessReviewRepository {
  createProcessReview(data: Partial<ProcessReview>): Promise<ProcessReview>;
  getProcessReviewById(id: string): Promise<ProcessReview | null>;
  getAllProcessReviews(): Promise<ProcessReview[]>;
  updateProcessReview(id: string, data: Partial<ProcessReview>): Promise<ProcessReview>;
  deleteProcessReview(id: string): Promise<void>;
}

export class ProcessReviewRepository implements IProcessReviewRepository {
  constructor(private adapter: IProcessReviewAdapter = ProcessReviewAdapter) {}

  async createProcessReview(data: Partial<ProcessReview>) {
    return await this.adapter.create(data);
  }
  async getProcessReviewById(id: string) {
    return await this.adapter.findById(id);
  }
  async getAllProcessReviews() {
    return await this.adapter.findAll();
  }
  async updateProcessReview(id: string, data: Partial<ProcessReview>) {
    return await this.adapter.update(id, data);
  }
  async deleteProcessReview(id: string) {
    return await this.adapter.delete(id);
  }
}

export const processReviewRepository = new ProcessReviewRepository();