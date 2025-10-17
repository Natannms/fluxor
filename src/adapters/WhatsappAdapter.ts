import { WhatsappInstance, WhatsappInstanceEnvelope, WhatsappMessagesPage } from "@/app/types/types";
import { WhatsappContact } from "@/app/types/types";

export interface WhatsappAdapterInterface {
  getInstances(): Promise<WhatsappInstance[]>;
  getContacts(instanceSlug: string): Promise<WhatsappContact[]>; // exigido por parâmetro
  getMessagesByRemoteJid(
    instanceSlug: string,
    remoteJid: string,
    limit?: number,
    page?: number
  ): Promise<WhatsappMessagesPage>;
}

export class WhatsappAdapter implements WhatsappAdapterInterface {
  constructor(private apiKey: string = process.env.EVOLUTION_API_KEY || "") {
    if (!this.apiKey) {
      throw new Error("EVOLUTION_API_KEY não configurada. Defina em .env");
    }
  }

  async getInstances(): Promise<WhatsappInstance[]> {
    const url = "https://api.ghrokapi.xyz/instance/fetchInstances";
    const options: RequestInit = {
      method: "GET",
      headers: { apikey: this.apiKey },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Failed (${response.status}): ${body}`);
      }
      const data = await response.json();
      return data as WhatsappInstance[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getContacts(instanceSlug: string): Promise<WhatsappContact[]> {
    if (!instanceSlug) {
      throw new Error("instanceSlug é obrigatório para buscar contatos");
    }
    const url = `https://api.ghrokapi.xyz/chat/findContacts/${encodeURIComponent(instanceSlug)}`;
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: this.apiKey,
      },
      body: JSON.stringify({}),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Failed (${response.status}): ${body}`);
      }
      const data = await response.json();

      return data as WhatsappContact[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getMessagesByRemoteJid(
    instanceSlug: string,
    remoteJid: string,
    limit: number = 50,
    page: number = 1
  ): Promise<WhatsappMessagesPage> {
    if (!this.apiKey) {
      throw new Error("EVOLUTION_API_KEY não configurado");
    }
    if (!instanceSlug) {
      throw new Error("instanceSlug é obrigatório");
    }
    if (!remoteJid) {
      throw new Error("remoteJid é obrigatório");
    }

    const url = `https://api.ghrokapi.xyz/chat/findMessages/${encodeURIComponent(instanceSlug)}`;
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: this.apiKey,
      },
      body: JSON.stringify({
        where: {
          key: {
            remoteJid, // formato correto segundo a doc
          },
        },
        limit,
        page,
      }),
    };

    const res = await fetch(url, options);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Failed (${res.status}): ${body}`);
    }
    const json = (await res.json()) as WhatsappMessagesPage;
    return json;
  }
}

export const whatsappAdapter = new WhatsappAdapter();