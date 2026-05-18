"use client";

import { useEffect, useMemo, useState } from "react";

const slides = [
  {
    title: "Culto de Comunhão",
    description: "Fique por dentro dos maiores momentos de louvor, culto e confraternização.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Projetos Sociais",
    description: "Acompanhe nossas ações sociais e oportunidades de voluntariado.",
    image:
      "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Jovens e Família",
    description: "Notícias e eventos dedicados a toda a família Hebrom III.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  const dots = useMemo(
    () =>
      slides.map((_, index) => (
        <button
          key={index}
          onClick={() => setActiveIndex(index)}
          aria-label={`Ir para slide ${index + 1}`}
          className={`h-2.5 w-2.5 rounded-full transition ${
            index === activeIndex ? "bg-emerald-700" : "bg-slate-300"
          }`}
        />
      )),
    [activeIndex]
  );

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl">
      <div className="relative h-[420px] sm:h-[520px]">
        <img
          src={activeSlide.image}
          alt={activeSlide.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 sm:px-10">
          <div className="max-w-3xl rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur-xl sm:p-8">
            <p className="text-sm uppercase tracking-[0.36em] text-emerald-300">Portal Hebrom III</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{activeSlide.title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              {activeSlide.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveIndex((activeIndex + slides.length - 1) % slides.length)}
                className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((activeIndex + 1) % slides.length)}
                className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">{dots}</div>
    </section>
  );
}
