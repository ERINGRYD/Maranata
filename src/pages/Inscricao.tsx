import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, CalendarDays, MapPin, X, Check } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { z } from "zod";
import { CONFERENCE } from "@/lib/site";
import { useVagas, incrementInscritos } from "@/lib/vagas-store";
import { useReveal } from "@/hooks/useReveal";
import { cadastroService } from "@/services/cadastroService";

// Aceita formatos: (99) 9 0000-0000 (celular, 11 dígitos) ou (99) 0000-0000 (fixo, 10 dígitos)
const phoneRegex = /^\(\d{2}\)\s(?:\d\s)?\d{4}-\d{4}$/;

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  const len = digits.length;
  if (len === 0) return "";
  if (len <= 2) return `(${digits}`;
  if (len <= 6) {
    // fixo em formação: (99) 0000
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (len <= 10) {
    // fixo: (99) 0000-0000
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  // celular 11 dígitos: (99) 9 0000-0000
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
}

const inscricaoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, { message: "Informe seu nome completo (mín. 3 caracteres)." })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres." }),
  telefone: z
    .string()
    .trim()
    .min(1, { message: "Informe um telefone para contato." })
    .regex(phoneRegex, { message: "Telefone inválido. Use o formato (99) 9 0000-0000." }),
  email: z
    .string()
    .trim()
    .max(255, { message: "E-mail deve ter no máximo 255 caracteres." })
    .email({ message: "E-mail inválido." })
    .or(z.literal("")),
  cidade: z
    .string()
    .trim()
    .min(2, { message: "Informe sua cidade de origem." })
    .max(80, { message: "Cidade deve ter no máximo 80 caracteres." }),
  membro: z
    .string()
    .min(1, { message: "Selecione uma opção." }),
  acessibilidade: z.string().max(500, { message: "Máximo de 500 caracteres." }).optional(),
});

type FormErrors = Partial<Record<keyof typeof initialForm, string>>;

const initialForm = {
  nome: "",
  telefone: "",
  email: "",
  cidade: "",
  membro: "",
  acessibilidade: "",
};

