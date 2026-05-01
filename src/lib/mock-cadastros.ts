export type Cadastro = {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  cidade: string;
  membro: "Sim" | "Não";
  acessibilidade?: string;
  criadoEm: string; // ISO
};

export const MOCK_CADASTROS: Cadastro[] = [
  {
    id: "c-001",
    nome: "Ana Beatriz Carvalho",
    telefone: "(89) 9 8821-4477",
    email: "ana.beatriz@email.com",
    cidade: "Uruçuí",
    membro: "Sim",
    criadoEm: "2026-04-12T14:32:00",
  },
  {
    id: "c-002",
    nome: "Carlos Eduardo Lima",
    telefone: "(86) 9 9912-3344",
    email: "cadu.lima@email.com",
    cidade: "Teresina",
    membro: "Não",
    acessibilidade: "Cadeirante — necessita rampa de acesso",
    criadoEm: "2026-04-13T09:18:00",
  },
  {
    id: "c-003",
    nome: "Mariana Sousa Oliveira",
    telefone: "(89) 9 8744-1290",
    email: "",
    cidade: "Bom Jesus",
    membro: "Não",
    criadoEm: "2026-04-14T19:45:00",
  },
  {
    id: "c-004",
    nome: "Pedro Henrique Alves",
    telefone: "(89) 9 8123-9988",
    email: "pedro.alves@email.com",
    cidade: "Uruçuí",
    membro: "Sim",
    criadoEm: "2026-04-15T08:02:00",
  },
  {
    id: "c-005",
    nome: "Joana Mendes Ribeiro",
    telefone: "(86) 9 9988-7766",
    email: "joana.mendes@email.com",
    cidade: "Floriano",
    membro: "Não",
    criadoEm: "2026-04-16T16:11:00",
  },
  {
    id: "c-006",
    nome: "Lucas Tavares Nunes",
    telefone: "(89) 9 8011-2233",
    email: "lucas.nunes@email.com",
    cidade: "Uruçuí",
    membro: "Sim",
    criadoEm: "2026-04-18T11:27:00",
  },
  {
    id: "c-007",
    nome: "Patrícia Soares da Costa",
    telefone: "(89) 9 8500-6611",
    email: "paty.costa@email.com",
    cidade: "Baixa Grande do Ribeiro",
    membro: "Não",
    acessibilidade: "Intérprete de Libras",
    criadoEm: "2026-04-20T20:50:00",
  },
  {
    id: "c-008",
    nome: "Rafael Dantas Pereira",
    telefone: "(89) 9 8302-7799",
    email: "",
    cidade: "Ribeiro Gonçalves",
    membro: "Sim",
    criadoEm: "2026-04-22T07:09:00",
  },
  {
    id: "c-009",
    nome: "Beatriz Lopes Rocha",
    telefone: "(86) 9 9745-3322",
    email: "bia.rocha@email.com",
    cidade: "Teresina",
    membro: "Não",
    criadoEm: "2026-04-24T13:33:00",
  },
  {
    id: "c-010",
    nome: "Tiago Moreira Brito",
    telefone: "(89) 9 8666-4411",
    email: "tiago.brito@email.com",
    cidade: "Uruçuí",
    membro: "Sim",
    criadoEm: "2026-04-26T18:55:00",
  },
];

export const ADMIN_CREDENTIALS = {
  email: "admin@maranata.local",
  password: "maranata2026",
};

export const ADMIN_SESSION_KEY = "mock-admin";
