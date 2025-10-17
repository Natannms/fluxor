"use server";

import { AuthService } from "../services/AuthService";
import { AuthRepository } from "../repositories/AuthRepository";
import { AuthPostgresAdapter } from "../adapters/postgres/AuthPostgresAdapter";
import { AuthData, AuthRegisterData, AuthUser } from "../adapters/AuthInterface";
import { AuthDataSchema, AuthRegisterDataSchema } from "@/utils/zodSchemas";
import { createSession, destroySession } from "@/utils/session";
import { findCompanyByUserId } from "@/actions/membership";
import { getWhatsappInstances } from "@/actions/whatsapp";

const adapter = new AuthPostgresAdapter();
const repository = new AuthRepository(adapter);
const service = new AuthService(repository);

export type ActionResponse = {
  errors?: { field: string; message: string }[];
  data?: AuthData | AuthRegisterData;
};

export async function registerAction(data: any): Promise<ActionResponse> {
  const result = AuthRegisterDataSchema.safeParse(data);
  if (!result.success) {
    return {
      errors: result.error.issues.map(e => ({
        field: e.path[0] as string,
        message: e.message
      }))
    };
  }
  const response = await service.signUp(data);

  if ('errors' in response) {
    return {
      errors: response.errors.map((msg: string) => ({
        field: msg.toLowerCase().includes("email") ? "email" : "form",
        message: msg
      }))
    };
  }

  return { data: response as unknown as AuthRegisterData };
}

// Type guard para garantir que a resposta é um AuthUser
function isAuthUser(resp: unknown): resp is AuthUser {
  return !!resp && typeof resp === "object" && "id" in resp && "email" in resp && "name" in resp;
}

export async function loginAction(data: any): Promise<ActionResponse> {
  const parsed = AuthDataSchema.safeParse(data);
  if (!parsed.success) {
    return {
      errors: parsed.error.issues.map(e => ({
        field: e.path[0] as string,
        message: e.message,
      })),
    };
  }

  const response = await service.signIn(data);

  if ("errors" in response) {
    return {
      errors: response.errors.map((msg: string) => ({
        field: msg.toLowerCase().includes("email") ? "email" : "form",
        message: msg,
      })),
    };
  }

  if (isAuthUser(response)) {
    const company = await findCompanyByUserId(response.id);

    // busca a primeira instância de WhatsApp disponível
    let whatsappInstanceName = "";
    try {
      const instances = await getWhatsappInstances();
      whatsappInstanceName = instances[0]?.name || "";
    } catch {
      // se a API de WhatsApp falhar, segue sem o nome
      whatsappInstanceName = "";
    }

    const userSession = {
      id: response.id,
      name: response.name!,
      email: response.email,
      membershipToCompanyId: company?.id || "",
      whatsappInstanceName,
    };

    await createSession(userSession);
    return { data: response as any };
  }

  return {
    errors: [{ field: "form", message: "Não foi possível autenticar. Tente novamente." }],
  };
}

export async function signOutAction() {
  await destroySession();
  return { success: true };
}