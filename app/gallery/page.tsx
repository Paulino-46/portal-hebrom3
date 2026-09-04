import Link from "next/link";
import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import { getAllNews } from "../../services/news";
import { getLatestEvents } from "../../services/events";

export default async function GalleryPage() {
  // Busca todas as notícias e eventos para extrair as imagens do banco de dados
  const newsFromDb = await getAllNews();
  const eventsFromDb = await getLatestEvents();

  // Coleta apenas as URLs das imagens e remove valores nulos ou vazios
  const allImages = [
    ...newsFromDb.map((item: any) => item.image),
    ...eventsFromDb.map((item: any) => item.image),
  ].filter((src) => !!src);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <TopNav />

      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
        {/* Cabeçalho Editorial */}
        <div className="mb-12 rounded-[32px] border border-white/10 bg-slate-900/85 p-10 shadow-2xl shadow-slate-950/40 text-center">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-3 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-gold-light">
              <span className="block h-1.5 w-1.5 rounded-full bg-gold" />
              Registros Visuais
            </span>
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Nossa Galeria de Momentos
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Explore os registros que marcam a jornada da nossa comunidade Hebrom III. 
            De cultos inspiradores a iniciativas que transformam vidas.
          </p>
        </div>

        {/* Grid da Galeria */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {allImages.map((src, index) => (
            <div 
              key={src + index} 
              className="group relative h-[280px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-xl transition-all hover:border-gold/30"
            >
              {/* Botão de Download */}
              <a
                href={src}
                download={`hebrom-iii-imagem-${index}.jpg`}
                className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/60 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-gold hover:text-navy group-hover:opacity-100"
                title="Baixar imagem"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
              </a>

              {/* Imagem */}
              <img
                src={src}
                alt={`Registro Hebrom III - ${index}`}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
            </div>
          ))}
        </div>

        {/* Botão de Navegação */}
        <div className="mt-20 flex justify-center">
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-white/10 hover:border-gold/40"
          >
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}