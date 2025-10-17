"use client";
import React, { useState } from "react";
import { createCompany } from "@/actions/company";
import { createInvite } from "@/actions/invite"; // ajuste o import conforme o caminho real
import z from "zod";
import { useRouter } from "next/navigation";
import { getWhatsappInstances } from "@/actions/whatsapp";
import { getMembershipsByCompany } from "@/actions/membership";
import { getDepartmentsByCompany } from "@/actions/department";
import { createWhatsappPermission, getWhatsappPermissionsByInstanceAndCompany, deleteWhatsappPermission } from "@/actions/whatsappPermission";

type Company = {
    id: string;
    name: string;
    cnpj?: string;
};

type Membership = {
    id: string;
    userId: string;
    companyId: string;
    role: string;
};

const TABS = [
    { label: "Companies", key: "companies" },
    { label: "Canais de Atendimento", key: "channels" },
];

type Props = {
    companies: Company[];
    memberships: Membership[];
    userId: string; // Passe o ID do usuário logado via prop
};
const membershipSchema = z.object({
    userId: z.string().min(1, "User ID é obrigatório"),
    companyId: z.string().min(1, "Empresa é obrigatória"),
    role: z.string().min(1, "Papel é obrigatório"),
});


export default function OrganizationTabs({ companies: initialCompanies, memberships: initialMemberships, userId }: Props) {
    const [activeTab, setActiveTab] = useState("companies");
    const [companies, setCompanies] = useState<Company[]>(initialCompanies);
    const [memberships, setMemberships] = useState<Membership[]>(initialMemberships);
    const [inviteLoading, setInviteLoading] = useState<string | null>(null);
    // const [permMode, setPermMode] = useState<'MEMBERSHIP' | 'DEPARTMENT' | null>(null);
    // Modal state
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [showMembershipModal, setShowMembershipModal] = useState(false);
    const router = useRouter();

    // Form state - Company
    const [companyName, setCompanyName] = useState("");
    const [companyCnpj, setCompanyCnpj] = useState("");
    const [companyType, setCompanyType] = useState(""); // Adicione esta linha
    const [companyDescription, setCompanyDescription] = useState("");
    // Form state - Membership
    const [membershipUserId, setMembershipUserId] = useState("");
    const [membershipCompanyId, setMembershipCompanyId] = useState(companies[0]?.id || "");
    const [membershipRole, setMembershipRole] = useState("COLABORADOR");

    // Feedback
    const [companyError, setCompanyError] = useState("");
    const [membershipError, setMembershipError] = useState("");

    // Handlers
    async function handleCreateCompany(e: React.FormEvent) {
        e.preventDefault();
        setCompanyError("");
        if (!companyName) {
            setCompanyError("Nome é obrigatório.");
            return;
        }
        try {
            const newCompany = await createCompany({
                name: companyName,
                ownerId: userId,
                type: companyType as "MARKETING" | "SOFTWARE",
                description: companyDescription,
            });
            setCompanies((prev) => [...prev, newCompany]);
            setShowCompanyModal(false);
            setCompanyName("");
            setCompanyCnpj("");
        } catch (err: any) {
            setCompanyError("Erro ao criar empresa.");
        }
    }
    async function handleInvite(companyId: string) {
        setInviteLoading(companyId);
        try {
            const token = Math.random().toString(36).substring(2, 15);
            const invite = await createInvite({
                inviterId: userId,
                companyId,
                token,
                createdAt: new Date(),
            });
            const url = `http://localhost:3000/invite/${invite.token}/register`;
            await navigator.clipboard.writeText(url);
            alert("URL de convite copiada!");
        } catch (err) {
            alert("Erro ao criar convite.");
        } finally {
            setInviteLoading(null);
        }
    }

    function handleViewCollaborators(companyId: string) {
        router.push(`/MemberShips?companyId=${companyId}`);
    }

    // Sub-abas dos canais
    const CHANNEL_TABS = [
        { label: "Instagram", key: "instagram" },
        { label: "Facebook", key: "facebook" },
        { label: "WhatsApp", key: "whatsapp" },
        { label: "Site", key: "site" },
        { label: "Chamadas Telefônicas", key: "phone" },
        { label: "Telegram", key: "telegram" },
    ];
    const [activeChannel, setActiveChannel] = useState<string>("instagram");
    const [whatsappLoading, setWhatsappLoading] = useState<boolean>(false);
    const [whatsappError, setWhatsappError] = useState<string>("");
    const [whatsappInstances, setWhatsappInstances] = useState<any[]>([]);
    const [whatsappFetched, setWhatsappFetched] = useState<boolean>(false);

    // novo: seleção de empresa para gerenciar permissões
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>(initialCompanies[0]?.id || "");

    // novo: modal de permissões por instância
    const [permModalInstanceId, setPermModalInstanceId] = useState<string | null>(null);
    const [permMemberships, setPermMemberships] = useState<any[]>([]);
    const [permDepartments, setPermDepartments] = useState<any[]>([]);
    const [permExisting, setPermExisting] = useState<any[]>([]);
    const [permTargetType, setPermTargetType] = useState<'MEMBERSHIP' | 'DEPARTMENT'>('MEMBERSHIP');
    const [permSelectedMembershipId, setPermSelectedMembershipId] = useState<string>("");
    const [permSelectedDepartmentId, setPermSelectedDepartmentId] = useState<string>("");
    const [permBusy, setPermBusy] = useState<boolean>(false);
    const [permMode, setPermMode] = useState<'MEMBERSHIP' | 'DEPARTMENT' | null>(null);
    const [permCompanyId, setPermCompanyId] = useState<string>(""); // novo: empresa dentro do modal

    async function loadPermData(companyId: string, instanceId: string) {
        const [ms, ds, perms] = await Promise.all([
          getMembershipsByCompany(companyId),
          getDepartmentsByCompany(companyId),
          getWhatsappPermissionsByInstanceAndCompany(instanceId, companyId),
        ]);
        setPermMemberships(ms || []);
        setPermDepartments(ds || []);
        setPermExisting(perms || []);
    }

    async function openPermModal(instanceId: string) {
        setPermModalInstanceId(instanceId);
        const companyId = selectedCompanyId || companies[0]?.id || "";
        setPermCompanyId(companyId);
        setPermMemberships([]);
        setPermDepartments([]);
        setPermExisting([]);
        setPermTargetType('MEMBERSHIP');
        setPermSelectedMembershipId("");
        setPermSelectedDepartmentId("");
        setPermMode(null);
        if (companyId) {
          await loadPermData(companyId, instanceId);
        }
    }

    function closePermModal() {
        setPermModalInstanceId(null);
        setPermMemberships([]);
        setPermDepartments([]);
        setPermExisting([]);
        setPermSelectedMembershipId("");
        setPermSelectedDepartmentId("");
        setPermBusy(false);
    }

    async function handleCreatePermission() {
        if (!permModalInstanceId || !selectedCompanyId) return;
        setPermBusy(true);
        try {
          const payload: any = {
            companyId: selectedCompanyId,
            instanceId: permModalInstanceId,
            targetType: permTargetType,
          };
          if (permTargetType === 'MEMBERSHIP') {
            if (!permSelectedMembershipId) throw new Error("Selecione um colaborador");
            payload.membershipId = permSelectedMembershipId;
          } else {
            if (!permSelectedDepartmentId) throw new Error("Selecione um departamento");
            payload.departmentId = permSelectedDepartmentId;
          }
          await createWhatsappPermission(payload);
          const perms = await getWhatsappPermissionsByInstanceAndCompany(permModalInstanceId, selectedCompanyId);
          setPermExisting(perms || []);
        } catch (e: any) {
          alert(e?.message || "Falha ao criar permissão");
        } finally {
          setPermBusy(false);
        }
    }

    async function handleDeletePermission(id: string) {
        if (!id) return;
        setPermBusy(true);
        try {
          await deleteWhatsappPermission(id);
          if (permModalInstanceId && selectedCompanyId) {
            const perms = await getWhatsappPermissionsByInstanceAndCompany(permModalInstanceId, selectedCompanyId);
            setPermExisting(perms || []);
          }
        } finally {
          setPermBusy(false);
        }
    }
async function handleChannelClick(key: string) {
        setActiveChannel(key);
        if (key === "whatsapp" && !whatsappFetched) {
            setWhatsappLoading(true);
            setWhatsappError("");
            try {
                const instances = await getWhatsappInstances();
                setWhatsappInstances(instances || []);
                setWhatsappFetched(true);
            } catch (e: any) {
                setWhatsappError("Falha ao carregar instâncias do WhatsApp.");
            } finally {
                setWhatsappLoading(false);
            }
        }
    }
    return (
        <div className="">
            <div className="flex border-b mb-4 text">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        className={`px-4 py-2 -mb-px border-b-2 transition-colors ${activeTab === tab.key
                            ? "border-blue-500 text-blue-600 font-semibold"
                            : "border-transparent text-gray-500 hover:text-blue-500"
                            }`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div>
                {activeTab === "companies" && (
                    <div>
                        <div className="flex justify-between items-center mb-2 text-gray-900">
                            <h2 className="text-xl font-semibold">Companies</h2>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                onClick={() => setShowCompanyModal(true)}
                            >
                                Nova Empresa
                            </button>
                        </div>
                        <div className="overflow-x-auto rounded-lg shadow text-black">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        {/* removido ID */}
                                        <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {companies.map((company, idx) => (
                                        <tr
                                            key={company.id}
                                            className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                        >
                                            {/* removido ID */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {company.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                                                <button
                                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                                    onClick={() => handleInvite(company.id)}
                                                    disabled={inviteLoading === company.id}
                                                >
                                                    {inviteLoading === company.id ? "Gerando..." : "Convidar"}
                                                </button>
                                                <button
                                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                                    onClick={() => handleViewCollaborators(company.id)}
                                                >
                                                    Ver Colaboradores
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {companies.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={2}
                                                className="px-6 py-4 text-center text-gray-400"
                                            >
                                                Nenhuma empresa encontrada.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "channels" && (
                    <div>
                        <div className="flex border-b mb-4 text-gray-900">
                            {CHANNEL_TABS.map((c) => (
                                <button
                                    key={c.key}
                                    className={`px-3 py-2 -mb-px border-b-2 transition-colors ${activeChannel === c.key
                                        ? "border-indigo-500 text-indigo-600 font-semibold"
                                        : "border-transparent text-gray-500 hover:text-indigo-500"
                                        }`}
                                    onClick={() => handleChannelClick(c.key)}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>

                        {activeChannel === "whatsapp" && (
                            <div className="p-2 text-gray-700">
                                {/* <div className="flex items-center gap-3 mb-3">
                                  <label className="text-sm">Empresa:</label>
                                  <select
                                    className="border rounded px-2 py-1"
                                    value={selectedCompanyId}
                                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                                  >
                                    {companies.map(c => (
                                      <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                  </select>
                                </div> */}

                                <h3 className="text-lg font-semibold mb-2">Instâncias de WhatsApp</h3>
                                {whatsappLoading && <p className="text-gray-500">Carregando instâncias...</p>}
                                {whatsappError && <p className="text-red-600">{whatsappError}</p>}
                                {!whatsappLoading && !whatsappError && (
                                    <div className="overflow-x-auto rounded-lg shadow text-black">
                                        <table className="min-w-full bg-white">
                                            <thead>
                                                <tr>
                                                    <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Nome
                                                    </th>
                                                    <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        InstanceId
                                                    </th>
                                                    <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                        Permissões
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {whatsappInstances.map((ins: any, idx: number) => (
                                                    <tr key={`${ins.id}-${idx}`} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ins.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ins.id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ins.status}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                          <button
                                                            className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
                                                            onClick={() => openPermModal(ins.id)}
                                                          >
                                                            Gerenciar
                                                          </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {whatsappInstances.length === 0 && (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                                                            Nenhuma instância encontrada.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Modal de permissões por instância */}
                                {permModalInstanceId && (
                                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
                                      <h3 className="text-lg font-bold mb-4">Configurações da Instância</h3>

                                      {/* Empresa: selecionar para filtrar colaboradores/departamentos */}
                                      <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Empresa</label>
                                        <select
                                          className="w-full border rounded px-3 py-2"
                                          value={permCompanyId}
                                          onChange={async (e) => {
                                            const newCompanyId = e.target.value;
                                            setPermCompanyId(newCompanyId);
                                            setPermSelectedMembershipId("");
                                            setPermSelectedDepartmentId("");
                                            if (permModalInstanceId && newCompanyId) {
                                              await loadPermData(newCompanyId, permModalInstanceId);
                                            } else {
                                              setPermMemberships([]);
                                              setPermDepartments([]);
                                              setPermExisting([]);
                                            }
                                          }}
                                        >
                                          <option value="">Selecione...</option>
                                          {companies.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                          ))}
                                        </select>
                                      </div>

                                      {/* Passo 1: escolher tipo de associação */}
                                      {permMode === null && (
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                          <button
                                            className="w-full px-4 py-6 border rounded hover:bg-gray-50 text-left disabled:opacity-50"
                                            onClick={() => { setPermMode('MEMBERSHIP'); setPermTargetType('MEMBERSHIP'); }}
                                            disabled={!permCompanyId}
                                          >
                                            <div className="font-semibold mb-1">Associar a colaborador</div>
                                            <div className="text-sm text-gray-600">Vincule a instância a um colaborador da empresa.</div>
                                          </button>
                                          <button
                                            className="w-full px-4 py-6 border rounded hover:bg-gray-50 text-left disabled:opacity-50"
                                            onClick={() => { setPermMode('DEPARTMENT'); setPermTargetType('DEPARTMENT'); }}
                                            disabled={!permCompanyId}
                                          >
                                            <div className="font-semibold mb-1">Associar a departamento</div>
                                            <div className="text-sm text-gray-600">Vincule a instância a todos os membros do departamento.</div>
                                          </button>
                                        </div>
                                      )}

                                      {/* Passo 2: seleção e criação */}
                                      {permMode === 'MEMBERSHIP' && (
                                        <div className="mb-4">
                                          <label className="block text-sm font-medium mb-1">Colaborador</label>
                                          <select
                                            className="w-full border rounded px-3 py-2"
                                            value={permSelectedMembershipId}
                                            onChange={(e) => setPermSelectedMembershipId(e.target.value)}
                                          >
                                            <option value="">Selecione...</option>
                                            {permMemberships.map((m: any) => (
                                              <option key={m.id} value={m.id}>
                                                {m.user?.name || m.id}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      )}

                                      {permMode === 'DEPARTMENT' && (
                                        <div className="mb-4">
                                          <label className="block text-sm font-medium mb-1">Departamento</label>
                                          <select
                                            className="w-full border rounded px-3 py-2"
                                            value={permSelectedDepartmentId}
                                            onChange={(e) => setPermSelectedDepartmentId(e.target.value)}
                                          >
                                            <option value="">Selecione...</option>
                                            {permDepartments.map((d: any) => (
                                              <option key={d.id} value={d.id}>
                                                {d.name}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      )}

                                      <div className="flex justify-end gap-2 mb-4">
                                        <button className="px-4 py-2 rounded bg-gray-200" onClick={closePermModal}>
                                          Cancelar
                                        </button>
                                        <button
                                          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                                          onClick={handleCreatePermission}
                                          disabled={
                                            permBusy ||
                                            !permCompanyId ||
                                            (permMode === 'MEMBERSHIP'
                                              ? !permSelectedMembershipId
                                              : permMode === 'DEPARTMENT'
                                              ? !permSelectedDepartmentId
                                              : true)
                                          }
                                        >
                                          {permBusy ? "Salvando..." : "Adicionar permissão"}
                                        </button>
                                      </div>

                                      <h4 className="text-md font-semibold mb-2">Permissões existentes</h4>
                                      <div className="overflow-x-auto rounded-lg border">
                                        <table className="min-w-full bg-white">
                                          <thead>
                                            <tr>
                                              <th className="px-3 py-2 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tipo</th>
                                              <th className="px-3 py-2 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nome</th>
                                              <th className="px-3 py-2 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Ações</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {permExisting.map((p: any) => (
                                              <tr key={p.id}>
                                                <td className="px-3 py-2 text-sm">{p.targetType}</td>
                                                <td className="px-3 py-2 text-sm">
                                                  {p.targetType === 'MEMBERSHIP'
                                                    ? (p.membership?.user?.name || p.membershipId)
                                                    : (p.department?.name || p.departmentId)}
                                                </td>
                                                <td className="px-3 py-2 text-sm">
                                                  <button
                                                    className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
                                                    onClick={() => handleDeletePermission(p.id)}
                                                    disabled={permBusy}
                                                  >
                                                    Remover
                                                  </button>
                                                </td>
                                              </tr>
                                            ))}
                                            {permExisting.length === 0 && (
                                              <tr>
                                                <td colSpan={3} className="px-3 py-2 text-center text-gray-400">Nenhuma permissão cadastrada.</td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </div>
                        )}

                        {/* ... other channels ... */}
                    </div>
                )}
            </div>

            {/* Modal Company */}
            {showCompanyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-black">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Nova Empresa</h3>
                        <form onSubmit={handleCreateCompany} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Nome</label>
                                <input
                                    className="w-full border rounded px-3 py-2"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Tipo</label>
                                <select
                                    className="w-full border rounded px-3 py-2"
                                    value={companyType}
                                    onChange={(e) => setCompanyType(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    <option value="MARKETING">Marketing</option>
                                    <option value="SOFTWARE">Software</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Descrição</label>
                                <input
                                    className="w-full border rounded px-3 py-2"
                                    value={companyDescription}
                                    onChange={(e) => setCompanyDescription(e.target.value)}
                                    placeholder="Descreva a empresa"
                                />
                            </div>
                            {companyError && <div className="text-red-500">{companyError}</div>}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded bg-gray-200"
                                    onClick={() => setShowCompanyModal(false)}
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
        </div>
    );
}