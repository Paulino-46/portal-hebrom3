"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginUserPage() {
  const [email, setEmail] = useState("user@hebrom3.com");
  const [password, setPassword] = useState("user123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login?role=true", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    setLoading(false);

    if (response.ok && result.ok) {
      router.push(result.redirect);
      return;
    }

    setError(result.message || "Falha no login. Verifique seus dados.");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto flex max-w-md flex-col gap-6 rounded-[2rem] border border-white/10 bg-slate-900/95 p-8 shadow-[0_40px_100px_-60px_rgba(15,23,42,0.9)] backdrop-blur-sm">
        
        
        <form className="space-y-5 " onSubmit={handleSubmit}>
          
          <label className="block text-sm font-medium text-slate-200">
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-200">
            Senha
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </label>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 via-orange-500 to-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Entrando..." : "Entrar como usuário"}
          </button>
        </form>
      </div>
    </main>
  );
}
