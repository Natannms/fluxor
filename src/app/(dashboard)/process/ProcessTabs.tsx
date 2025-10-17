"use client";
import React, { useState } from "react";
import { createProcess, updateProcess, deleteProcess } from "@/actions/process";
import { createProcessKPI, getAllProcessKPIs } from "@/actions/processKPI";
import { createProcessReview, getAllProcessReviews } from "@/actions/processReview";
import { createProcessRule, getAllProcessRules } from "@/actions/processRule";
import { createProcessStep, getAllProcessSteps } from "@/actions/processStep";

type Process = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
};

type TabKey = "processes" | "kpis" | "reviews" | "rules" | "steps";

const TABS = [
  { label: "Processos", key: "processes" },
  { label: "KPIs", key: "kpis" },
  { label: "Reviews", key: "reviews" },
  { label: "Rules", key: "rules" },
  { label: "Steps", key: "steps" },
];

type Props = {
  processes: Process[];
};

export default function ProcessTabs({ processes: initialProcesses }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("processes");
  const [processes, setProcesses] = useState<Process[]>(initialProcesses);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processName, setProcessName] = useState("");
  const [processCode, setProcessCode] = useState("");
  const [processDescription, setProcessDescription] = useState("");
  const [processError, setProcessError] = useState("");

  // Handlers para CRUD de Processos
  async function handleCreateProcess(e: React.FormEvent) {
    e.preventDefault();
    setProcessError("");
    if (!processName || !processCode) {
      setProcessError("Nome e código são obrigatórios.");
      return;
    }
    try {
      const newProcess = await createProcess({
        name: processName,
        code: processCode,
        description: processDescription,
      });
      setProcesses((prev) => [...prev, newProcess]);
      setShowProcessModal(false);
      setProcessName("");
      setProcessCode("");
      setProcessDescription("");
    } catch (err: any) {
      setProcessError("Erro ao criar processo.");
    }
  }

  // Renderização das tabs
  return (
    <div>
      <div className="flex border-b mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 -mb-px border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab(tab.key as TabKey)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab de Processos */}
      {activeTab === "processes" && (
        <div>
          <div className="flex justify-between items-center mb-2 text-gray-900">
            <h2 className="text-xl font-semibold">Processos</h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setShowProcessModal(true)}
            >
              Novo Processo
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg shadow text-black">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody>
                {processes.map((process, idx) => (
                  <tr
                    key={process.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {process.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {process.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {process.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Botões de editar/deletar podem ser adicionados aqui */}
                    </td>
                  </tr>
                ))}
                {processes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                      Nenhum processo encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Novo Processo */}
      {showProcessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-black">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Novo Processo</h3>
            <form onSubmit={handleCreateProcess} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nome</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={processName}
                  onChange={(e) => setProcessName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Código</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={processCode}
                  onChange={(e) => setProcessCode(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Descrição</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={processDescription}
                  onChange={(e) => setProcessDescription(e.target.value)}
                  placeholder="Descreva o processo"
                />
              </div>
              {processError && <div className="text-red-500">{processError}</div>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200"
                  onClick={() => setShowProcessModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Outras tabs (KPIs, Reviews, Rules, Steps) podem ser implementadas de forma semelhante */}
      {activeTab === "kpis" && (
        <div>
          {/* Implementar CRUD de KPIs aqui */}
          <p>Em breve: KPIs</p>
        </div>
      )}
      {activeTab === "reviews" && (
        <div>
          {/* Implementar CRUD de Reviews aqui */}
          <p>Em breve: Reviews</p>
        </div>
      )}
      {activeTab === "rules" && (
        <div>
          {/* Implementar CRUD de Rules aqui */}
          <p>Em breve: Rules</p>
        </div>
      )}
      {activeTab === "steps" && (
        <div>
          {/* Implementar CRUD de Steps aqui */}
          <p>Em breve: Steps</p>
        </div>
      )}
    </div>
  );
}