import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Clock, ArrowRight } from "lucide-react";
import { CONFERENCE } from "@/lib/site";
import { useVagas } from "@/lib/vagas-store";

export default function ConferenceCard() {
  const { limite, inscritos, restantes, esgotado } = useVagas();
  
  const pct = Math.min(
    100,
    Math.round((inscritos / limite) * 100)
  );
  const soldOut = esgotado;
  const left = restantes;

  // Progress color: green <70, amber 70–90, red >=90
  const barColor =
    pct >= 90 ? "bg-destructive" : pct >= 70 ? "bg-accent" : "bg-emerald-600";

  return (
    <section
      id="conferencia"
      aria-labelledby="conferencia-title"
      className="surface-ink py-20 md:py-28"
    >
      <div className="container">
        <article className="reveal mx-auto max-w-5xl border border-ink-foreground/15 bg-ink-soft p-6 sm:p-10 md:p-14 grid md:grid-cols-[1.2fr,1fr] gap-10 items-center">
          {/* Left — Headline & info */}
          <div>
            <p className="font-display text-[0.7rem] tracking-[0.4em] uppercase text-accent">
              Evento especial · {CONFERENCE.year}
            </p>
            <h2
              id="conferencia-title"
              className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-ink-foreground"
            >
              {CONFERENCE.name}
              <span className="block text-accent">{CONFERENCE.year}</span>
            </h2>
            <p className="mt-4 font-serif-italic text-lg sm:text-xl text-ink-muted">
              “{CONFERENCE.theme}”
            </p>

            <ul className="mt-8 space-y-3 text-ink-foreground/90 text-sm sm:text-base">
              <li className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-accent shrink-0" />
                <span>{CONFERENCE.date}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-accent shrink-0" />
                <span>{CONFERENCE.time}</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-accent shrink-0" />
                <span>{CONFERENCE.location}</span>
              </li>
            </ul>
          </div>

          {/* Right — Seats + CTA */}
          <div className="border-t md:border-t-0 md:border-l border-ink-foreground/15 md:pl-10 pt-8 md:pt-0">
            <p className="font-display text-[0.7rem] tracking-[0.4em] uppercase text-accent">
              Vagas
            </p>

            <p className="mt-3 font-display text-5xl sm:text-6xl text-ink-foreground tracking-tight">
              {soldOut ? "0" : left}
              <span className="ml-2 text-base text-ink-muted tracking-normal">
                / {limite}
              </span>
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              {soldOut
                ? "Inscrições encerradas"
                : `${left} ${left === 1 ? "vaga disponível" : "vagas disponíveis"}`}
            </p>

            {/* Progress bar */}
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              aria-label="Vagas preenchidas"
              className="mt-5 h-1.5 w-full bg-ink-foreground/10 overflow-hidden"
            >
              <div
                className={`h-full ${barColor} transition-all duration-700`}
                style={{ width: `${pct}%` }}
              />
            </div>

            {soldOut ? (
              <button
                disabled
                className="mt-8 w-full px-6 py-4 bg-ink-foreground/10 text-ink-muted font-display text-sm tracking-[0.25em] uppercase cursor-not-allowed"
              >
                Vagas esgotadas
              </button>
            ) : (
              <Link
                to="/inscricao"
                className="group mt-8 w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-accent text-accent-foreground font-display text-sm tracking-[0.25em] uppercase transition-transform hover:scale-[1.01]"
              >
                Inscreva-se agora
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
