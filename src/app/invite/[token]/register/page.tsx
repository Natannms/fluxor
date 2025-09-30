import InviteRegisterForm from "./InviteRegisterForm";
import { findInviteByToken } from "@/actions/invite";

export default async function Page({ params }: { params: { token: string } }) {
  const invite = await findInviteByToken(params.token);

  return <InviteRegisterForm invite={invite} />;
}