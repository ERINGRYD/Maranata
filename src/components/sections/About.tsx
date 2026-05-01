const pillars = [
  {
    symbol: "Leão",
    title: "Autoridade",
    text: "O Leão de Judá reina. Vivemos sob o senhorio de Cristo, com reverência e coragem.",
  },
  {
    symbol: "Espírito",
    title: "Vida",
    text: "Movidos pelo Espírito Santo, buscamos a presença de Deus em cada culto e em cada dia.",
  },
  {
    symbol: "Coração",
    title: "Amor",
    text: "Somos uma comunidade que acolhe, escuta e ama — porque fomos primeiro amados por Ele.",
  },
  {
    symbol: "Palavra",
    title: "Fundamento",
    text: "A Bíblia é nosso alicerce. Pregamos uma palavra viva, fiel e que transforma destinos.",
  },
];

export default function About() {
  return (
    <section id="sobre" className="bg-background py-20 md:py-32">
      <div className="container">
        <header className="max-w-2xl mx-auto text-center reveal">
          <p className="font-display text-xs tracking-[0.4em] uppercase text-accent">
            Quem somos
          </p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl uppercase tracking-tight text-foreground">
            Uma comunidade<br className="hidden sm:block" /> de fé em Uruçuí
          </h2>
          <div className="mx-auto mt-6 h-px w-16 bg-accent" />
          <p className="mt-8 text-base sm:text-lg leading-relaxed text-muted-foreground">
            A Comunidade Maranata nasceu do desejo de ver vidas transformadas pelo
            evangelho no cerrado piauiense. Somos pessoas comuns chamadas a viver
            uma fé extraordinária — em família, em adoração e em missão.
          </p>
        </header>

        {/* Four pillars */}
        <div className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {pillars.map((p) => (
            <article
              key={p.symbol}
              className="reveal bg-background p-8 lg:p-10 transition-colors hover:bg-secondary/40"
            >
              <p className="font-display text-[0.7rem] tracking-[0.4em] uppercase text-accent">
                {p.symbol}
              </p>
              <h3 className="mt-4 font-display text-2xl uppercase tracking-wide text-foreground">
                {p.title}
              </h3>
              <div className="mt-4 h-px w-8 bg-foreground/30" />
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {p.text}
              </p>
            </article>
          ))}
        </div>

        {/* Leadership */}
        <div className="mt-20 md:mt-28 grid md:grid-cols-[auto,1fr] gap-10 md:gap-16 items-center max-w-4xl mx-auto reveal">
          <div className="mx-auto md:mx-0 w-44 h-44 md:w-56 md:h-56 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden">
            {/* Placeholder iniciais — substituir por foto real do(a) pastor(a) */}
            <span className="font-display text-5xl text-muted-foreground/60 tracking-widest">
              PR
            </span>
          </div>
          <div className="text-center md:text-left">
            <p className="font-display text-xs tracking-[0.4em] uppercase text-accent">
              Liderança Pastoral
            </p>
            <h3 className="mt-3 font-display text-3xl uppercase text-foreground">
              Pr. Everty Guedes
            </h3>
            <p className="mt-1 font-serif-italic text-muted-foreground">
              & Pra. Adrielly Silva
            </p>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground max-w-lg">
              Há mais de um quinquênio pastoreando em Uruçuí, dedicam suas vidas a
              ensinar a Palavra com clareza e a cuidar de cada pessoa que
              atravessa as portas da comunidade.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
