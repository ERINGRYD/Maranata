import { Link } from "react-router-dom";
import { SITE } from "@/lib/site";
import logoFooter from "@/assets/images/logo-footer.jpg";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-ink-foreground border-t border-ink-foreground/10">
      <div className="container py-16 grid gap-12 md:grid-cols-3 items-start">
        <div>
          <img
            src={logoFooter}
            alt="Logo Comunidade Maranata"
            className="h-20 w-20 object-contain"
          />
          <p className="mt-5 font-display text-sm tracking-[0.3em] uppercase">
            Ministério Comunidade
          </p>
          <p className="font-display text-2xl tracking-[0.1em] uppercase mt-1">
            Maranata
          </p>
          <p className="mt-2 font-serif-italic text-ink-muted tracking-[0.2em]">
            {SITE.motto}
          </p>
        </div>

        <nav aria-label="Rodapé">
          <p className="font-display text-[0.7rem] tracking-[0.4em] uppercase text-accent">
            Navegação
          </p>
          <ul className="mt-5 space-y-3 text-sm">
            <li><a href="#sobre" className="hover:text-accent transition-colors">Sobre nós</a></li>
            <li><a href="#cultos" className="hover:text-accent transition-colors">Cultos e programação</a></li>
            <li><a href="#localizacao" className="hover:text-accent transition-colors">Localização</a></li>
            <li><a href="#contato" className="hover:text-accent transition-colors">Contato</a></li>
          </ul>
        </nav>

        <div>
          <p className="font-display text-[0.7rem] tracking-[0.4em] uppercase text-accent">
            Contato
          </p>
          <ul className="mt-5 space-y-3 text-sm text-ink-muted">
            <li>{SITE.address.street}</li>
            <li>{SITE.address.cityState}</li>
            <li>
              <a href={`tel:+${SITE.whatsappNumber}`} className="hover:text-accent transition-colors">
                {SITE.whatsappDisplay}
              </a>
            </li>
            <li>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                {SITE.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-foreground/10">
        <div className="container py-6 flex flex-col sm:flex-row gap-2 items-center justify-between text-xs text-ink-muted">
          <p>© {year} Comunidade Maranata Uruçuí. Todos os direitos reservados.</p>
          <div className="flex items-center gap-5">
            <Link
              to="/admin/login"
              className="hover:text-accent transition-colors font-display tracking-[0.2em] uppercase"
            >
              Área restrita
            </Link>
            <p className="font-display tracking-[0.3em] uppercase">Uruçuí — PI</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
