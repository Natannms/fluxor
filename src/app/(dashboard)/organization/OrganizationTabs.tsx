"use client";
import React, { useState } from "react";
import { createCompany } from "@/actions/company";
import { createInvite } from "@/actions/invite"; // ajuste o import conforme o caminho real
import z from "zod";

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
    // Modal state
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [showMembershipModal, setShowMembershipModal] = useState(false);

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
                                        <th className="px-6 py-3 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            ID
                                        </th>
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {company.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {company.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                                    onClick={() => handleInvite(company.id)}
                                                    disabled={inviteLoading === company.id}
                                                >
                                                    {inviteLoading === company.id ? "Gerando..." : "Convidar"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {companies.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={3}
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