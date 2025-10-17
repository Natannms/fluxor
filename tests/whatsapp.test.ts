import { beforeEach, afterEach, describe, it, expect, jest } from "@jest/globals";
import { whatsappService } from "../src/services/WhatsappService";
import { WhatsappInstanceEnvelope, WhatsappContact } from "../src/app/types/types";

const sampleInstances: WhatsappInstanceEnvelope[] = [
  {
    instance: {
      name: "example-name",
      instanceId: "421a4121-a3d9-40cc-a8db-c3a1df353126",
      owner: "553198296801@s.whatsapp.net",
      profileName: "Guilherme Gomes",
      profilePictureUrl: null,
      profileStatus: "This is the profile status.",
      status: "open",
      serverUrl: "https://example.evolution-api.com",
      apikey: "B3844804-481D-47A4-B69C-F14B4206EB56",
      integration: {
        integration: "WHATSAPP-BAILEYS",
        webhook_wa_business: "https://example.evolution-api.com/webhook/whatsapp/db5e11d3-ded5-4d91-b3fb-48272688f206",
      },
    },
  },
  {
    instance: {
      name: "teste-docs",
      instanceId: "af6c5b7c-ee27-4f94-9ea8-192393746ddd",
      status: "close",
      serverUrl: "https://example.evolution-api.com",
      apikey: "123456",
      integration: {
        token: "123456",
        webhook_wa_business: "https://example.evolution-api.com/webhook/whatsapp/teste-docs",
      },
    },
  },
];

const sampleContacts: WhatsappContact[] = [
  {
    id: "cmfm9a8um018cta4ku9o1calg",
    remoteJid: "553198954605@s.whatsapp.net",
    pushName: "Henrique",
    profilePicUrl: null,
    createdAt: "2025-09-16T07:53:15.593Z",
    updatedAt: "2025-09-16T07:53:17.535Z",
    instanceId: "bdf52371-6883-4243-8587-79ffa54ab0f9",
    isGroup: false,
    isSaved: true,
    type: "contact",
  },
];

const ORIGINAL_FETCH = global.fetch;

beforeEach(() => {
    const slug = "Ghork";
    const remoteJid = "5512981345720@s.whatsapp.net";
    (global as any).fetch = jest.fn();
    process.env.EVOLUTION_API_KEY = "test-key";
  jest.resetAllMocks();
});

afterEach(() => {
    jest.resetAllMocks();
  global.fetch = ORIGINAL_FETCH as any;
});

describe("WhatsappService.getInstances", () => {
  it("retorna a lista de instâncias com sucesso", async () => {
    global.fetch = (jest.fn() as any).mockResolvedValue({
      ok: true,
      json: async () => sampleInstances,
    } as any);

    const result = await whatsappService.getInstances();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe("example-name");
    expect(result[1].status).toBe("close");
  });

  it("envia método GET e cabeçalho apikey", async () => {
    const fetchMock = jest.fn(async (...args: any[]) => {
      const [url, options] = args as [string, any];
      expect(url).toBe("https://api.ghrokapi.xyz/instance/fetchInstances");
      expect(options.method).toBe("GET");
      expect(options.headers).toBeDefined();
      expect(options.headers.apikey).toBeDefined();
      return { ok: true, json: async () => sampleInstances } as any;
    }) as any;

    global.fetch = fetchMock;

    const result = await whatsappService.getInstances();
    expect(result.length).toBe(2);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("lança erro quando API retorna status não-ok (ex: 401)", async () => {
    global.fetch = (jest.fn() as any).mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    } as any);

    await expect(whatsappService.getInstances()).rejects.toThrow(/Failed \(401\): Unauthorized/);
  });

  it("lança erro em falha de rede", async () => {
    global.fetch = (jest.fn() as any).mockRejectedValue(new Error("Network error"));
    await expect(whatsappService.getInstances()).rejects.toThrow("Network error");
  });

  it("calls Evolution API with correct URL, headers and body", async () => {
    const sample = {
      messages: {
        total: 1,
        pages: 1,
        currentPage: 1,
        records: [
          {
            id: "cmgk0dvqq000pp44krvztx1af",
            key: {
              id: "AC36111AC1F792ADE0AC95BCF6F9F83F",
              fromMe: false,
              senderLid: "163354870079698@lid",
            },
            pushName: "Natan",
            messageType: "conversation",
            message: { conversation: "Boa noite", messageContextInfo: {} },
            messageTimestamp: 1760050098,
            instanceId: "bdf52371-6883-4243-8587-79ffa54ab0f9",
            source: "android",
            contextInfo: null,
            MessageUpdate: [],
          },
        ],
      },
    };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => sample,
    });

    const res = await whatsappService.getMessagesByRemoteJid('Ghork', '5512981345720@s.whatsapp.net', 50, 1);
    expect((global.fetch as any).mock.calls[0][0]).toBe(
      `https://api.ghrokapi.xyz/chat/findMessages/${encodeURIComponent('Ghork')}`
    );
    const options = (global.fetch as any).mock.calls[0][1];
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(options.headers.apikey).toBe("test-key");
    const body = JSON.parse(options.body);
    expect(body.where.remoteJid).toBe('5512981345720@s.whatsapp.net');
    expect(body.limit).toBe(50);
    expect(body.page).toBe(1);
    expect(res.messages.records.length).toBe(1);
  });

  it("throws on non-OK response", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "Server error",
    });
    await expect(
      whatsappService.getMessagesByRemoteJid('Ghork', '5512981345720@s.whatsapp.net')
    ).rejects.toThrow(/Failed \(500\): Server error/);
  });

  it("throws when required params are missing", async () => {
    await expect(
      // @ts-expect-error testing runtime validation
      whatsappService.getMessagesByRemoteJid("", remoteJid)
    ).rejects.toThrow(/obrigatório/);
    await expect(
      whatsappService.getMessagesByRemoteJid('Ghork', "")
    ).rejects.toThrow(/obrigatório/);
  });
});

describe("WhatsappService.getContacts", () => {
  it("retorna contatos com sucesso", async () => {
    global.fetch = (jest.fn() as any).mockResolvedValue({
      ok: true,
      json: async () => sampleContacts,
    } as any);

    const result = await whatsappService.getContacts('Ghork');
    expect(result).toEqual(sampleContacts);
  });

  it("envia POST com headers corretos e corpo {}", async () => {
    const fetchMock = jest.fn(async (...args: any[]) => {
      const [url, options] = args as [string, any];
      expect(url).toContain("/chat/findContacts/Ghork");
      expect(options.method).toBe("POST");
      expect(options.headers["apikey"]).toBeDefined();
      expect(options.headers["Content-Type"]).toBe("application/json");
      expect(options.body).toBe(JSON.stringify({}));
      return { ok: true, json: async () => sampleContacts } as any;
    }) as any;

    global.fetch = fetchMock;

    const result = await whatsappService.getContacts('Ghork');
    expect(result).toEqual(sampleContacts);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("lança erro em resposta não-ok", async () => {
    global.fetch = (jest.fn() as any).mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    } as any);

    await expect(whatsappService.getContacts('Ghork')).rejects.toThrow(/Failed \(401\)/);
  });

  it("lança erro em falha de rede", async () => {
    global.fetch = (jest.fn() as any).mockRejectedValue(new Error("Network error"));
    await expect(whatsappService.getContacts('Ghork')).rejects.toThrow("Network error");
  });
});