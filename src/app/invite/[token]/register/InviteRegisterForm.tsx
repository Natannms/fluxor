"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/actions/auth";
import { createMembership } from "@/actions/membership";

export default function InviteRegisterForm({ invite }: { invite: any }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!invite) {
    return <div className="text-red-500">Convite inválido ou expirado.</div>;
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Cria o usuário usando registerAction
      const result = await registerAction({ name, email, password });
      if (result.errors) {
        setError(result.errors.map((e: any) => e.message).join(", "));
        setLoading(false);
        return;
      }
      const userId = (result.data as any).id || (result.data as any).user?.id;
      if (!userId) throw new Error("Erro ao criar usuário.");

      await createMembership({
        userId,
        companyId: invite.companyId,
        role: "COLABORADOR",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      router.push("/signin");
    } catch (err: any) {
      setError(err.message || "Erro ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Registro via Convite</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Senha</label>
          <input className="w-full border rounded px-3 py-2" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}