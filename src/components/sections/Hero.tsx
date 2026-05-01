import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { whatsappLink, CONFERENCE, SITE } from "@/lib/site";

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((prev) => (prev === 0 ? 1 : 0));
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 7000); // 7 seconds for a better reading pace
    return () => clearInterval(timer);
  }, [next, isPaused]);

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const handleAction = () => {
    setIsPaused(true);
  };

  return (
    <section
      id="top"
      className="surface-ink relative overflow-hidden min-h-[100svh] flex items-center"
    >
      {/* Subtle vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <div className="container relative z-10 py-24 md:py-32">
        <div className="max-w-4xl mx-auto min-h-[500px] flex flex-col items-center justify-center relative">
          <AnimatePresence mode="wait">
            {index === 0 ? (
              <motion.div
                key="welcome"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center w-full"
              >
                <img
                  src="/logo-dark.png"
                  alt="Escudo da Comunidade Maranata"
                  className="w-44 sm:w-56 md:w-64 h-auto"
                  loading="eager"
                />

                <p className="mt-8 font-display text-xs sm:text-sm tracking-[0.4em] uppercase text-accent">
                  Ministério Comunidade
                </p>
                <h1 className="mt-3 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-[0.05em] leading-[0.95]">
                  Maranata
                </h1>
                <p className="mt-3 font-serif-italic text-lg sm:text-xl text-ink-muted tracking-[0.3em]">
                  Mudando&nbsp;&nbsp;Destinos
                </p>

                <p className="mt-8 max-w-xl text-base sm:text-lg text-ink-foreground/85 leading-relaxed">
                  Uma família de fé no coração do Piauí. Aqui você encontra
                  acolhimento, palavra viva e um lugar para chamar de casa.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <a
                    href="#cultos"
                    onClick={handleAction}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-accent text-accent-foreground font-display text-sm tracking-[0.2em] uppercase transition-transform hover:scale-[1.02] hover:bg-accent/90"
                  >
                    Venha nos visitar
                  </a>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleAction}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-ink-foreground/30 text-ink-foreground font-display text-sm tracking-[0.2em] uppercase transition-colors hover:border-accent hover:text-accent"
                  >
                    Fale conosco
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="conference"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center w-full"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full mb-6">
                  <Sparkles className="h-3 w-3 text-accent" />
                  <span className="text-[10px] font-display uppercase tracking-[0.2em] text-accent">Destaque</span>
                </div>

                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.05em] leading-[1.1] max-w-2xl">
                  {CONFERENCE.name} {CONFERENCE.year}
                </h2>
                
                <p className="mt-6 font-serif-italic text-xl sm:text-2xl text-accent tracking-wide">
                  "{CONFERENCE.theme}"
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-ink-muted">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-accent" />
                    <span className="font-display text-xs sm:text-sm uppercase tracking-[0.15em]">{CONFERENCE.date}</span>
                  </div>
                  <div className="hidden sm:block w-px h-4 bg-ink-foreground/10" />
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent" />
                    <span className="font-display text-xs sm:text-sm uppercase tracking-[0.15em]">{CONFERENCE.location}</span>
                  </div>
                </div>

                <p className="mt-8 max-w-xl text-base sm:text-lg text-ink-foreground/85 leading-relaxed">
                  Prepare-se para três dias de profunda adoração, ensinamento bíblico e comunhão. 
                  Vagas limitadas para este encontro que transformará sua trajetória.
                </p>

                <div className="mt-10">
                  <a
                    href="#conferencia"
                    onClick={handleAction}
                    className="group inline-flex items-center gap-3 px-10 py-5 bg-foreground text-background font-display text-sm tracking-[0.2em] uppercase transition-all hover:bg-accent hover:text-accent-foreground hover:scale-[1.02]"
                  >
                    Garantir minha vaga
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Indicators */}
          <div className="mt-16 flex items-center gap-4">
            {[0, 1].map((i) => (
              <button
                key={i}
                onClick={() => {
                  setIndex(i);
                  setIsPaused(true);
                }}
                className={`transition-all duration-300 ${
                  index === i 
                    ? "w-8 h-1 bg-accent" 
                    : "w-2 h-1 bg-ink-foreground/20 hover:bg-ink-foreground/40"
                }`}
                aria-label={`Ir para slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ink-muted text-[0.65rem] tracking-[0.4em] uppercase font-display">
        Role para descobrir
      </div>
    </section>
  );
}
