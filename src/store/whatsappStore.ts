import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WhatsappInstanceEnvelope } from "@/app/types/types";

type WhatsappState = {
  instances: WhatsappInstanceEnvelope[] | null;
  setInstances: (i: WhatsappInstanceEnvelope[] | null) => void;
  clear: () => void;
};

export const useWhatsappStore = create<WhatsappState>()(
  persist(
    (set) => ({
      instances: null,
      setInstances: (i) => set({ instances: i }),
      clear: () => set({ instances: null }),
    }),
    {
      name: "valle-whatsapp", // localStorage key
      partialize: (state) => ({ instances: state.instances }),
    }
  )
);