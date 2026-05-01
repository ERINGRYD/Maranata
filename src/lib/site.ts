// Shared site-wide constants (placeholder content — easily editable).
export const SITE = {
  name: "Comunidade Maranata",
  city: "Uruçuí — PI",
  motto: "Mudando Destinos",
  instagram: "https://instagram.com/comunidademaranata.ofc",
  instagramHandle: "@comunidademaranata.ofc",
  whatsappNumber: "5589999999999", // PLACEHOLDER — substituir pelo número real (DDI+DDD+nº)
  whatsappDisplay: "(89) 9 9999-9999",
  whatsappMessage: "Olá! Gostaria de saber mais sobre a Comunidade Maranata.",
  address: {
    mapsQuery: "-7.232623078561493, -44.56001821349308",
    street: "R. Mafrense, 454, Areia",
    cityState: "Uruçuí - PI"
    
  },
};

// Conferência Maranata 2026 — placeholders editáveis
export const CONFERENCE = {
  name: "Conferência Maranata",
  year: "2026",
  theme: "Mudando Destinos",
  date: "12 a 14 de maio",
  time: "19h30",
  location: "Templo Sede — Uruçuí, PI",
};

export const whatsappLink = () =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(SITE.whatsappMessage)}`;
