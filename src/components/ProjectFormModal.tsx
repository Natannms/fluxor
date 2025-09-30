"use client";

import { useState } from "react";
import { createProject } from "@/actions/project";
import { getSessionUser } from "@/utils/session";

const PROJECT_STAGES = [
  "OPORTUNIDADE",
  "LEAD",
  "BRIEFING1",
  "BRIEFING2",
  "DISCOVERY",
  "PROPOSTA",
  "CONTRATO",
  "EXECUCAO",
  "ENCERRADO",
];

export default function ProjectFormModal({ open, onClose, onCreated }: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    stage: "OPORTUNIDADE",
    probability: "",
    budgetEstimate: "",
    timelineEstimate: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const user = await getSessionUser();
    const payload = {
      ...form,
      probability: form.probability ? Number(form.probability) : undefined,
      budgetEstimate: form.budgetEstimate ? Number(form.budgetEstimate) : undefined,
      timelineEstimate: form.timelineEstimate ? Number(form.timelineEstimate) : undefined,
      createdById: user?.id,
    };
    await createProject(payload);
    setLoading(false);
    setForm({
      title: "",
      description: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      stage: "OPORTUNIDADE",
      probability: "",
      budgetEstimate: "",
      timelineEstimate: "",
    });
    onCreated();
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-xl">
        <h3 className="text-xl font-bold mb-4 text-black">Criar Projeto</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
          <input
            className="border rounded px-3 py-2 text-black"
            placeholder="Título"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            required
          />
          <input
            className="border rounded px-3 py-2 text-black"
            placeholder="Descrição"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
          <input
            className="border rounded px-3 py-2 text-black"
            placeholder="Nome do Cliente"
            value={form.clientName}
            onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
            required
          />
          <input
            className="border rounded px-3 py-2 text-black"
            placeholder="Email do Cliente"
            value={form.clientEmail}
            onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))}
          />
          <input
            className="border rounded px-3 py-2 text-black"
            placeholder="Telefone do Cliente"
            value={form.clientPhone}
            onChange={e => setForm(f => ({ ...f, clientPhone: e.target.value }))}
          />
          <select
            className="border rounded px-3 py-2 text-black"
            value={form.stage}
            onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}
            required
          >
            {PROJECT_STAGES.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
          <input
            className="border rounded px-3 py-2 text-black"
            type="number"
            min={0}
            max={100}
            placeholder="Probabilidade (%)"
            value={form.probability}
            onChange={e => setForm(f => ({ ...f, probability: e.target.value }))}
          />
          <input
            className="border rounded px-3 py-2 text-black"
            type="number"
            min={0}
            placeholder="Orçamento Estimado"
            value={form.budgetEstimate}
            onChange={e => setForm(f => ({ ...f, budgetEstimate: e.target.value }))}
          />
          <input
            className="border rounded px-3 py-2 text-black"
            type="number"
            min={0}
            placeholder="Prazo Estimado (dias/semanas)"
            value={form.timelineEstimate}
            onChange={e => setForm(f => ({ ...f, timelineEstimate: e.target.value }))}
          />
          <div className="col-span-1 md:col-span-2 flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-300 text-black py-2 px-4 rounded"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Criar Projeto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}