import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = { id: string; name: string; email: string } | null;

type AuthState = {
  user: User;
  setUser: (u: User) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (u) => set({ user: u }),
      clear: () => set({ user: null }),
    }),
    {
      name: "valle-user", // localStorage key
      partialize: (state) => ({ user: state.user }), // só guarda user
    }
  )
);