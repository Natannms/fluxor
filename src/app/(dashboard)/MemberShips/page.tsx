import { getMembershipsByCompany } from "@/actions/membership";
import { getDepartmentsByCompany } from "@/actions/department";
import MemberShipsClient from "./MemberShipsClient";

export default async function MemberShipsPage({ searchParams }: { searchParams?: { companyId?: string } }) {
  const companyId = searchParams?.companyId;
  if (!companyId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Colaboradores</h1>
        <p className="text-red-600">CompanyId não informado.</p>
      </div>
    );
  }

  const memberships = await getMembershipsByCompany(companyId);
  const departments = await getDepartmentsByCompany(companyId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Colaboradores da Empresa</h1>
      <MemberShipsClient companyId={companyId} memberships={memberships} departments={departments} />
    </div>
  );
}