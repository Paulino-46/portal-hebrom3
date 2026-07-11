'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SLIDES } from "../lib/sliderData";

type Slide = {
  id: string;
  src: string;
  tag: string;
  title: string;
  desc: string;
  summary: string;
  date: string;
  href?: string;
};

type HeroSectionProps = {
  items?: Slide[];
};

const HIGHLIGHTS = [
  {
    icon: "🙏",
    label: "Azul",
    title: "Cultos",
    body: "Momentos de louvor e comunhão em equipe.",
    accent: "from-sky-500/25 to-sky-950/0",
  },
  {
    icon: "🤲",
    label: "Vermelha",
    title: "Ação social",
    body: "Serviço, cuidado e apoio ao próximo.",
    accent: "from-red-500/25 to-red-950/0",
  },
  {
    icon: "💛",
    label: "Amarela",
    title: "Família",
    body: "Encontros de famílias com alegria e fé.",
    accent: "from-yellow-300/25 to-yellow-950/0",
  },
  {
    icon: "🔥",
    label: "Laranja",
    title: "Eventos",
    body: "Celebrações especiais e encontros vibrantes.",
    accent: "from-orange-500/25 to-orange-950/0",
  },
];

// Card width + gap used by the carousel (px)
const CARD_WIDTH = 340;
const CARD_GAP = 24;
const STEP = CARD_WIDTH + CARD_GAP;

