'use server';

import { whatsappAdapter } from "../adapters/WhatsappAdapter";
import { WhatsappRepository } from "../repositories/WhatsappRepository";
import { WhatsappService } from "../services/WhatsappService";
import { WhatsappInstanceEnvelope, WhatsappContact, WhatsappInstance, WhatsappMessagesPage } from "../app/types/types";

const repository = new WhatsappRepository(whatsappAdapter);
const service = new WhatsappService(repository);

export async function getWhatsappInstances(): Promise<WhatsappInstance[]> {
  return service.getInstances();
}

export async function getWhatsappContactsByInstance(instanceSlug: string): Promise<WhatsappContact[]> {
  return service.getContacts(instanceSlug);
}

export type WhatsappInstancesFilter = {
  id?: string;
  onlyFirst?: boolean;
};

export async function filterWhatsappInstances(
  filter: WhatsappInstancesFilter = {}
): Promise<WhatsappInstanceEnvelope[]> {
  // prepara o filter
  const normalizedId = filter.id?.trim();
  const onlyFirst = !!filter.onlyFirst;

  // lê todas as instâncias
  const instances = await service.getInstances();

  // prepara a condição com base no filter
  const subset = normalizedId
    ? instances.filter((e) => e.instanceId === normalizedId)
    : instances;

  // filtra e retorna filtrado
  return onlyFirst
    ? subset.slice(0, 1).map((instance) => ({ instance }))
    : subset.map((instance) => ({ instance }));
}

// NOVO: buscar mensagens de um remoteJid com paginação
export async function getWhatsappMessagesByRemoteJid(
  instanceSlug: string,
  remoteJid: string,
  limit?: number,
  page?: number
): Promise<WhatsappMessagesPage> {
  return service.getMessagesByRemoteJid(instanceSlug, remoteJid, limit, page);
}