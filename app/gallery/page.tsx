"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";

// ─── Types ───────────────────────────────────────────────

interface GalleryItem {
  src: string;
  category: "noticia" | "evento";
  title: string;
  date?: string;
  aspectRatio: "portrait" | "landscape" | "square";
}

// ─── Mock data (substitua pela sua busca real no server component) ───

const mockNews = [
  { image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800", title: "Culto de Domingo", date: "2024-03-15" },
  { image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800", title: "Grupo de Jovens", date: "2024-03-10" },
  { image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800", title: "Batismo", date: "2024-02-28" },
];

const mockEvents = [
  { image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800", title: "Conferência Anual", date: "2024-04-20" },
  { image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800", title: "Festa Comunitária", date: "2024-05-01" },
  { image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800", title: "Ação Social", date: "2024-03-22" },
  { image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800", title: "Retiro Espiritual", date: "2024-06-10" },
];

// ─── Helpers ─────────────────────────────────────────────

function getAspectRatio(src: string): "portrait" | "landscape" | "square" {
  // Simulação — em produção, você pode calcular isso no servidor
  const hash = src.split("?")[0].length;
  if (hash % 3 === 0) return "portrait";
  if (hash % 3 === 1) return "landscape";
  return "square";
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Components ──────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-800/50 animate-pulse">
      <div className="h-[320px] w-full bg-slate-800" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="h-4 w-3/4 rounded bg-slate-700" />
      </div>
    </div>
  );
}

function DownloadButton({ src, filename }: { src: string; filename: string }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDownloading(true);
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback: abre em nova aba
      window.open(src, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/60 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-gold hover:text-navy group-hover:opacity-100 disabled:opacity-50"
      title="Baixar imagem"
    >
      {downloading ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
      )}
    </button>
  );
}

function Lightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: {
  images: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const current = images[currentIndex];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate(currentIndex + 1);
      if (e.key === "ArrowLeft") onNavigate(currentIndex - 1);
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [currentIndex, onClose, onNavigate]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* Contador */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-white backdrop-blur-md">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Botão Fechar */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Navegação */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-8"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-8"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Imagem */}
      <div
        className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={current.src}
          alt={current.title}
          width={1200}
          height={800}
          className="max-h-[85vh] w-auto object-contain"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/80 to-transparent p-6">
          <h3 className="text-lg font-semibold text-white">{current.title}</h3>
          {current.date && (
            <p className="mt-1 text-sm text-slate-300">
              {new Date(current.date).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          <span className={cn(
            "mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider",
            current.category === "noticia"
              ? "bg-blue-500/20 text-blue-300"
              : "bg-amber-500/20 text-amber-300"
          )}>
            {current.category === "noticia" ? "Notícia" : "Evento"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────

export default function GalleryPage() {
  const [filter, setFilter] = useState<"todas" | "noticia" | "evento">("todas");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Simula loading inicial
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Monta os dados da galeria
  const allItems: GalleryItem[] = useMemo(() => {
    const news = mockNews.map((n) => ({
      src: n.image,
      category: "noticia" as const,
      title: n.title,
      date: n.date,
      aspectRatio: getAspectRatio(n.image),
    }));
    const events = mockEvents.map((e) => ({
      src: e.image,
      category: "evento" as const,
      title: e.title,
      date: e.date,
      aspectRatio: getAspectRatio(e.image),
    }));
    return [...news, ...events];
  }, []);

  const filteredItems = useMemo(() => {
    if (filter === "todas") return allItems;
    return allItems.filter((item) => item.category === filter);
  }, [allItems, filter]);

  const handleImageError = useCallback((src: string) => {
    setFailedImages((prev) => new Set(prev).add(src));
  }, []);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const navigateLightbox = (index: number) => {
    if (index >= 0 && index < filteredItems.length) {
      setLightboxIndex(index);
    }
  };

  const filters = [
    { key: "todas" as const, label: "Todas", count: allItems.length },
    { key: "noticia" as const, label: "Notícias", count: allItems.filter((i) => i.category === "noticia").length },
    { key: "evento" as const, label: "Eventos", count: allItems.filter((i) => i.category === "evento").length },
  ];

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
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Nossa Galeria de Momentos
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Explore os registros que marcam a jornada da nossa comunidade Hebrom III. 
            De cultos inspiradores a iniciativas que transformam vidas.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full border px-6 py-2.5 text-sm font-medium transition-all duration-300",
                filter === f.key
                  ? "border-gold/40 bg-gold/15 text-gold shadow-lg shadow-gold/10"
                  : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10 hover:text-white"
              )}
            >
              {f.label}
              <span className={cn(
                "ml-2 rounded-full px-2 py-0.5 text-xs",
                filter === f.key ? "bg-gold/20 text-gold" : "bg-white/10 text-slate-500"
              )}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Grid da Galeria - Masonry-like */}
        {loading ? (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="mb-4 break-inside-avoid">
                <SkeletonCard />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-4 rounded-full bg-slate-800/50 p-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-300">Nenhuma imagem encontrada</h3>
            <p className="mt-2 text-sm text-slate-500">Tente selecionar outra categoria.</p>
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {filteredItems.map((item, index) => {
              if (failedImages.has(item.src)) return null;

              const heightClass =
                item.aspectRatio === "portrait"
                  ? "h-[380px]"
                  : item.aspectRatio === "landscape"
                  ? "h-[240px]"
                  : "h-[300px]";

              return (
                <div
                  key={item.src + index}
                  className="group relative mb-4 break-inside-avoid overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-xl transition-all duration-500 hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5 cursor-pointer"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.08}s both`,
                  }}
                  onClick={() => openLightbox(index)}
                >
                  <DownloadButton
                    src={item.src}
                    filename={`hebrom-iii-${item.category}-${index + 1}.jpg`}
                  />

                  {/* Badge de categoria */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={cn(
                      "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md",
                      item.category === "noticia"
                        ? "bg-blue-500/20 text-blue-200 border border-blue-500/20"
                        : "bg-amber-500/20 text-amber-200 border border-amber-500/20"
                    )}>
                      {item.category === "noticia" ? "Notícia" : "Evento"}
                    </span>
                  </div>

                  {/* Imagem */}
                  <div className={cn("relative w-full overflow-hidden", heightClass)}>
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={() => handleImageError(item.src)}
                      loading={index < 4 ? "eager" : "lazy"}
                    />
                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* Info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <h3 className="text-sm font-semibold text-white line-clamp-1">{item.title}</h3>
                    {item.date && (
                      <p className="mt-1 text-xs text-slate-300">
                        {new Date(item.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>

                  {/* Ícone de expandir */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                    <div className="rounded-full bg-white/10 p-3 backdrop-blur-md">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats */}
        {!loading && filteredItems.length > 0 && (
          <div className="mt-12 flex justify-center">
            <p className="text-sm text-slate-500">
              Exibindo <span className="font-semibold text-slate-300">{filteredItems.length}</span>{" "}
              {filteredItems.length === 1 ? "registro visual" : "registros visuais"}
              {filter !== "todas" && (
                <span> em <span className="text-gold">{filter === "noticia" ? "Notícias" : "Eventos"}</span></span>
              )}
            </p>
          </div>
        )}

        {/* Botão de Navegação */}
        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-white/10 hover:border-gold/40"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="transition-transform group-hover:-translate-x-1"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>

      <Footer />

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filteredItems}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      )}

      {/* Animações CSS */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}