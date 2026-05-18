"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginAdminPage() {
  const [email, setEmail] = useState("admin@hebrom3.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login?role=admin", {
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
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-700">
            Acesso do Administrador
          </p>
          <h1 className="text-3xl font-semibold">Entrar como administrador</h1>
          <p className="text-slate-600">Use este login para gerenciar notícias e o conteúdo do portal.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-slate-700">E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-sky-400 focus:outline-none"
              required
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span className="font-medium text-slate-700">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-sky-400 focus:outline-none"
              required
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-sky-600 px-5 py-3 text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
          >
            {loading ? "Entrando..." : "Entrar como administrador"}
          </button>
        </form>
      </div>
    </main>
  );
}
