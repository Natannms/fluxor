// WhatsappClient component
'use client';

import { useMemo, useState, useEffect, useRef } from "react";
import { getWhatsappMessagesByRemoteJid, getWhatsappContactsByInstance } from "@/actions/whatsapp";
import { useWhatsappContactsStore } from "@/store/whatsappContactsStore";
import { getSessionUser } from "@/utils/session";

type Contact = { id: string; name: string; remoteJid: string };
// NEW: message type used by messages state and UI
type Message = {
  id: string;
  contactId: string;
  sender: "me" | "them";
  text: string;
  timestamp: number;
};

// Adicionado: função utilitária para formatar horário
function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  const now = new Date();
  const isSameDay = d.toDateString() === now.toDateString();
  if (isSameDay) return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const datePart = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const timePart = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${datePart} ${timePart}`;
}

// Extrai o texto considerando diferentes formatos do Evolution API
function extractRecordText(r: any): string {
  const msg = r?.message || {};
  if (typeof msg?.conversation === "string") return msg.conversation;
  const ext = msg?.extendedTextMessage?.text;
  if (typeof ext === "string") return ext;
  const hyd = msg?.templateMessage?.hydratedTemplate?.hydratedContentText;
  if (typeof hyd === "string") return hyd;
  const caption = msg?.imageMessage?.caption || msg?.videoMessage?.caption;
  if (typeof caption === "string") return caption;
  return "";
}


type Props = {
  initialContacts: Contact[];
  instanceSlug: string;
  availableInstanceNames: string[];
};

export default function WhatsappClient({
  initialContacts = [],
  instanceSlug,
  availableInstanceNames,
}: Props) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts ?? []);
  const [activeId, setActiveId] = useState<string | null>(contacts[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeInstance, setActiveInstance] = useState<string>(instanceSlug || "");
  const [isAdmin, setIsAdmin] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);


  // Remove duplicados pela id da mensagem
  function uniqueById<T extends { id: string }>(arr: T[]): T[] {
    const map = new Map<string, T>();
    for (const item of arr) {
      if (!map.has(item.id)) map.set(item.id, item);
    }
    return Array.from(map.values());
  }

  async function handleSelectContact(c: Contact) {
    setActiveId(c.id);
    if (!activeInstance) return;
    setLoading(true);
    try {
      const page = await getWhatsappMessagesByRemoteJid(activeInstance, c.remoteJid, 50, 1);
      // Filtra apenas mensagens do contato selecionado
      const records = page?.messages?.records ? page?.messages?.records : []
      console.log(page?.messages)

      const uiRaw: Message[] = records.map((r: any) => ({
        id: r.id,
        contactId: c.id,
        sender: r?.key?.fromMe ? "me" : "them",
        text: extractRecordText(r),
        timestamp: r?.messageTimestamp || Date.now(),
      }));

      // Deduplica e ordena
      const uiMessages = uniqueById(uiRaw).sort((a, b) => a.timestamp - b.timestamp);

      // Substitui somente as mensagens do contato selecionado, mantendo as demais
      setMessages((prev) => {
        const withoutSelected = prev.filter((m) => m.contactId !== c.id);
        return [...withoutSelected, ...uiMessages];
      });
    } catch (e) {
      console.error("Erro ao buscar mensagens:", e);
      // Limpa apenas as mensagens do contato atual em caso de erro
      setMessages((prev) => prev.filter((m) => m.contactId !== c.id));
    } finally {
      setLoading(false);
    }
  }

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const lastMessageByContact = useMemo(() => {
    const map = new Map<string, Message | undefined>();
    contacts.forEach((c) => {
      const last = messages
        .filter((m) => m.contactId === c.id)
        .sort((a, b) => b.timestamp - a.timestamp)[0];
      map.set(c.id, last);
    });
    return map;
  }, [messages, contacts]);

  const currentMessages = messages
    .filter((m) => m.contactId === activeId)
    .sort((a, b) => a.timestamp - b.timestamp);

  function sendMessage() {
    if (!messageText.trim() || !activeId) return;
    const msg: Message = {
      id: `m-${Date.now()}`,
      contactId: activeId,
      sender: "me",
      text: messageText.trim(),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
    setMessageText("");
  }

  const activeContact = contacts.find((c) => c.id === activeId);

  const { setContacts: setContactsStore } = useWhatsappContactsStore();
  const [isHighPriority, setIsHighPriority] = useState(false);

  useEffect(() => {

    // Preenche a store global ao entrar na tela e sempre que contatos mudarem
    setContactsStore(initialContacts ?? []);
  }, [initialContacts, setContactsStore]);

  useEffect(() => {
    async function detectAdmin() {
      const user = await getSessionUser();
      setIsAdmin(!user?.membershipToCompanyId);
    }
    detectAdmin();
  }, []);

  async function handleChangeInstance(newSlug: string) {
    // Admin pode trocar; membros normalmente não veem o seletor
    setActiveInstance(newSlug);
    setLoading(true);
    try {
      const list = await getWhatsappContactsByInstance(newSlug);
      const next = list.map((c) => ({
        id: c.remoteJid,
        name: c.pushName || c.remoteJid,
        remoteJid: c.remoteJid,
      }));
      setContacts(next);
      setActiveId(next[0]?.id ?? null);
      setMessages([]); // reset thread view on instance change
      setContactsStore(next);
    } catch (e) {
      console.error("Erro ao carregar contatos da instância:", e);
      setContacts([]);
      setActiveId(null);
      setMessages([]);
      setContactsStore([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-[calc(100vh-100px)] grid grid-cols-[320px_1fr] gap-0 bg-white border rounded-lg overflow-hidden">
      <aside className="border-r bg-gray-50 flex flex-col min-h-0">
        <div className="p-3 flex flex-col gap-2">
          {/* Seletor de instância com texto preto */}
          {isHighPriority &&
          <select
          className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm text-black"
          value={activeInstance}
          onChange={(e) => handleChangeInstance(e.target.value)}
          >
            {availableInstanceNames.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          }

          {/* Campo de pesquisa com texto preto */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar conversas"
            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm text-black"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((c) => {
            const last = lastMessageByContact.get(c.id);
            return (
              <button
                key={c.id}
                onClick={() => handleSelectContact(c)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100 ${activeId === c.id ? "bg-gray-200" : ""
                  }`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                  {c.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">{c.name}</span>
                    <span className="text-xs text-gray-500">
                      {last ? formatTime(last.timestamp) : ""}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {last ? last.text : "Sem mensagens"}
                  </div>
                </div>
              </button>
            );
          })}
          {!filteredContacts.length && (
            <div className="p-4 text-sm text-gray-500">Nenhum contato encontrado</div>
          )}
        </div>
      </aside>

      <main className="flex flex-col">
        <header className="px-4 py-3 border-b flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
            {activeContact?.name?.slice(0, 1).toUpperCase() || "?"}
          </div>
          <div>
            <div className="font-medium text-gray-900">{activeContact?.name || "Selecione um contato"}</div>
            <div className="text-xs text-gray-500">{loading ? "carregando..." : "online"}</div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto bg-gray-100 px-6 py-4 space-y-2">
          {currentMessages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${m.sender === "me" ? "ml-auto bg-green-200 text-gray-900" : "bg-white text-gray-900"
                }`}
            >
              <div>{m.text}</div>
              <div className="text-[10px] text-gray-600 mt-1">{formatTime(m.timestamp)}</div>
            </div>
          ))}
          {!currentMessages.length && !loading && (
            <div className="text-sm text-gray-500">Sem mensagens ainda. Selecione um contato.</div>
          )}
          {loading && (
            <div className="text-sm text-gray-500">Carregando mensagens...</div>
          )}
        </section>

        <footer className="px-4 py-3 border-t flex items-center gap-2">
          <input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Digite uma mensagem"
            className="flex-1 px-3 py-2 rounded-md border border-gray-300 text-sm"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            Enviar
          </button>
        </footer>
      </main>
    </div>
  );

  function scrollToBottom() {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeInstance, activeId]);
}
