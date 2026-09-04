"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface GalleryImage {
  src: string;
  category: "noticias" | "eventos";
  title: string;
  date: string;
}

interface GalleryClientProps {
  images: GalleryImage[];
}

export function GalleryClient({ images }: GalleryClientProps) {
  const [filter, setFilter] = useState<"todos" | "noticias" | "eventos">("todos");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isDownloading, setIsDownloading] = useState<number | null>(null);

  const filteredImages =
    filter === "todos" ? images : images.filter((img) => img.category === filter);

  const selectedImage =
    selectedIndex !== null ? filteredImages[selectedIndex] : null;

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? filteredImages.length - 1 : selectedIndex - 1);
  }, [selectedIndex, filteredImages.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === filteredImages.length - 1 ? 0 : selectedIndex + 1);
  }, [selectedIndex, filteredImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  const handleDownload = async (src: string, index: number) => {
    try {
      setIsDownloading(index);
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hebrom-iii-imagem-${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback: open in new tab
      window.open(src, "_blank");
    } finally {
      setIsDownloading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const filters = [
    { key: "todos" as const, label: "Todos", count: images.length },
    { key: "noticias" as const, label: "Notícias", count: images.filter((i) => i.category === "noticias").length },
    { key: "eventos" as const, label: "Eventos", count: images.filter((i) => i.category === "eventos").length },
  ];

  return (
    <>
      {/* Filtros */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setFilter(f.key);
              setSelectedIndex(null);
            }}
            className={`relative rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
              filter === f.key
                ? "bg-gold text-navy shadow-lg shadow-gold/20"
                : "border border-white/10 bg-white/5 text-slate-300 hover:border-gold/30 hover:bg-white/10"
            }`}
          >
            {f.label}
            <span
              className={`ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                filter === f.key ? "bg-navy/20 text-navy" : "bg-white/10 text-slate-400"
              }`}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid Masonry */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {filteredImages.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl transition-all duration-500 hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5"
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both`,
            }}
          >
            {/* Badge de categoria */}
            <div className="absolute left-4 top-4 z-10">
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                  image.category === "noticias"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                }`}
              >
                {image.category}
              </span>
            </div>

            {/* Botão de Download */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(image.src, index);
              }}
              disabled={isDownloading === index}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/60 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-gold hover:text-navy group-hover:opacity-100 disabled:opacity-50"
              title="Baixar imagem"
            >
              {isDownloading === index ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
              )}
            </button>

            {/* Imagem clicável */}
            <div
              className="relative cursor-zoom-in"
              onClick={() => setSelectedIndex(index)}
            >
              {!loadedImages.has(index) && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                </div>
              )}
              <Image
                src={image.src}
                alt={image.title}
                width={600}
                height={400}
                className={`w-full object-cover transition-all duration-700 group-hover:scale-105 ${
                  loadedImages.has(index) ? "opacity-100" : "opacity-0"
                }`}
                style={{ aspectRatio: index % 3 === 0 ? "3/4" : index % 3 === 1 ? "4/3" : "1/1" }}
                onLoad={() => setLoadedImages((prev) => new Set(prev).add(index))}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%231e293b' width='600' height='400'/%3E%3Ctext fill='%2364748b' font-family='sans-serif' font-size='20' dy='10.5' text-anchor='middle' x='300' y='200'%3EImagem indisponível%3C/text%3E%3C/svg%3E";
                }}
                unoptimized
              />
              
              {/* Overlay com informações */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <h3 className="text-sm font-semibold text-white line-clamp-2">{image.title}</h3>
                <p className="mt-1 text-xs text-slate-400">{formatDate(image.date)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estado vazio */}
      {filteredImages.length === 0 && (
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p className="text-slate-400">Nenhuma imagem encontrada nesta categoria.</p>
        </div>
      )}

      {/* Lightbox / Modal */}
      {selectedIndex !== null && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Botão fechar */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Navegação anterior */}
          {filteredImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-6 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {/* Navegação próxima */}
          {filteredImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-6 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          {/* Imagem ampliada */}
          <div
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.src}
              alt={selectedImage.title}
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto rounded-lg object-contain shadow-2xl"
              unoptimized
            />
            
            {/* Info bar */}
            <div className="absolute -bottom-16 left-0 right-0 text-center">
              <h3 className="text-lg font-semibold text-white">{selectedImage.title}</h3>
              <p className="mt-1 text-sm text-slate-400">
                {formatDate(selectedImage.date)} • {selectedIndex + 1} de {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Botão de Navegação */}
      <div className="mt-24 flex justify-center">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-white/10 hover:border-gold/40 hover:gap-4"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:-translate-x-1">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Voltar para a Página Inicial
        </Link>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}