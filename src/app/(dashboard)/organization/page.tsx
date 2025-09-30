import { getCompanies } from "@/actions/company";
import { getMemberships } from "@/actions/membership";
import { getSessionUser } from "@/utils/session";
import OrganizationTabs from "./OrganizationTabs";

export default async function OrganizationPage() {
  const companies = await getCompanies();
  const memberships = await getMemberships();
  const user = await getSessionUser();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Organization</h1>
      <OrganizationTabs
        companies={companies}
        memberships={memberships}
        userId={user?.id || ""}
      />
    </div>
  );
}