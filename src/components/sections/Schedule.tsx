const services = [
  {
    day: "Domingo",
    time: "19h15",
    title: "Culto da Família",
    desc: "Adoração, palavra e celebração. Para todas as idades.",
  },
  {
    day: "Quarta",
    time: "19h30",
    title: "Estudo Bíblico",
    desc: "Mergulho nas Escrituras e formação de discípulos.",
  },
  {
    day: "Terças",
    time: "19h30",
    title: "Células",
    desc: "Compartilhar nossos aprendizados do evangelho.",
  },
  {
    day: "Sábado",
    time: "19h00",
    title: "Culto dos Jovens",
    desc: "Geração comprometida com Cristo e com o próximo.",
  },
];

const upcoming = [
  {
    date: "12 de maio",
    title: "Conferência Maranata 2026",
    desc: "Três noites de palavra, louvor e renovação espiritual.",
  },
  {
    date: "07 de junho",
    title: "Batismo nas águas",
    desc: "Celebração pública da fé. Inscrições com a liderança.",
  },
];

export default function Schedule() {
  return (
    <section id="cultos" className="bg-secondary/40 py-20 md:py-32 border-y border-border">
      <div className="container">
        <header className="max-w-2xl mx-auto text-center reveal">
          <p className="font-display text-xs tracking-[0.4em] uppercase text-accent">
            Programação
          </p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl uppercase tracking-tight text-foreground">
            Cultos da semana
          </h2>
          <div className="mx-auto mt-6 h-px w-16 bg-accent" />
          <p className="mt-8 text-base sm:text-lg leading-relaxed text-muted-foreground">
            Há sempre um lugar reservado para você. Venha como estiver — Deus
            faz o resto.
          </p>
        </header>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {services.map((s) => (
            <article
              key={s.day + s.title}
              className="reveal bg-card border border-border p-7 transition-all duration-300 hover:border-accent hover:-translate-y-1"
            >
              <p className="font-display text-[0.7rem] tracking-[0.4em] uppercase text-accent">
                {s.day}
              </p>
              <p className="mt-3 font-display text-4xl text-foreground tracking-tight">
                {s.time}
              </p>
              <h3 className="mt-5 font-display text-lg uppercase tracking-wide text-foreground">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </article>
          ))}
        </div>

        {/* Upcoming events */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="font-display text-xs tracking-[0.4em] uppercase text-accent text-center reveal">
            Próximos eventos
          </h3>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {upcoming.map((e) => (
              <li
                key={e.title}
                className="reveal py-6 grid grid-cols-[7rem,1fr] gap-6 items-baseline"
              >
                <p className="font-display text-sm tracking-[0.2em] uppercase text-foreground">
                  {e.date}
                </p>
                <div>
                  <p className="font-display text-xl uppercase text-foreground">
                    {e.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{e.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
