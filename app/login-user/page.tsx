"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginUserPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="min-h-screen bg-gradient-to-br from-sky-950 via-slate-950 to-orange-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-md shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gold text-navy font-bold text-xl shadow-lg shadow-gold/20">
              H3
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Entrar – Usuário</h1>
              <p className="text-sm text-slate-300">Acesse sua conta para acompanhar notícias e eventos.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-200">E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">Senha</span>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-label="Senha"
                  className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-4 py-3 pr-12 text-slate-100 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-300 hover:text-slate-100"
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye-off">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.54 18.54 0 0 1 2.21-3.02m4.63-4.63A10.07 10.07 0 0 1 12 4c7 0 11 8 11 8a18.54 18.54 0 0 1-2.21 3.02m-4.63 4.63L2 2m10 10l-7-7"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </label>

            {error ? <p className="text-sm text-red-400" role="alert" aria-live="assertive">{error}</p> : null}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-gold focus:ring-gold/40"
                />
                Lembrar-me
              </label>
              <a href="/forgot-password" className="text-sm text-gold-light hover:underline">Esqueci a senha</a>
            </div>

            <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold to-amber-500 px-4 py-3 text-sm font-bold uppercase tracking-wider text-navy shadow-lg shadow-gold/20 transition hover:scale-[1.01] hover:brightness-110 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                  Entrar como usuário
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">Não tem conta? <a href="/register" className="text-gold-light hover:underline font-medium">Criar conta</a></div>
        </div>
      </div>
    </main>
  );
}
