import Link from "next/link";
import Footer from "./components/Footer";
import HeroCarousel from "./components/HeroCarousel";
import TopNav from "./components/TopNav";

export default function Home() {
  return (
    <main className="bg-white text-slate-900">
      <TopNav />

      <section className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-100 py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:grid-cols-[0.9fr_1.1fr] sm:px-8 lg:gap-20">
          <div className="space-y-8">
            <div className="max-w-xl rounded-[2rem] border border-blue-200 bg-white p-8 shadow-[0_20px_70px_-45px_rgba(30,64,175,0.35)]">
              <p className="text-xs uppercase tracking-[0.4em] text-blue-600">Bem-vindo ao Hebrom III</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
                Notícias da igreja com estilo e energia para a comunidade
              </h1>
              <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
                Acompanhe cultos, iniciativas sociais e eventos em um portal moderno feito para Hebrom III.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/login-user"
                  className="inline-flex items-center justify-center rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Entrar como Usuário
                </Link>
                <Link
                  href="/login-admin"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Área do Admin
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">Atualizações</p>
                <p className="mt-3 text-lg font-semibold text-slate-250">Notícias em tempo real</p>
              </div>
              <div className="rounded-[1.5rem] border border-red-100 bg-red-50 p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-600">Comunidade</p>
                <p className="mt-3 text-lg font-semibold text-slate-950">Projetos sociais</p>
              </div>
              <div className="rounded-[1.5rem] border border-orange-100 bg-orange-50 p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-600">Eventos</p>
                <p className="mt-3 text-lg font-semibold text-slate-950">Cultos e encontros</p>
              </div>
            </div>
          </div>

          <div className="order-first lg:order-last">
            <HeroCarousel />
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">Sobre o portal</span>
            <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Uma experiência interativa para toda a igreja</h2>
            <p className="max-w-xl text-base leading-8 text-slate-600">
              Um portal com navegação simples, conteúdo destacado e áreas de login para cada público. Tudo com foco em clareza, modernidade e conexão com Hebrom III.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-[2rem] border border-blue-100 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-950">Navegação moderna</h3>
              <p className="mt-3 text-slate-600">Acesso rápido a notícias, eventos e contatos com um menu ágil e limpo.</p>
            </article>
            <article className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-950">Design vibrante</h3>
              <p className="mt-3 text-slate-600">Paleta de branco, azul, vermelho e laranja para dar emoção e profissionalismo ao site.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="news" className="bg-slate-950 px-6 py-20 text-slate-100 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-300">Notícias</span>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Destaques recentes</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Acompanhe as últimas publicações e eventos importantes da comunidade Hebrom III em um só lugar.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 transition hover:-translate-y-1 hover:border-blue-300 hover:bg-slate-900">
              <p className="text-sm uppercase tracking-[0.28em] text-blue-300">Culto</p>
              <h3 className="mt-4 text-2xl font-semibold">Culto de celebração</h3>
              <p className="mt-3 text-slate-300">Mensagens inspiradoras, música e comunhão a cada semana.</p>
            </article>
            <article className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 transition hover:-translate-y-1 hover:border-red-300 hover:bg-slate-900">
              <p className="text-sm uppercase tracking-[0.28em] text-red-300">Ação</p>
              <h3 className="mt-4 text-2xl font-semibold">Projeto social</h3>
              <p className="mt-3 text-slate-300">Apoio à comunidade e evangelismo em ações de serviço.</p>
            </article>
            <article className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 transition hover:-translate-y-1 hover:border-orange-300 hover:bg-slate-900">
              <p className="text-sm uppercase tracking-[0.28em] text-orange-300">Evento</p>
              <h3 className="mt-4 text-2xl font-semibold">Semana da família</h3>
              <p className="mt-3 text-slate-300">Encontros, oficinas e atividades para todas as idades.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="events" className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">Eventos em destaque</span>
            <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Agenda e oportunidades</h2>
            <p className="max-w-xl text-base leading-8 text-slate-600">
              Saiba quando serão os próximos encontros, cultos especiais e ações do portal Hebrom III.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-blue-100 bg-blue-50 p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.28em] text-blue-700">16 Maio</p>
              <h3 className="mt-4 text-xl font-semibold text-slate-950">Culto de louvor</h3>
              <p className="mt-3 text-slate-600">Ministração especial de música e palavra de fé.</p>
            </div>
            <div className="rounded-[2rem] border border-orange-100 bg-orange-50 p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.28em] text-orange-700">25 Maio</p>
              <h3 className="mt-4 text-xl font-semibold text-slate-950">Ação social</h3>
              <p className="mt-3 text-slate-600">Compromisso com a comunidade e o cuidado com quem mais precisa.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
