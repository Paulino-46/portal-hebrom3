"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterAdminPage() {
  const [formData, setFormData] = useState({
    name: "",
    church: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile: "admin",
    accountType: "admin",
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
          accountType: formData.accountType,
          church: formData.church,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Erro ao cadastrar administrador.");
      }

      if (formData.accountType !== "admin") {
        setError(null);
        router.push(`/login-${formData.accountType === "user" ? "user" : "admin"}?success=registered&pending=${formData.accountType}`);
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
              <h1 className="text-2xl font-semibold text-white">Novo cadastro</h1>
              <p className="text-sm text-slate-400">Crie uma conta administrativa ou solicite acesso de usuário.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? <p className="text-sm text-red-400" role="alert">{error}</p> : null}

            <label className="block">
              <span className="text-sm font-medium text-slate-200">Tipo de cadastro</span>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={(event) => {
                  const accountType = event.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    accountType,
                    profile: accountType === "editor" ? "editor" : "admin",
                  }));
                }}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="admin">Administrador</option>
                <option value="editor">Editor</option>
                <option value="user">Usuário</option>
              </select>
            </label>

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

            {formData.accountType === "user" ? (
              <label className="block">
                <span className="text-sm font-medium text-slate-200">Igreja</span>
                <select
                  name="church"
                  value={formData.church}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                >
                  <option value="">Selecione a igreja</option>
                  <option value="Igreja de Hebrom Central">Igreja de Hebrom Central</option>
                  <option value="Igreja de Hebrom II">Igreja de Hebrom II</option>
                  <option value="Igreja de Hebrom III">Igreja de Hebrom III</option>
                </select>
              </label>
            ) : null}

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
              <span className="text-sm font-medium text-slate-200">Permissão</span>
              <p className="mt-2 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300">
                {formData.accountType === "user"
                  ? "Acesso de usuário após aprovação do administrador."
                  : formData.accountType === "editor"
                    ? "Acesso de editor após aprovação do administrador."
                    : "Acesso administrativo imediato."
                }
              </p>
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
              {loading ? "Cadastrando..." : "Enviar cadastro"}
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
