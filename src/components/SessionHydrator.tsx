"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function SessionHydrator({ user }: { user: { id: string; name: string; email: string } }) {
  const setUser = useAuthStore((s) => s.setUser);
  useEffect(() => {
    setUser(user);
  }, [user, setUser]);
  return null;
}