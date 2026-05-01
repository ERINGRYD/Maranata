import { whatsappLink } from "@/lib/site";

export default function FinalCTA() {
  return (
    <section id="contato" className="surface-ink py-24 md:py-36">
      <div className="container max-w-3xl text-center">
        <p className="reveal font-display text-xs tracking-[0.4em] uppercase text-accent">
          Convite
        </p>
        <h2 className="reveal mt-6 font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight leading-[1.05] text-ink-foreground">
          Há um lugar<br />
          para você aqui.
        </h2>
        <p className="reveal mt-8 font-serif-italic text-lg sm:text-xl text-ink-muted leading-relaxed">
          Não importa de onde você vem ou o que carrega.
          <br className="hidden sm:block" />
          Venha do jeito que está.
        </p>

        <div className="reveal mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 bg-accent text-accent-foreground font-display text-sm tracking-[0.25em] uppercase transition-transform hover:scale-[1.02]"
          >
            Falar no WhatsApp
          </a>
          <a
            href="#cultos"
            className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 border border-ink-foreground/30 text-ink-foreground font-display text-sm tracking-[0.25em] uppercase transition-colors hover:border-accent hover:text-accent"
          >
            Ver horários
          </a>
        </div>
      </div>
    </section>
  );
}
