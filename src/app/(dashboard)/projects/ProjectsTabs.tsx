"use client";

import { useEffect, useState } from "react";
import {
  getAllProjects,
  createProject,
  deleteProject,
} from "@/actions/project";
import { getSessionUser } from "@/utils/session";
import ProjectFormModal from "@/components/ProjectFormModal";

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

export default function ProjectsTabs() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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
  const [modalOpen, setModalOpen] = useState(false);

  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      const data = await getAllProjects();
      setProjects(data);
      setLoading(false);
    }
    fetchProjects();

    async function fetchUser() {
      const user = await getSessionUser();
      if (user?.id) setUserId(user.id);
    }
    fetchUser();
  }, []);

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        probability: form.probability ? Number(form.probability) : undefined,
        budgetEstimate: form.budgetEstimate ? Number(form.budgetEstimate) : undefined,
        timelineEstimate: form.timelineEstimate ? Number(form.timelineEstimate) : undefined,
        createdById: userId,
      };
      await createProject(payload);
      // Atualiza lista
      const data = await getAllProjects();
      setProjects(data);
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
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProject(id: string) {
    setLoading(true);
    await deleteProject(id);
    const data = await getAllProjects();
    setProjects(data);
    setLoading(false);
  }

  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl font-bold mb-4">Projetos</h2>

      <button
        className="bg-blue-600 text-white py-2 px-4 rounded mb-6"
        onClick={() => setModalOpen(true)}
      >
        Novo Projeto
      </button>

      <ProjectFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={async () => {
          setLoading(true);
          const data = await getAllProjects();
          setProjects(data);
          setLoading(false);
        }}
      />

      {/* Tabela de projetos */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Título</th>
              <th className="px-4 py-2">Descrição</th>
              <th className="px-4 py-2">Cliente</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Telefone</th>
              <th className="px-4 py-2">Stage</th>
              <th className="px-4 py-2">Probabilidade</th>
              <th className="px-4 py-2">Orçamento</th>
              <th className="px-4 py-2">Prazo</th>
              <th className="px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id}>
                <td className="border px-4 py-2">{project.title}</td>
                <td className="border px-4 py-2">{project.description}</td>
                <td className="border px-4 py-2">{project.clientName}</td>
                <td className="border px-4 py-2">{project.clientEmail}</td>
                <td className="border px-4 py-2">{project.clientPhone}</td>
                <td className="border px-4 py-2">{project.stage}</td>
                <td className="border px-4 py-2">{project.probability ?? "-"}</td>
                <td className="border px-4 py-2">{project.budgetEstimate ?? "-"}</td>
                <td className="border px-4 py-2">{project.timelineEstimate ?? "-"}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDeleteProject(project.id)}
                    disabled={loading}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-4">Nenhum projeto cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}