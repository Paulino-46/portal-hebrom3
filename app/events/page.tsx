import Link from "next/link";
import Footer from "../../components/Footer";
import TopNav from "../../components/TopNav";
import { getLatestEvents } from "../../services/events";

export default async function EventsPage() {
  const events = await getLatestEvents();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <TopNav />

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <header className="mb-14 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-gold">Agenda</p>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Eventos e Atividades
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-400">
            Fique por dentro de tudo o que acontece na comunidade Hebrom III. 
            Cultos, ações sociais, encontros e celebrações para toda a família.
          </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event: any) => {
            const dateObj = new Date(event.date);
            const day = dateObj.toLocaleDateString("pt-BR", { day: "2-digit" });
            const month = dateObj.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");

            return (
              <article
                key={event.id}
                className="group flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/95 transition hover:-translate-y-1 hover:border-gold/40 shadow-xl shadow-slate-950/40"
              >
                <div className="relative h-56 overflow-hidden bg-slate-800">
                  <img
                    src={event.image || "/img/istockphoto-1144570336-1024x1024.jpg"}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex flex-col items-center justify-center rounded-2xl bg-blue-950/90 p-2 text-center min-w-[52px] border border-white/10 backdrop-blur-sm shadow-lg">
                    <span className="font-serif text-2xl font-bold leading-none text-gold-light">{day}</span>
                    <span className="mt-0.5 text-[0.6rem] uppercase tracking-widest text-white/70">{month}</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-8">
                  <h2 className="mb-4 text-2xl font-semibold text-white group-hover:text-gold-light transition-colors leading-tight">
                    {event.title}
                  </h2>
                  <p className="mb-6 text-sm leading-relaxed text-slate-400">
                    {event.description}
                  </p>

                  <div className="mt-auto space-y-3 border-t border-white/5 pt-6">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10 text-xs text-gold">📍</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10 text-xs text-gold">🕒</span>
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {events.length === 0 && (
          <div className="py-24 text-center">
            <div className="mb-4 text-4xl">📅</div>
            <p className="text-lg text-slate-500">Nenhum evento programado no momento.</p>
            <p className="mt-2 text-sm text-slate-600">Volte em breve para conferir as novidades.</p>
          </div>
        )}

        <div className="mt-20 flex justify-center">
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
          >
            <span>←</span>
            Voltar para o início
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}