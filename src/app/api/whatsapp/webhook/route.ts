import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ status: "ok" });
}

export type WhatsappWebhookPayload = {
  event: "messages.upsert" | string;
  instance: string;
  data: {
    key: {
      remoteJid: string;
      fromMe: boolean;
      id: string;
      senderLid?: string;
    };
    pushName?: string;
    status?: "DELIVERY_ACK" | string;
    message?: {
      conversation?: string;
      messageContextInfo?: unknown;
      [k: string]: unknown;
    };
    messageType?: "conversation" | string;
    messageTimestamp?: number;
    instanceId?: string;
    source?: "android" | "ios" | "web" | string;
    [k: string]: unknown;
  };
  destination?: string;
  date_time?: string;
  sender?: string;
  server_url?: string;
  apikey?: string;
  [k: string]: unknown;
};

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as WhatsappWebhookPayload;
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
}