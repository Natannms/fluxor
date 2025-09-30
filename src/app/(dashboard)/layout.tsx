import { redirect, usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

import SessionGuard from "./SessionGuard";
import { getSessionUser } from "@/utils/session";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
 const user = await getSessionUser();
  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
       <Sidebar />
      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <SessionGuard>
          {/* todo o layout existente, incluindo side menu e children */}
          {children}
        </SessionGuard>
      </main>
    </div>
  );
}