"use client";

import { useState } from "react";
import { updateMembershipDepartment } from "@/actions/membership";
import { createDepartment } from "@/actions/department";

type Props = {
  companyId: string;
  memberships: any[];
  departments: any[];
};

export default function MemberShipsClient({ companyId, memberships: initialMemberships, departments: initialDepartments }: Props) {
  const [memberships, setMemberships] = useState(initialMemberships);
  const [departments, setDepartments] = useState(initialDepartments);
  const [modalOpenFor, setModalOpenFor] = useState<string | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  const [newDeptName, setNewDeptName] = useState<string>("");
  const [creatingDept, setCreatingDept] = useState<boolean>(false);
  const [assigning, setAssigning] = useState<boolean>(false);

  function openModal(membershipId: string, currentDeptId?: string | null) {
    setModalOpenFor(membershipId);
    setSelectedDeptId(currentDeptId || "");
    setNewDeptName("");
  }

  function closeModal() {
    setModalOpenFor(null);
    setSelectedDeptId("");
    setNewDeptName("");
    setCreatingDept(false);
    setAssigning(false);
  }

  async function handleCreateDepartment() {
    if (!newDeptName.trim()) return;
    try {
      setCreatingDept(true);
      const dept = await createDepartment({ name: newDeptName.trim(), companyId });
      setDepartments(prev => [...prev, dept]);
      setSelectedDeptId(dept.id);
      setNewDeptName("");
    } finally {
      setCreatingDept(false);
    }
  }

  async function handleAssignSelected() {
    if (!modalOpenFor) return;
    try {
      setAssigning(true);
      const depId = selectedDeptId || null;
      await updateMembershipDepartment(modalOpenFor, depId);
      setMemberships(ms => ms.map(m => m.id === modalOpenFor ? { ...m, departmentId: depId, department: departments.find(d => d.id === depId) || null } : m));
      closeModal();
    } finally {
      setAssigning(false);
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow text-black">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nome</th>
            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Papel</th>
            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Departamento</th>
            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody>
          {memberships.map((m: any, idx: number) => (
            <tr key={m.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{m.user?.name || "—"}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{m.user?.email || "—"}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{m.role}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <button
                  className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
                  onClick={() => openModal(m.id, m.departmentId)}
                >
                  {m.department?.name || "Definir departamento"}
                </button>
              </td>
            </tr>
          ))}
          {memberships.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-gray-400">Nenhum colaborador encontrado para esta empresa.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal de departamento */}
      {modalOpenFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Departamento</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Selecionar departamento</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                >
                  <option value="">Sem departamento</option>
                  {departments.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Criar novo departamento</label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Nome do departamento"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                  />
                  <button
                    className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    onClick={handleCreateDepartment}
                    disabled={creatingDept}
                  >
                    {creatingDept ? "Criando..." : "Criar"}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-200"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                  onClick={handleAssignSelected}
                  disabled={assigning}
                >
                  {assigning ? "Associando..." : "Associar colaborador"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}