"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "valle_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

type MinimalUser = {
  id: string;
  name: string;
  email: string;
  membershipToCompanyId?: string;
  whatsappInstanceName?: string; // nome da instância do WhatsApp
};

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET não configurado. Defina no .env");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(user: MinimalUser) {
  const jwt = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setSubject(user.id) // garante que payload.sub contenha o id do usuário
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, jwt, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSessionUser(): Promise<MinimalUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const user = {
      id: String(payload.sub || payload.id || ""),
      name: String(payload.name || ""),
      email: String(payload.email || ""),
      membershipToCompanyId: String(payload.membershipToCompanyId || ""),
      whatsappInstanceName: String(payload.whatsappInstanceName || ""),
    };
    return user;
  } catch {
    await destroySession();
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function clearSession() {
  // Remove dados do usuário da sessionStorage/localStorage
  try {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    localStorage.removeItem("membershipToCompanyId");
    sessionStorage.removeItem("membershipToCompanyId");
    // Se usar cookies, pode adicionar aqui também
    // document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  } catch (err) {
    // Silenciosamente ignora erros
  }
}