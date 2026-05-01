import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#sobre", label: "Sobre" },
  { href: "#cultos", label: "Cultos" },
  { href: "#localizacao", label: "Localização" },
  { href: "#contato", label: "Contato" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Navegação principal"
        className="container flex h-16 items-center justify-between"
      >
        <a href="#top" className="flex items-center gap-2.5" aria-label="Comunidade Maranata — início">
          <img
            src="/regenerated_image_1777640442607.jpg"
            alt=""
            aria-hidden="true"
            className="h-9 w-9 object-contain"
          />
          <span className={`font-display text-sm tracking-[0.2em] uppercase ${scrolled ? "text-foreground" : "text-ink-foreground"}`}>
            Maranata
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`text-sm tracking-wider uppercase font-display transition-colors hover:text-accent ${
                  scrolled ? "text-foreground" : "text-ink-foreground"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={`md:hidden p-2 ${scrolled ? "text-foreground" : "text-ink-foreground"}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-border bg-background">
          <ul className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-display uppercase tracking-wider text-foreground hover:text-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
