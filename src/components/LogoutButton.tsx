"use client";

import { useTransition } from "react";
import { signOutAction } from "@/actions/auth";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await signOutAction();
          router.push("/signin");
        })
      }
      className="flex items-center px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-indigo-50"
      disabled={pending}
    >
      {pending ? "Saindo..." : "Logout"}
    </button>
  );
}