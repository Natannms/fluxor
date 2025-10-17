// Server Component
import { getSessionUser } from "@/utils/session";
import { filterWhatsappInstances, getWhatsappContactsByInstance } from "@/actions/whatsapp";
import { getWhatsappPermissionsByCompany } from "@/actions/whatsappPermission";
import { findMembershipByUserId } from "@/actions/membership";
import WhatsappPageClient from "./WhatsappPageClient";

export default async function WhatsappPage() {
  const user = await getSessionUser();
  const companyId = user?.membershipToCompanyId || "";

  // Obtém todas as instâncias ativas para mapear instanceId -> name
  const allEnvs = await filterWhatsappInstances();
  const instanceIdToName = new Map<string, string>();
  for (const env of allEnvs) {
    const id = env.instance?.instanceId;
    const name = env.instance?.name;
    if (id && name) instanceIdToName.set(id, name);
  }

  let allowedInstanceNames: string[] = [];
  let slug = "";

  if (!companyId) {
    // Admin: pode ver tudo
    allowedInstanceNames = allEnvs.map((e) => e.instance?.name).filter((n): n is string => !!n);
    slug = user?.whatsappInstanceName || allowedInstanceNames[0] || "";
  } else {
    // Membro: limita pelas permissões da empresa, priorizando departamento
    const membership = await findMembershipByUserId(user!.id);
    const deptId = membership?.department?.id || null;

    const perms = await getWhatsappPermissionsByCompany(companyId);
    const allowedInstanceIds = Array.from(
      new Set(perms.map((p: any) => p.instanceId).filter(Boolean))
    );
    allowedInstanceNames = allowedInstanceIds
      .map((id) => instanceIdToName.get(id))
      .filter((n): n is string => !!n);

    // Preferir permissão por departamento do membership
    let preferredId: string | undefined;
    if (deptId) {
      const depPerm = perms.find((p: any) => p.targetType === "DEPARTMENT" && p.departmentId === deptId);
      preferredId = depPerm?.instanceId;
    }
    if (!preferredId && membership?.id) {
      const memPerm = perms.find((p: any) => p.targetType === "MEMBERSHIP" && p.membershipId === membership.id);
      preferredId = memPerm?.instanceId;
    }

    const preferredName = preferredId ? instanceIdToName.get(preferredId) : undefined;
    slug = preferredName || allowedInstanceNames[0] || user?.whatsappInstanceName || "";
  }

  // Fallback: se não ainda
  if (!slug && allowedInstanceNames.length === 0) {
    const first = await filterWhatsappInstances({ onlyFirst: true } as any);
    const firstName = first[0]?.instance?.name;
    if (firstName) {
      allowedInstanceNames = [firstName];
      slug = firstName;
    }
  }

  // Contatos da instância escolhida
  let contacts: Array<{ id: string; name: string; remoteJid: string }> = [];
  if (slug) {
    const list = await getWhatsappContactsByInstance(slug);
    contacts = list.map((c: any) => ({
      id: c.remoteJid,
      name: c.pushName || c.remoteJid,
      remoteJid: c.remoteJid,
    }));
  }

  return (
    <WhatsappPageClient
      initialContacts={contacts}
      instanceSlug={slug}
      availableInstanceNames={allowedInstanceNames}
    />
  );
}