export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-[1.2fr_0.8fr] sm:px-8">
        <div className="space-y-6">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-400">Hebrom III</span>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Portal de notícias e comunidade da igreja Hebrom III. Acompanhe cultos, eventos, projetos sociais e fique conectado com nossa família de fé.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Contato</p>
              <p className="mt-3 text-sm text-slate-300">contato@hebrom3.com</p>
              <p className="mt-1 text-sm text-slate-300">(11) 98765-4321</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Endereço</p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-slate-300">
                Rua da Fé, 123 - Bairro Esperança, São Paulo, SP
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 shadow-inner shadow-slate-950/20 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Fique por dentro</p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Receba alertas de eventos, cultos especiais e novidades diretamente no seu e-mail.
          </p>

          <form className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-500"
            />
            <button
              type="button"
              className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Assinar
            </button>
          </form>

          <div className="mt-8 space-y-4 text-sm text-slate-400">
            <p className="font-semibold uppercase tracking-[0.28em] text-slate-500">Links rápidos</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <a href="#about" className="transition hover:text-white">Sobre nós</a>
              <a href="#news" className="transition hover:text-white">Notícias</a>
              <a href="#events" className="transition hover:text-white">Eventos</a>
              <a href="/login-admin" className="transition hover:text-white">Administração</a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 bg-slate-950/95 px-6 py-4 text-center text-sm text-slate-500 sm:px-8">
        © {new Date().getFullYear()} Hebrom III. Todos os direitos reservados.
      </div>
    </footer>
  );
}