export default function HeroSection({ items = SLIDES }: HeroSectionProps) {
  const initialSlides = items.length ? items : SLIDES;
  const pauseRef = useRef(false);
  const slideCountRef = useRef(initialSlides.length);
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(initialSlides);

  const selectSlide = (index: number) => {
    const sanitized = Math.max(0, Math.min(index, slides.length - 1));
    setCurrent(sanitized);
  };

  useEffect(() => {
    slideCountRef.current = slides.length;
  }, [slides.length]);

  useEffect(() => {
    if (items.length) {
      setSlides(items);
      setCurrent((prev) => Math.min(prev, items.length - 1));
    }
  }, [items]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!pauseRef.current) {
        setCurrent((prev) => (prev + 1) % Math.max(1, slideCountRef.current));
      }
    }, 2800);
    return () => window.clearInterval(interval);
  }, []);

  const move = (dir: number) => selectSlide(current + dir);

  return (
    <>
      {/* ── VIDEO HERO ── */}
      <section
        className="relative flex min-h-[60vh] w-full items-end overflow-hidden sm:min-h-[65vh]"
        role="region"
        aria-labelledby="hero-title"
        id="hero"
      >
        {/* Video background */}
        <video
          className="absolute inset-0 min-h-full min-w-full object-cover object-center"
          src="/video/VID1.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{ filter: "brightness(0.96) contrast(1.05)" }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />

        {/* Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-14 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:pb-20 lg:px-10">
          {/* Left: text */}
          <div className="max-w-2xl">
            <p className="mb-4 mt-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-gold">
              <span className="block h-px w-7 bg-gold" />
              Bem-vindo ao portal
            </p>

            <h1
              id="hero-title"
              className="font-serif text-3xl font-bold leading-[1.1] text-white sm:text-4xl lg:text-6xl"
            >
              Fé, comunidade<br />
              e{" "}
              <em className="not-italic text-gold-light">transformação</em>
              <br className="hidden sm:block" />
              {" "}em Hebrom III
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">
              Acompanhe cultos, iniciativas sociais e eventos em um portal moderno
              feito para toda a comunidade Hebrom III.
            </p>
          </div>

          {/* Right: stats — hidden on mobile, row on sm, column on lg */}
          <div className="hidden sm:flex sm:flex-row sm:gap-6 lg:flex-col lg:items-end lg:gap-5">
            {[
              { num: "12+", label: "Anos de ministério" },
              { num: "500+", label: "Membros ativos" },
              { num: "48", label: "Eventos por ano" },
            ].map(({ num, label }, i) => (
              <div key={i} className="text-right">
                <p className="font-serif text-2xl font-bold text-gold-light lg:text-3xl">{num}</p>
                <p className="mt-0.5 text-[0.6rem] uppercase tracking-[0.18em] text-slate-400">
                  {label}
                </p>
                {i < 2 && (
                  <div className="ml-auto mt-4 hidden h-px w-6 bg-gold/30 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAROUSEL ── */}
      <section
        className="border-t border-blue-400/10 bg-slate-950 px-4 pb-16 sm:px-6 sm:pb-20 lg:px-10"
        role="region"
        aria-labelledby="carousel-title"
      >
        {/* Header */}
        <div className="mx-auto flex max-w-7xl flex-col gap-4 pb-6 pt-10 sm:flex-row sm:items-end sm:justify-between sm:pb-8 sm:pt-14">
          <div>
            <p className="mb-3 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-sky-300">
              <span className="block h-px w-5 bg-sky-300" />
              Destaques
            </p>
            <h2 id="carousel-title" className="text-3xl font-bold leading-snug text-white sm:text-4xl lg:text-5xl">
              Momentos da comunidade
            </h2>
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => move(-1)}
              disabled={current === 0}
              aria-label="Slide anterior"
              title="Slide anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition hover:border-sky-300 hover:bg-sky-300/10 disabled:cursor-not-allowed disabled:opacity-30 sm:h-11 sm:w-11"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              disabled={current >= slides.length - 1}
              aria-label="Próximo slide"
              title="Próximo slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition hover:border-orange-300 hover:bg-orange-300/10 disabled:cursor-not-allowed disabled:opacity-30 sm:h-11 sm:w-11"
            >
              →
            </button>
          </div>
        </div>

        {/* Highlights cards */}
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 pb-6 sm:gap-4 sm:pb-8 md:grid-cols-4">
          {HIGHLIGHTS.map(({ accent, icon, label, title, body }, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl shadow-slate-950/40 sm:rounded-[28px] sm:p-5"
            >
              <div className={`mb-4 h-1.5 rounded-full bg-gradient-to-r ${accent}`} />
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-base text-white sm:h-12 sm:w-12 sm:rounded-2xl sm:text-lg">
                  {icon}
                </div>
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-slate-400">{label}</p>
                  <h3 className="mt-0.5 text-base font-semibold text-white sm:mt-1 sm:text-lg">{title}</h3>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:mt-4 sm:text-sm">{body}</p>
            </div>
          ))}
        </div>

        {/* Track */}
        <div className="mx-auto max-w-7xl overflow-hidden">
          <div className="relative mb-6 sm:mb-8">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-slate-950/100 to-transparent sm:w-24" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-slate-950/100 to-transparent sm:w-24" />
            <div
              className="overflow-hidden pb-4"
              onMouseEnter={() => (pauseRef.current = true)}
              onMouseLeave={() => (pauseRef.current = false)}
            >
              <div
                className="flex gap-6 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ transform: `translateX(-${current * STEP}px)` }}
              >
                {slides.map((slide, i) => (
                  <Link
                    key={slide.id}
                    href={slide.href || "/news"} // Fallback to /news if href is not provided
                    className="w-[calc(100vw-4rem)] max-w-[340px] flex-shrink-0 sm:w-[340px]"
                  >
                    <div
                      className={`relative overflow-hidden rounded-[24px] border border-white/10 bg-slate-950 shadow-2xl shadow-slate-950/30 transition duration-500 ease-out sm:rounded-[32px] ${
                        current === i
                          ? "scale-105 border-sky-300/40"
                          : "scale-95 opacity-90"
                      }`}
                      onClick={() => selectSlide(i)}
                    >
                      <img
                        src={slide.src}
                        alt={slide.title}
                        className="h-64 w-full object-cover object-center transition duration-500 ease-out hover:scale-105 sm:h-[22rem]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                        <span className="inline-flex rounded-full bg-slate-900/80 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-sky-200 shadow-lg shadow-slate-950/40">
                          {slide.tag}
                        </span>
                        <h3 className="mt-3 text-xl font-semibold leading-snug text-white sm:mt-4 sm:text-2xl">
                          {slide.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-200/90 sm:mt-2 sm:text-sm">
                          {slide.desc}
                        </p>
                        <div className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/70 sm:mt-4">
                          <span className="inline-block h-px w-8 bg-sky-300/40" />
                          {slide.tag === "Evento" ? "Ver detalhes do evento" : "Ver notícias relacionadas"}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="mx-auto mt-5 flex max-w-7xl justify-center gap-2 sm:mt-7">
          {Array.from({ length: slides.length }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => selectSlide(i)}
              aria-label={`Ir para o slide ${i + 1}`}
              title={`Ir para o slide ${i + 1}`}
              className={`h-0.5 rounded-full transition-all ${
                i === current ? "w-10 bg-gold" : "w-6 bg-white/20"
              }`}
            />
          ))}
        </div>
      </section>
    </>
  );
}