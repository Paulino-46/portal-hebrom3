"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterAdminPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile: "editor",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          profile: formData.profile,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Erro ao cadastrar administrador.");
      }

      if (formData.profile === "editor") {
        setError(null);
        router.push("/login-admin?success=registered&pending=editor");
        return;
      }

      router.push("/login-admin?success=registered");
    } catch (err: any) {
      setError(err.message || "Não foi possível cadastrar o administrador.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-md shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-blue-500 text-white font-bold">H3</div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Cadastro de administrador</h1>
              <p className="text-sm text-slate-400">Crie uma conta para acessar o painel administrativo.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? <p className="text-sm text-red-400" role="alert">{error}</p> : null}

            <label className="block">
              <span className="text-sm font-medium text-slate-200">Nome</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Nome do administrador"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">E-mail</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="admin@exemplo.com"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">Senha</span>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-300 hover:text-slate-100"
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">Perfil de acesso</span>
              <select
                name="profile"
                value={formData.profile}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="editor">Editor - acesso operacional</option>
                <option value="admin">Administrador - acesso completo</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">Confirmar senha</span>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="••••••••"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-orange-500 to-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Cadastrando..." : "Cadastrar administrador"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Já possui conta? <Link href="/login-admin" className="text-blue-400 hover:underline">Fazer login</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
