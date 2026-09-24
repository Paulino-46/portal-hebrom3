"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginAdminPage() {
  const [email, setEmail] = useState("admin@hebrom3.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [successRegistered, setSuccessRegistered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const isPendingEditor = params.get("pending") === "editor";
      setSuccessRegistered(params.get("success") === "registered");
      if (isPendingEditor) {
        setError("Cadastro enviado para aprovação do administrador. Após a confirmação, você receberá um e-mail de ativação.");
      }
    }
  }, []);

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
      localStorage.setItem("user", JSON.stringify(result.user));
      router.push(result.redirect);
      return;
    }

    setError(result.message || "Falha no login. Verifique seus dados.");
  }

  const dashboardItems = [
    "Gestão de eventos e cronograma",
    "Publicação de notícias e destaques",
    "Acesso administrativo centralizado",
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.15),_transparent_30%),linear-gradient(135deg,#020817_0%,#0f172a_45%,#111827_100%)]" />
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/60 shadow-[0_30px_80px_rgba(15,23,42,0.7)] ring-1 ring-white/5 backdrop-blur-xl md:grid-cols-[1.15fr_0.85fr]">
          <section className="hidden flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 md:flex">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-sky-500 to-orange-500 text-lg font-black text-white shadow-lg shadow-blue-500/25">
                  H3
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Portal</p>
                  <p className="text-lg font-semibold text-white">Hebrom 3</p>
                </div>
              </div>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Acesso restrito
              </div>

              <h1 className="max-w-sm text-4xl font-semibold leading-tight text-white">
                Painel administrativo do portal.
              </h1>
              <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
                Centralize a gestão de conteúdo, eventos, comunicação e acessos em uma única interface segura.
              </p>
            </div>

            <div className="space-y-4">
              {dashboardItems.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 shadow-sm shadow-slate-950/50">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-orange-500/20 text-blue-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M5 12.5 9 16l10-10" />
                    </svg>
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-950/80 p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Login</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Administrador</h2>
              </div>
              <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-2.5 py-1.5 text-xs font-medium text-orange-200">
                SEGURA
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">E-mail</span>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z" />
                      <path d="m5 7 7 5 7-5" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-3 pl-11 pr-4 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="admin@hebrom3.com"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Senha</span>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <rect x="4" y="11" width="16" height="9" rx="2" />
                      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    aria-label="Senha"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-3 pl-11 pr-12 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Digite sua senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition hover:text-slate-200"
                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                        <path d="M3 3l18 18" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>

              {successRegistered ? (
                <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300" role="status" aria-live="polite">
                  Cadastro realizado com sucesso. Faça login para continuar.
                </p>
              ) : null}

              {error ? (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300" role="alert" aria-live="assertive">
                  {error}
                </p>
              ) : null}

              <div className="flex items-center justify-between gap-3 pt-1">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500/40"
                  />
                  Lembrar-me
                </label>
                <a href="#" className="text-sm font-medium text-blue-300 transition hover:text-blue-200 hover:underline">
                  Esqueci a senha
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" fill="currentColor" className="opacity-80" />
                    </svg>
                    Entrando...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                    Entrar como administrador
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 border-t border-slate-800 pt-5 text-center text-sm text-slate-400">
              Ainda não tem acesso? <a href="/register-admin" className="font-medium text-blue-300 transition hover:text-blue-200 hover:underline">Cadastrar administrador</a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
