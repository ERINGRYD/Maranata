import logoDark from "@/assets/images/regenerated_image_1777607271959.png";
import { whatsappLink } from "@/lib/site";

export default function Hero() {
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
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <img
            src={logoDark}
            alt="Escudo da Comunidade Maranata: leão, pomba do Espírito, coração e a Palavra, unidos pela cruz."
            className="w-44 sm:w-56 md:w-64 h-auto animate-fade-in-slow"
            loading="eager"
          />

          <p className="mt-8 font-display text-xs sm:text-sm tracking-[0.4em] uppercase text-accent animate-fade-in">
            Ministério Comunidade
          </p>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-[0.05em] leading-[0.95] animate-fade-in">
            Maranata
          </h1>
          <p className="mt-3 font-serif-italic text-lg sm:text-xl text-ink-muted tracking-[0.3em] animate-fade-in">
            Mudando&nbsp;&nbsp;Destinos
          </p>

          <div className="mt-10 flex items-center gap-3" aria-hidden="true">
            <span className="rule-accent" />
            <span className="font-display text-[0.7rem] tracking-[0.4em] uppercase text-ink-muted">
              Uruçuí — PI
            </span>
            <span className="rule-accent" />
          </div>

          <p className="mt-8 max-w-xl text-base sm:text-lg text-ink-foreground/85 leading-relaxed animate-fade-in">
            Uma família de fé no coração do Piauí. Aqui você encontra
            acolhimento, palavra viva e um lugar para chamar de casa.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <a
              href="#cultos"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-accent text-accent-foreground font-display text-sm tracking-[0.2em] uppercase transition-transform hover:scale-[1.02] hover:bg-accent/90"
            >
              Venha nos visitar
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-ink-foreground/30 text-ink-foreground font-display text-sm tracking-[0.2em] uppercase transition-colors hover:border-accent hover:text-accent"
            >
              Fale conosco
            </a>
          </div>

          <blockquote className="mt-16 max-w-md font-serif-italic text-ink-muted text-base sm:text-lg leading-relaxed">
            “Vinde a mim, todos os que estais cansados e sobrecarregados,
            e eu vos aliviarei.”
            <footer className="mt-2 font-display not-italic text-xs tracking-[0.3em] uppercase text-ink-muted/70">
              Mateus 11:28
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ink-muted text-[0.65rem] tracking-[0.4em] uppercase font-display">
        Role para descobrir
      </div>
    </section>
  );
}
