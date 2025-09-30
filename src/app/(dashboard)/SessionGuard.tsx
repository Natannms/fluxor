import { getSessionUser } from "@/utils/session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function SessionGuard({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/signin");
  }
  return <>{children}</>;
}