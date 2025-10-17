'use client';

import { create } from "zustand";

type Contact = { id: string; name: string };

type WhatsappContactsState = {
  contacts: Contact[];
  setContacts: (c: Contact[]) => void;
  clear: () => void;
};

export const useWhatsappContactsStore = create<WhatsappContactsState>()((set) => ({
  contacts: [],
  setContacts: (c) => set({ contacts: c }),
  clear: () => set({ contacts: [] }),
}));