"use client";

import { FormEvent, useState } from "react";

type NewsletterFormProps = {
  compact?: boolean;
};

export default function NewsletterForm({ compact = false }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "Não foi possível concluir a inscrição.");
        return;
      }

      setEmail("");
      setStatus("success");
      setMessage(data.message);
    } catch {
      setStatus("error");
      setMessage("Não foi possível conectar ao servidor.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="seu@email.com"
        aria-label="Seu e-mail"
        disabled={status === "loading"}
        className={`${compact ? "" : "rounded-lg"} rounded bg-white/5 border border-gold/20 px-4 py-3 text-sm text-white outline-none placeholder-slate-500 transition focus:border-gold disabled:cursor-wait disabled:opacity-60`}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-xl bg-gradient-to-r from-gold to-amber-500 py-3 text-xs font-bold uppercase tracking-[0.2em] text-navy shadow-lg shadow-gold/20 transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95 disabled:cursor-wait disabled:opacity-60"
      >
        {status === "loading" ? "A enviar..." : "Assinar newsletter"}
      </button>
      {message && (
        <p
          role="status"
          className={`text-xs leading-relaxed ${status === "success" ? "text-emerald-300" : "text-red-300"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
