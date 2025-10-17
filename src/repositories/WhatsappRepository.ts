import { WhatsappAdapterInterface, whatsappAdapter } from "../adapters/WhatsappAdapter";
import { WhatsappInstance, WhatsappInstanceEnvelope, WhatsappMessagesPage } from "@/app/types/types";
import { WhatsappContact } from "@/app/types/types";

export interface WhatsappRepositoryInterface {
  getInstances(): Promise<WhatsappInstance[]>;
  getContacts(instanceSlug: string): Promise<WhatsappContact[]>; // recebe parâmetro
  getMessagesByRemoteJid(
    instanceSlug: string,
    remoteJid: string,
    limit?: number,
    page?: number
  ): Promise<WhatsappMessagesPage>;
}

export class WhatsappRepository implements WhatsappRepositoryInterface {
  private adapter: WhatsappAdapterInterface;

  constructor(adapter: WhatsappAdapterInterface) {
    this.adapter = adapter;
  }

  async getInstances(): Promise<WhatsappInstance[]> {
    return this.adapter.getInstances();
  }
  async getMessagesByRemoteJid(
    instanceSlug: string,
    remoteJid: string,
    limit?: number,
    page?: number
  ): Promise<WhatsappMessagesPage> {
    return this.adapter.getMessagesByRemoteJid(instanceSlug, remoteJid, limit, page);
  }
  async getContacts(instanceSlug: string): Promise<WhatsappContact[]> {
    const list = this.adapter.getContacts(instanceSlug)

    return list;
  }
}

export const whatsappRepository = new WhatsappRepository(whatsappAdapter);