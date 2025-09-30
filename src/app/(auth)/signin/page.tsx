"use client";

import { loginAction } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ field: string; message: string }[]>([]);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = await loginAction({ email, password });
    if ("errors" in result) {
      setError(result.errors!.join(", "));
      setErrors(result.errors || []);
    } else {
      setError("");
       setErrors([]);
      router.push("/home");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-slate-50">
      <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full overflow-hidden">
        {/* Formulário */}
        <div className="flex-1 p-10 flex flex-col justify-center">
          <div className="mb-8">
            <img src="/next.svg" alt="Logo" className="w-10 mb-4" />
            <h2 className="text-3xl font-bold mb-2 text-slate-900">Sign in to your account</h2>
            <p className="text-slate-500 text-base">Enter your credentials to view all insights</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-medium text-slate-900">Email address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 rounded-lg border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="font-medium text-slate-900">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 rounded-lg border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              type="submit"
              className="mt-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-base shadow hover:scale-[1.02] transition"
            >
              Submit &rarr;
            </button>
            <button
              type="button"
              className="mt-2 py-3 rounded-lg bg-white border border-slate-200 text-slate-900 font-medium text-base flex items-center justify-center gap-2 hover:bg-slate-50 transition"
            >
              <img src="/google.svg" alt="Google" className="w-5" />
              Sign in with Google
            </button>
            {error && errors
              .filter(e => e.field === "form")
              .map((e, i) => (
                <p key={i} className="text-red-500 mt-2 text-center">{e.message}</p>
              ))}
          </form>
        </div>
        {/* Insights/Info */}
        <div className="flex-1 bg-gradient-to-br from-indigo-500 to-blue-500 text-white p-10 flex flex-col justify-center items-start">
          <div className="mb-8">
            <h3 className="text-xl font-semibold">Total revenue</h3>
            <div className="text-3xl font-bold">$354,320 <span className="text-green-400 text-base">↑ 2.5%</span></div>
            <div className="mt-4">
              {/* Pie chart SVG */}
              <svg width="120" height="120">
                <circle cx="60" cy="60" r="50" fill="#fff" />
                <path d="M60,60 L60,10 A50,50 0 0,1 110,60 Z" fill="#6366f1" />
                <path d="M60,60 L110,60 A50,50 0 0,1 60,110 Z" fill="#3b82f6" />
                <path d="M60,60 L60,110 A50,50 0 0,1 10,60 Z" fill="#22223b" />
                <path d="M60,60 L10,60 A50,50 0 0,1 60,10 Z" fill="#a5b4fc" />
              </svg>
              <div className="mt-2 text-sm">
                <span className="text-indigo-400">● May </span>
                <span className="text-blue-400">● June </span>
                <span className="text-slate-900">● July </span>
                <span className="text-indigo-200">● August</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/vercel.svg" alt="Anna Peterson" className="w-8 rounded-full" />
              <div>
                <div className="font-semibold">Anna Peterson</div>
                <div className="text-sm">Sent a message to UXTank Inc.</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src="/window.svg" alt="Chris Meadow" className="w-8 rounded-full" />
              <div>
                <div className="font-semibold">Chris Meadow</div>
                <div className="text-sm">Accepted a new project Cascade</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}