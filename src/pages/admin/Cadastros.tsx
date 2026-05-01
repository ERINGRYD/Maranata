import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Search, Users, AlertTriangle, ArrowLeft, Save, RotateCcw, Trash2, Power } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { ADMIN_SESSION_KEY } from "@/lib/mock-cadastros";
import {
  useVagas,
  setLimite,
  resetInscritos,
  getInscritos,
} from "@/lib/vagas-store";
import { cadastroService, CadastroData } from "@/services/cadastroService";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Cadastros() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const vagas = useVagas();
  const [limiteInput, setLimiteInput] = useState<string>(String(vagas.limite));
  const [limiteError, setLimiteError] = useState<string | undefined>();
  const [cadastros, setCadastros] = useState<CadastroData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCadastros();
  }, []);

  const fetchCadastros = async () => {
    try {
      setLoading(true);
      const data = await cadastroService.getAll();
      setCadastros(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao buscar cadastros. Veja o console.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAtivo = async (id: string, currentAtivo: boolean) => {
    try {
      await cadastroService.update(id, { ativo: !currentAtivo });
      setCadastros(prev => prev.map(c => c.id === id ? { ...c, ativo: !currentAtivo } : c));
      toast.success(`Cadastro ${!currentAtivo ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar o status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente deletar este cadastro? Esta ação não pode ser desfeita.")) return;
    
    try {
      await cadastroService.delete(id);
      setCadastros(prev => prev.filter(c => c.id !== id));
      toast.success("Cadastro excluído com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir cadastro.");
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cadastros;
    return cadastros.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.cidade.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    );
  }, [cadastros, query]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Sessão encerrada");
      navigate("/admin/login");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao sair");
    }
  };

  const handleSalvarLimite = (e: React.FormEvent) => {
    e.preventDefault();
    const inscritosAtuais = vagas.inscritos;
    const schema = z.coerce
      .number({ invalid_type_error: "Informe um número válido." })
      .int({ message: "O limite deve ser um número inteiro." })
      .min(0, { message: "O limite não pode ser negativo." })
      .refine((n) => n >= inscritosAtuais, {
        message: `O limite não pode ser menor que o número de inscritos (${inscritosAtuais}).`,
      });

    const result = schema.safeParse(limiteInput);
    if (!result.success) {
      setLimiteError(result.error.issues[0]?.message ?? "Valor inválido.");
      return;
    }
    setLimiteError(undefined);
    setLimite(result.data);
    toast.success(`Limite atualizado para ${result.data} vagas.`);
  };

  const ocupacao = vagas.limite > 0 ? Math.min(100, (vagas.inscritos / vagas.limite) * 100) : 0;
  const ocupacaoAlta = ocupacao >= 90;


  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="surface-ink">
        <div className="container py-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-ink-foreground/80 hover:text-accent transition-colors text-sm font-display tracking-[0.2em] uppercase"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-ink-foreground/80 hover:text-accent transition-colors text-sm font-display tracking-[0.2em] uppercase"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>

        <div className="container pb-12 pt-2">
          <p className="font-display text-[0.7rem] tracking-[0.4em] uppercase text-accent">
            Painel administrativo
          </p>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl uppercase tracking-tight text-ink-foreground">
            Cadastros da Conferência
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
            <Users className="h-4 w-4 text-accent" />
            {cadastros.length} {cadastros.length === 1 ? "inscrição" : "inscrições"}
          </p>
        </div>
      </header>

      <section className="container py-10 space-y-6">

        {/* Controle de vagas */}
        <div className="border border-border bg-card p-6 space-y-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-display text-[0.7rem] tracking-[0.4em] uppercase text-accent">
                Controle de vagas
              </p>
              <h2 className="mt-1 font-display text-xl uppercase tracking-tight">
                Capacidade da conferência
              </h2>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 text-xs font-display tracking-[0.2em] uppercase ${
                vagas.esgotado
                  ? "bg-destructive/15 text-destructive"
                  : "bg-accent/20 text-accent-foreground"
              }`}
            >
              {vagas.esgotado ? "Esgotado" : "Inscrições abertas"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Stat label="Limite" value={vagas.limite} />
            <Stat label="Inscritos" value={vagas.inscritos} />
            <Stat
              label="Restantes"
              value={vagas.restantes}
              accent={vagas.esgotado ? "danger" : "ok"}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Ocupação</span>
              <span>{Math.round(ocupacao)}%</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={Math.round(ocupacao)}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2 w-full bg-muted overflow-hidden"
            >
              <div
                className={`h-full transition-all ${
                  ocupacaoAlta ? "bg-destructive" : "bg-accent"
                }`}
                style={{ width: `${ocupacao}%` }}
              />
            </div>
          </div>

          <form
            onSubmit={handleSalvarLimite}
            noValidate
            className="flex flex-col sm:flex-row gap-3 sm:items-end pt-2 border-t border-border"
          >
            <div className="flex-1">
              <label
                htmlFor="limite-vagas"
                className="block text-xs font-display tracking-[0.25em] uppercase text-foreground"
              >
                Novo limite de vagas
              </label>
              <input
                id="limite-vagas"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={limiteInput}
                onChange={(e) => {
                  setLimiteInput(e.target.value);
                  if (limiteError) setLimiteError(undefined);
                }}
                aria-invalid={!!limiteError}
                aria-describedby={limiteError ? "limite-error" : undefined}
                className={`mt-2 w-full bg-background border px-4 py-3 text-sm focus:outline-none transition-colors ${
                  limiteError
                    ? "border-destructive focus:border-destructive"
                    : "border-input focus:border-accent"
                }`}
              />
              {limiteError && (
                <p
                  id="limite-error"
                  role="alert"
                  className="text-sm text-destructive mt-1"
                >
                  {limiteError}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-display text-xs tracking-[0.25em] uppercase hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Save className="h-4 w-4" />
                Salvar
              </button>
            </div>
          </form>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <label htmlFor="busca" className="sr-only">
            Buscar por nome, cidade ou e-mail
          </label>
          <input
            id="busca"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, cidade ou e-mail"
            className="w-full bg-background border border-input pl-10 pr-4 py-3 text-sm focus:border-accent focus:outline-none transition-colors"
          />
        </div>

        {loading ? (
          <div className="border border-border bg-card p-12 text-center text-muted-foreground animate-pulse">
            Carregando cadastros...
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-border bg-card p-12 text-center">
            <p className="font-display uppercase tracking-[0.2em] text-muted-foreground text-sm">
              Nenhum cadastro encontrado
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Tente outro termo de busca ou aguarde novas inscrições.
            </p>
          </div>
        ) : (
          <div className="border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <Th>Status</Th>
                  <Th>Nome</Th>
                  <Th>Telefone</Th>
                  <Th>E-mail</Th>
                  <Th>Cidade</Th>
                  <Th>Membro</Th>
                  <Th>Inscrito em</Th>
                  <Th>Ações</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className={`border-t border-border transition-colors ${c.ativo ? 'hover:bg-muted/30' : 'bg-destructive/5 hover:bg-destructive/10'}`}
                  >
                    <Td>
                      <span className={`inline-block px-2 py-0.5 text-xs font-display uppercase tracking-wider ${
                        c.ativo ? "bg-accent/20 text-accent-foreground" : "bg-destructive/20 text-destructive"
                      }`}>
                        {c.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </Td>
                    <Td className="font-medium">{c.nome}</Td>
                    <Td>{c.telefone}</Td>
                    <Td className="text-muted-foreground">
                      {c.email || "—"}
                    </Td>
                    <Td>{c.cidade}</Td>
                    <Td>
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-display uppercase tracking-wider ${
                          c.membro === "Sim"
                            ? "bg-accent/20 text-accent-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {c.membro}
                      </span>
                    </Td>
                    <Td className="text-muted-foreground whitespace-nowrap">
                      {formatDate(c.dataCadastro)}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleAtivo(c.id!, c.ativo)}
                          className="p-2 border border-border hover:bg-foreground hover:text-background transition-colors rounded"
                          title={c.ativo ? "Desativar cadastro" : "Ativar cadastro"}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id!)}
                          className="p-2 border border-border text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors rounded"
                          title="Excluir permanentemente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 font-display text-xs tracking-[0.2em] uppercase text-foreground">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "ok" | "danger";
}) {
  const valueColor =
    accent === "danger"
      ? "text-destructive"
      : accent === "ok"
        ? "text-accent"
        : "text-foreground";
  return (
    <div className="border border-border bg-background p-4">
      <p className="font-display text-[0.65rem] tracking-[0.3em] uppercase text-muted-foreground">
        {label}
      </p>
      <p className={`mt-2 font-display text-3xl tracking-tight ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}