export default function Inscricao() {
  useReveal();
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<typeof initialForm | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const vagas = useVagas();
  const left = vagas.restantes;
  const soldOut = vagas.esgotado;

  // Auto-close success modal after 10 seconds
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const update = (k: string, v: string) => {
    setForm((s) => ({ ...s, [k]: v }));
    if (errors[k as keyof FormErrors]) {
      setErrors((e) => ({ ...e, [k]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = inscricaoSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      // foco no primeiro campo com erro
      const firstKey = Object.keys(fieldErrors)[0];
      if (firstKey) {
        const el = document.getElementById(fieldNameToId(firstKey));
        el?.focus();
      }
      errorSummaryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Recheca o limite no momento do envio (pode ter esgotado durante o preenchimento)
    if (vagas.esgotado) {
      toast.error("As vagas se esgotaram durante o preenchimento.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await cadastroService.create({
        nome: form.nome,
        telefone: form.telefone,
        email: form.email,
        cidade: form.cidade,
        membro: form.membro,
        acessibilidade: form.acessibilidade,
        ativo: true,
      });

      setSubmittedData({ ...form });
      setSubmitted(true);
      setForm(initialForm); // Clear form after success
    } catch (err) {
      console.error(err);
      toast.error("Ocorreu um erro ao salvar o cadastro. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldNameToId = (name: string) => {
    const map: Record<string, string> = {
      nome: "nome-completo",
      telefone: "telefone-/-whatsapp",
      email: "e-mail",
      cidade: "cidade-de-origem",
      membro: "membro-sim",
    };
    return map[name] ?? name;
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Success Modal */}
      <AnimatePresence>
        {submitted && submittedData && (
          <div 
            id="success-modal-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border shadow-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="success-title"
            >
              <button
                onClick={() => setSubmitted(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center">
                    <Check className="h-8 w-8 text-accent" />
                  </div>
                </div>

                <div className="text-center">
                  <h2 id="success-title" className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-foreground">
                    Inscrição realizada com sucesso!
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Sua vaga para a {CONFERENCE.name} está garantida.
                  </p>
                </div>

                <div className="mt-8 space-y-4 p-6 bg-muted/30 border border-border/50 rounded-lg">
                  <h3 className="text-xs font-display tracking-[0.25em] uppercase text-ink-muted">
                    Resumo do Cadastro
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nome:</span>
                      <span className="font-medium text-foreground text-right">{submittedData.nome}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">E-mail:</span>
                      <span className="font-medium text-foreground text-right">{submittedData.email || "Não informado"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Evento:</span>
                      <span className="font-medium text-foreground text-right">{CONFERENCE.name} {CONFERENCE.year}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 border border-accent/20 bg-accent/5 flex gap-3 items-start">
                  <div className="mt-1 h-2 w-2 rounded-full bg-accent shrink-0" />
                  <p className="text-sm text-ink-foreground/90">
                    <strong className="block text-accent uppercase text-[0.6rem] tracking-[0.2em] mb-1">Próximo Passo</strong>
                    Você receberá um e-mail com os detalhes e instruções em breve. Acompanhe sua caixa de entrada e spam.
                  </p>
                </div>

                <div className="mt-10 flex flex-col gap-3">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="w-full py-4 bg-foreground text-background font-display text-sm tracking-[0.2em] uppercase hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Entendido
                  </button>
                  <Link
                    to="/"
                    className="w-full py-3 text-center text-xs font-display tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Voltar para o Início
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Topo escuro */}
      <header className="surface-ink">
        <div className="container py-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-ink-foreground/80 hover:text-accent transition-colors text-sm font-display tracking-[0.2em] uppercase"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <span className="font-display text-xs tracking-[0.3em] uppercase text-ink-muted">
            Maranata · {CONFERENCE.year}
          </span>
        </div>

        <div className="container pb-16 pt-4 max-w-3xl">
          <p className="font-display text-[0.7rem] tracking-[0.4em] uppercase text-accent">
            Inscrição
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl uppercase tracking-tight text-ink-foreground">
            {CONFERENCE.name} {CONFERENCE.year}
          </h1>
          <p className="mt-3 font-serif-italic text-lg text-ink-muted">
            “{CONFERENCE.theme}”
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-ink-foreground/85">
            <li className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-accent" />
              {CONFERENCE.date} · {CONFERENCE.time}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              {CONFERENCE.location}
            </li>
          </ul>
        </div>
      </header>

      {/* Conteúdo */}
      <section className="container py-16 max-w-2xl">
        {soldOut ? (
          <div className="reveal text-center py-12 border border-border bg-card p-10">
            <h2 className="font-display text-3xl uppercase tracking-tight">
              Vagas esgotadas
            </h2>
            <p className="mt-3 text-muted-foreground">
              As inscrições para esta edição foram encerradas. Acompanhe nossas
              redes para as próximas datas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="reveal space-y-6" noValidate aria-describedby="form-intro">
            <p id="form-intro" className="text-sm text-muted-foreground">
              Preencha seus dados abaixo. Os campos marcados com{" "}
              <span className="text-accent">*</span> são obrigatórios.
            </p>

            {Object.keys(errors).length > 0 && (
              <div
                ref={errorSummaryRef}
                role="alert"
                aria-live="assertive"
                className="border border-destructive/50 bg-destructive/10 text-destructive p-4 text-sm"
              >
                <p className="font-medium">Por favor, corrija os campos abaixo:</p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  {Object.entries(errors).map(([k, msg]) =>
                    msg ? <li key={k}>{msg}</li> : null
                  )}
                </ul>
              </div>
            )}

            <Field
              label="Nome completo"
              required
              value={form.nome}
              onChange={(v) => update("nome", v)}
              autoComplete="name"
              error={errors.nome}
              maxLength={100}
            />
            <Field
              label="Telefone / WhatsApp"
              required
              type="tel"
              value={form.telefone}
              onChange={(v) => update("telefone", formatPhone(v))}
              placeholder="(89) 9 0000-0000"
              autoComplete="tel"
              error={errors.telefone}
              maxLength={20}
              inputMode="tel"
            />
            <Field
              label="E-mail"
              type="email"
              value={form.email}
              onChange={(v) => update("email", v)}
              placeholder="opcional"
              autoComplete="email"
              error={errors.email}
              maxLength={255}
              inputMode="email"
            />
            <Field
              label="Cidade de origem"
              required
              value={form.cidade}
              onChange={(v) => update("cidade", v)}
              autoComplete="address-level2"
              error={errors.cidade}
              maxLength={80}
            />

            <fieldset className="space-y-2" aria-invalid={!!errors.membro} aria-describedby={errors.membro ? "membro-error" : undefined}>
              <legend className="block text-xs font-display tracking-[0.25em] uppercase text-foreground">
                É membro da Comunidade Maranata? <span className="text-accent">*</span>
              </legend>
              <div className="flex gap-6 pt-1">
                {["Sim", "Não"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 cursor-pointer text-sm"
                  >
                    <input
                      type="radio"
                      name="membro"
                      id={opt === "Sim" ? "membro-sim" : "membro-nao"}
                      value={opt}
                      checked={form.membro === opt}
                      onChange={(e) => update("membro", e.target.value)}
                      className="accent-[hsl(var(--accent))]"
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {errors.membro && (
                <p id="membro-error" className="text-sm text-destructive mt-1">
                  {errors.membro}
                </p>
              )}
            </fieldset>

            <div>
              <label
                htmlFor="acessibilidade"
                className="block text-xs font-display tracking-[0.25em] uppercase text-foreground"
              >
                Necessidade de acessibilidade
              </label>
              <textarea
                id="acessibilidade"
                value={form.acessibilidade}
                onChange={(e) => update("acessibilidade", e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="opcional — descreva se houver"
                aria-invalid={!!errors.acessibilidade}
                aria-describedby={errors.acessibilidade ? "acessibilidade-error" : undefined}
                className="mt-2 w-full bg-background border border-input px-4 py-3 text-sm focus:border-accent focus:outline-none transition-colors"
              />
              {errors.acessibilidade && (
                <p id="acessibilidade-error" className="text-sm text-destructive mt-1">
                  {errors.acessibilidade}
                </p>
              )}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {left} {left === 1 ? "vaga restante" : "vagas restantes"}
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-4 bg-foreground text-background font-display text-sm tracking-[0.25em] uppercase hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
              >
                {submitting ? "Enviando..." : "Confirmar inscrição"}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
  autoComplete,
  error,
  maxLength,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  maxLength?: number;
  inputMode?: "text" | "tel" | "email" | "numeric" | "url" | "search" | "none" | "decimal";
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${id}-error`;
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-display tracking-[0.25em] uppercase text-foreground"
      >
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        inputMode={inputMode}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={error ? errorId : undefined}
        className={`mt-2 w-full bg-background border px-4 py-3 text-sm focus:outline-none transition-colors ${
          error
            ? "border-destructive focus:border-destructive"
            : "border-input focus:border-accent"
        }`}
      />
      {error && (
        <p id={errorId} className="text-sm text-destructive mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
