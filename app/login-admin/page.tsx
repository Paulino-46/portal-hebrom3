"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginAdminPage() {
  const [email, setEmail] = useState("admin@hebrom3.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-md shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-blue-500 text-white font-bold">H3</div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Administrador</h1>
              <p className="text-sm text-slate-400">Use suas credenciais de administrador para acessar o painel.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-200">E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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

            {error ? <p className="text-sm text-red-400" role="alert" aria-live="assertive">{error}</p> : null}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-500"
                />
                Lembrar-me
              </label>
              <a href="#" className="text-sm text-blue-400 hover:underline">Esqueci a senha</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-orange-500 to-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
              {loading ? "Entrando..." : "Entrar como admin"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">Ainda não tem acesso? <a href="/request-access" className="text-blue-400 hover:underline">Solicitar acesso</a></div>
        </div>
      </div>
    </main>
  );
}
