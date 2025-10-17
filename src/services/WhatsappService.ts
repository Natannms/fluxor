import { WhatsappRepositoryInterface, whatsappRepository } from "../repositories/WhatsappRepository";
import { WhatsappInstance, WhatsappInstanceEnvelope, WhatsappMessagesPage } from "../app/types/types";
import { WhatsappContact } from "../app/types/types";

export interface WhatsappServiceInterface {
  getInstances(): Promise<WhatsappInstance[]>;
  getContacts(instanceSlug: string): Promise<WhatsappContact[]>; // recebe parâmetro
  getMessagesByRemoteJid(
    instanceSlug: string,
    remoteJid: string,
    limit?: number,
    page?: number
  ): Promise<WhatsappMessagesPage>;
}

export class WhatsappService implements WhatsappServiceInterface {
  constructor(private repository: WhatsappRepositoryInterface = whatsappRepository) { }

  async getInstances(): Promise<WhatsappInstance[]> {
    return this.repository.getInstances();
  }
  async getMessagesByRemoteJid(
    instanceSlug: string,
    remoteJid: string,
    limit?: number,
    page?: number
  ): Promise<WhatsappMessagesPage> {
    return this.repository.getMessagesByRemoteJid(instanceSlug, remoteJid, limit, page);
  }
  async getContacts(instanceSlug: string): Promise<WhatsappContact[]> {
    return this.repository.getContacts(instanceSlug);
  }
}

export const whatsappService = new WhatsappService();