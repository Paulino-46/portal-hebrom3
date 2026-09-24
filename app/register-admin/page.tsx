"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BsArrowRight,
  BsCheck2Circle,
  BsEye,
  BsEyeSlash,
  BsPersonGear,
  BsShieldCheck,
} from "react-icons/bs";

export default function RegisterAdminPage() {
  const [formData, setFormData] = useState({
    name: "",
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

  const isEditor = formData.accountType === "editor";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(37,99,235,0.18),transparent_32%),radial-gradient(circle_at_88%_82%,rgba(245,158,11,0.12),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 py-8 sm:px-8 lg:px-12">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/30 backdrop-blur-xl lg:grid-cols-[0.86fr_1.14fr]">
          <section className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden border-r border-white/10 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 p-10 lg:flex xl:p-14">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-blue-400/20" />
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-blue-400/10" />

            <div>
              <Link href="/" className="inline-flex items-center gap-3 text-sm font-semibold tracking-[0.18em] text-white">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500 text-lg font-black shadow-lg shadow-blue-500/20">H3</span>
                PORTAL HEBROM 3
              </Link>

              <div className="mt-24 max-w-sm">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-blue-300">Acesso institucional</p>
                <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white xl:text-5xl">
                  Pessoas certas. Permissões claras.
                </h1>
                <p className="mt-6 text-base leading-7 text-slate-300">
                  Crie o acesso da sua equipe ao painel e mantenha cada perfil no nível certo de responsabilidade.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <BsShieldCheck className="text-xl text-amber-300" />
                <span>Contas protegidas e aprovadas com critério</span>
              </div>
              <div className="flex items-center gap-3">
                <BsCheck2Circle className="text-xl text-emerald-300" />
                <span>Permissões alinhadas ao trabalho de cada pessoa</span>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-10 lg:p-14">
            <div className="mx-auto max-w-xl">
              <div className="mb-9 flex items-start justify-between gap-5">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-300 lg:hidden">Portal Hebrom 3</p>
                  <h2 className="text-3xl font-semibold tracking-tight text-white">Criar acesso</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">Preencha os dados abaixo para iniciar o cadastro da sua conta.</p>
                </div>
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/10 text-blue-300 sm:flex">
                  <BsPersonGear className="text-xl" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error ? (
                  <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-5 text-red-200" role="alert">
                    {error}
                  </div>
                ) : null}

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Tipo de acesso</span>
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
                    className="mt-2 w-full rounded-xl border border-blue-400/30 bg-blue-400/10 px-4 py-3.5 text-sm font-medium text-white outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-400/10"
                  >
                    <option value="admin" className="bg-slate-900">Administrador</option>
                    <option value="editor" className="bg-slate-900">Editor</option>
                  </select>
                  <span className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    {isEditor ? <BsShieldCheck className="text-amber-300" /> : <BsCheck2Circle className="text-emerald-300" />}
                    {isEditor ? "Este acesso será liberado após aprovação." : "Este acesso estará disponível após o cadastro."}
                  </span>
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Nome completo</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
                      placeholder="Ex.: Paulo Gonçalves"
                      required
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">E-mail profissional</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
                      placeholder="nome@exemplo.com"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Senha</span>
                    <div className="relative mt-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3.5 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
                        placeholder="Mínimo de 6 caracteres"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                        aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                      >
                        {showPassword ? <BsEyeSlash /> : <BsEye />}
                      </button>
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Confirmar senha</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10"
                      placeholder="Repita a senha"
                      required
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-blue-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Enviando cadastro..." : "Continuar cadastro"}
                  {!loading ? <BsArrowRight className="transition-transform group-hover:translate-x-1" /> : null}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-500">
                Já possui uma conta? <Link href="/login-admin" className="font-semibold text-blue-300 transition hover:text-blue-200">Fazer login</Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
