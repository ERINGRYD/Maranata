import { MapPin, MessageCircle, Instagram } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";

export default function Location() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    SITE.address.mapsQuery
  )}&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    SITE.address.mapsQuery
  )}`;

  return (
    <section id="localizacao" className="surface-ink-soft py-20 md:py-32">
      <div className="container">
        <header className="max-w-2xl mx-auto text-center reveal">
          <p className="font-display text-xs tracking-[0.4em] uppercase text-accent">
            Onde estamos
          </p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl uppercase tracking-tight text-[#d6d6d6]">
            Venha nos encontrar
          </h2>
          <div className="mx-auto mt-6 h-px w-16 bg-accent" />
        </header>

        <div className="mt-14 grid lg:grid-cols-[1.2fr,1fr] gap-8 lg:gap-12 items-stretch">
          <div className="reveal aspect-[4/3] lg:aspect-auto lg:min-h-[420px] border border-ink-foreground/10 overflow-hidden">
            <iframe
              title="Mapa — Comunidade Maranata Uruçuí"
              src={mapSrc}
              className="w-full h-full grayscale contrast-110"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="reveal flex flex-col justify-center text-[#121213]">
            <p className="font-display text-[0.7rem] tracking-[0.4em] uppercase text-accent">
              Endereço
            </p>
            <p className="mt-3 text-xl text-[#0a0a0a] leading-relaxed">
              {SITE.address.street}
              <br />
              {SITE.address.cityState}
            </p>

            <div className="mt-8 space-y-3">
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-5 py-4 bg-accent text-accent-foreground font-display text-sm tracking-[0.2em] uppercase transition-transform hover:scale-[1.01]"
              >
                <MapPin className="h-4 w-4" />
                Como chegar
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-4 border border-ink-foreground/25 text-[#0c0c0d] font-display text-sm tracking-[0.2em] uppercase transition-colors hover:border-accent hover:text-accent"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-4 border border-ink-foreground/25 text-[#141516] font-display text-sm tracking-[0.2em] uppercase transition-colors hover:border-accent hover:text-accent"
              >
                <Instagram className="h-4 w-4" />
                {SITE.instagramHandle}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
