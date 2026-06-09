"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    church: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const isJson = res.headers.get("content-type")?.includes("application/json");
      const data = isJson ? await res.json() : null;

      if (!res.ok) {
        // Se não for JSON, provavelmente é um 404 ou 500 HTML
        throw new Error(data?.error || `Erro ${res.status}: A rota da API não foi encontrada ou falhou.`);
      }

      router.push("/login-user?success=registered");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-900/20 text-xl font-bold transition hover:scale-105">
              D.H
            </div>
          </Link>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold mb-2">Novo Membro</p>
          <h1 className="text-3xl font-bold text-white">Criar sua conta</h1>
          <p className="mt-2 text-sm text-slate-400">Faça parte da nossa comunidade no Distrito de Hebrom</p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl shadow-slate-950/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400" htmlFor="name">
                Nome completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Seu nome"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-600"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400" htmlFor="church">
                Igreja
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 blur transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
                <select
                  id="church"
                  name="church"
                  value={formData.church}
                  onChange={handleChange}
                  className="relative w-full appearance-none rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 group-hover:border-slate-700 cursor-pointer"
                  required
                >
                  <option value="" disabled className="bg-slate-950 text-slate-500">Selecione sua igreja</option>
                  <option value="Igreja de Hebrom Central" className="bg-slate-950">Igreja de Hebrom Central</option>
                  <option value="Igreja de Hebrom II" className="bg-slate-950">Igreja de Hebrom II</option>
                  <option value="Igreja de Hebrom III" className="bg-slate-950">Igreja de Hebrom III</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 transition-colors group-focus-within:text-blue-500 group-hover:text-white">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="exemplo@email.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-600"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400" htmlFor="password">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-600"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400" htmlFor="confirm-password">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-blue-900/20 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500">
            Já tem uma conta?{" "}
            <Link href="/login-user" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}