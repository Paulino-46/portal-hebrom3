import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-[#060f1e] text-white" id="contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">

        {/* Main grid */}
        <div className="grid gap-10 py-12 sm:gap-12 sm:py-16
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-[1.8fr_1fr_1fr_1.5fr]
          lg:gap-16">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-serif text-2xl font-bold text-gold-light">Hebrom III</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Portal de notícias e comunidade da igreja Hebrom III. Fique
              conectado com nossa família de fé.
            </p>
            <div className="mt-6 flex gap-2.5">
              {[
                {
                  name: "Facebook",
                  path: "M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z",
                },
                {
                  name: "Instagram",
                  path: "M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.927 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.281.11-.705.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z",
                },
                {
                  name: "YouTube",
                  path: "M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.367-.102-3.054-.235a2.011 2.01 0 0 1-1.415-1.42c-.123-.418-.198-1.09-.235-1.558L.045 9.09l-.009-.104c-.073-.952-.082-1.866-.083-2.06V6.85c.001-.194.01-1.108.083-2.06l.009-.104.009-.104c.05-.572.124-1.14.235-1.558a2.011 2.01 0 0 1 1.415-1.42c1.16-.312 5.569-.334 6.18-.335h.142zM4.86 11.102l4.756-2.55-4.756-2.55v5.1z",
                },
              ].map((social) => (
                <button
                  key={social.name}
                  aria-label={social.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 text-slate-400 transition hover:border-gold hover:text-gold-light"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d={social.path} />
                  </svg>
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
                { href: "/#about", label: "Sobre nós" },
                { href: "/news", label: "Notícias" },
                { href: "/events", label: "Eventos" },
                { href: "/gallery", label: "Galeria" },
                { href: "/login-admin", label: "Administração" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center gap-2 text-sm text-slate-400 transition-all hover:translate-x-1 hover:text-gold-light"
                  >
                    <span className="h-1 w-1 rounded-full bg-gold opacity-0 transition-all group-hover:opacity-100" />
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

          {/* Newsletter — full width on sm, normal on lg */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="mb-5 text-[0.67rem] font-medium uppercase tracking-[0.22em] text-gold">
              Newsletter
            </p>
            <p className="mb-4 text-sm leading-relaxed text-slate-400">
              Receba alertas de eventos, cultos especiais e novidades
              diretamente no seu e-mail.
            </p>
            <div className="flex flex-col gap-2.5 sm:max-w-sm lg:max-w-none">
              <input
                type="email"
                placeholder="seu@email.com"
                className="rounded bg-white/5 border border-gold/20 px-4 py-3 text-sm text-white outline-none placeholder-slate-500 transition focus:border-gold"
              />
              <button
                type="button"
                className="rounded-xl bg-gradient-to-r from-gold to-amber-500 py-3 text-xs font-bold uppercase tracking-[0.2em] text-navy shadow-lg shadow-gold/20 transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95"
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