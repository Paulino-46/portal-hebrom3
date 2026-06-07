import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-[#060f1e] text-white" id="contact">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">

        {/* Main grid */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1.5fr] lg:gap-16">

          {/* Brand */}
          <div>
            <p className="font-serif text-2xl font-bold text-gold-light">Hebrom III</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Portal de notícias e comunidade da igreja Hebrom III. Fique
              conectado com nossa família de fé.
            </p>
            <div className="mt-6 flex gap-2.5">
              {["f", "ig", "yt"].map((s) => (
                <button
                  key={s}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 text-xs text-slate-400 transition hover:border-gold hover:text-gold-light"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-5 text-[0.67rem] font-medium uppercase tracking-[0.22em] text-gold">
              Navegação
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { href: "#about", label: "Sobre nós" },
                { href: "/news", label: "Notícias" },
                { href: "/events", label: "Eventos" },
                { href: "#", label: "Galeria" },
                { href: "/login-admin", label: "Administração" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-5 text-[0.67rem] font-medium uppercase tracking-[0.22em] text-gold">
              Contato
            </p>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li>contato@hebrom3.com</li>
              <li>(11) 98765-4321</li>
              <li className="leading-relaxed">
                Rua da Fé, 123<br />
                Bairro Esperança<br />
                São Paulo, SP
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="mb-5 text-[0.67rem] font-medium uppercase tracking-[0.22em] text-gold">
              Newsletter
            </p>
            <p className="mb-4 text-sm leading-relaxed text-slate-400">
              Receba alertas de eventos, cultos especiais e novidades
              diretamente no seu e-mail.
            </p>
            <div className="flex flex-col gap-2.5">
              <input
                type="email"
                placeholder="seu@email.com"
                className="rounded bg-white/5 border border-gold/20 px-4 py-3 text-sm text-white outline-none placeholder-slate-500 transition focus:border-gold"
              />
              <button
                type="button"
                className="rounded bg-gold py-3 text-xs font-semibold uppercase tracking-[0.14em] text-navy transition hover:bg-gold-light"
              >
                Assinar newsletter
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-gold/15 py-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Hebrom III. Todos os direitos reservados.</p>
          <p>Feito com fé e dedicação ✦</p>
        </div>
      </div>
    </footer>
  );
}