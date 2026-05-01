## Objetivo

Permitir que o administrador defina, no painel **Área Restrita**, a **quantidade total de vagas** da conferência. O formulário público de inscrição passa a respeitar esse limite: ao atingir o teto, novas inscrições são bloqueadas com aviso claro de "Vagas esgotadas".

Como ainda não há backend, a configuração e a contagem de inscrições serão persistidas em `localStorage` (compartilhado entre páginas no mesmo navegador), suficiente para a demonstração visual atual. A migração para Supabase fica preparada para a próxima rodada.

## Escopo

- [x] Já existe: `CONFERENCE.totalSeats` fixo em `site.ts`, `seatsLeft()` derivado, bloqueio "soldOut" no formulário
- [ ] Criar: store simples de configuração + contagem (localStorage)
- [ ] Criar: card "Controle de vagas" no painel `/admin/cadastros` (editar limite, ver ocupação)
- [ ] Atualizar: `/inscricao` para ler limite/contagem dinâmicos e bloquear ao esgotar
- [ ] Validar: no submit, recheckar limite antes de aceitar (proteção contra corrida)

## Passo a passo

### 1. Store de vagas (novo arquivo)
Criar `src/lib/vagas-store.ts` com:
- Chaves em `localStorage`:
  - `maranata.vagas.limite` (number) — capacidade total
  - `maranata.vagas.inscritos` (number) — contador de inscrições confirmadas pelo formulário público
- Funções utilitárias:
  - `getLimite()` / `setLimite(n)` — limite com fallback para `CONFERENCE.totalSeats`
  - `getInscritos()` / `incrementInscritos()` — contador com fallback para `CONFERENCE.takenSeats`
  - `getVagasRestantes()` = `max(0, limite - inscritos)`
  - `isEsgotado()` = `getVagasRestantes() === 0`
- Hook `useVagas()` — escuta evento `storage` + um `CustomEvent("vagas:update")` para refletir mudanças em tempo real entre o painel e a página de inscrição (mesma aba).
- Validação zod do limite: inteiro ≥ 0 e ≥ número atual de inscritos (não permite definir limite menor que o já inscrito).

### 2. Painel admin: card "Controle de vagas"
No topo de `src/pages/admin/Cadastros.tsx`, acima da tabela, adicionar um card com:
- **Indicadores** (3 números): Limite total · Inscritos · Vagas restantes.
- **Barra de ocupação** (largura proporcional, muda de cor quando ≥ 90%).
- **Formulário inline** com:
  - Campo numérico "Limite de vagas" (mín = inscritos atuais, sem máximo arbitrário).
  - Botão "Salvar limite" → chama `setLimite()`, dispara evento, mostra `toast.success`.
  - Erro acessível (`aria-invalid`, `role="alert"`) se o valor for inválido.
- **Indicador de status**: badge "Inscrições abertas" (verde/accent) ou "Esgotado" (destrutivo).

Observação: o número de inscritos exibido virá da store; o `MOCK_CADASTROS` continua alimentando a tabela apenas como demonstração visual e não conta para o limite (para evitar conflito entre dado fictício e dado real do contador).

### 3. Página `/inscricao`: respeitar o limite dinâmico
Em `src/pages/Inscricao.tsx`:
- Substituir `seatsLeft()` por `useVagas()` para reagir a mudanças do painel sem reload.
- Manter o bloco "Vagas esgotadas" já existente, agora alimentado pelo estado dinâmico.
- No `handleSubmit`, **antes de marcar `submitted`**, rechecar `isEsgotado()`. Se passou a esgotar entre o carregamento e o envio, mostrar `toast.error("As vagas se esgotaram durante o preenchimento")` e renderizar o estado de esgotado.
- Ao submeter com sucesso, chamar `incrementInscritos()` para refletir a nova vaga ocupada no painel.
- Atualizar o texto "X vagas restantes" para usar o valor dinâmico.

### 4. Ajustes em `site.ts`
- Manter `CONFERENCE.totalSeats` e `takenSeats` apenas como **valores iniciais (seeds)** quando o `localStorage` está vazio.
- Marcar `seatsLeft()` como deprecado (manter para compatibilidade, mas o app passa a usar a store).

## Detalhes técnicos

- **Persistência**: `localStorage` (não `sessionStorage`) para sobreviver a fechamentos do navegador. Sincronização entre abas via evento nativo `storage`; sincronização entre páginas na mesma aba via `CustomEvent("vagas:update")` disparado pelas funções de escrita.
- **Validação do limite**:
  - `z.coerce.number().int().min(0)`
  - Regra extra (refinement): `novoLimite >= inscritos` — caso contrário, erro "O limite não pode ser menor que o número atual de inscritos (X)".
- **Acessibilidade**: o card de controle reaproveita o padrão já existente (label vinculado por `htmlFor`, `aria-invalid`, `aria-describedby`, mensagens com `role="alert"`).
- **UX**:
  - Confirmação visual via `sonner` toast ao salvar.
  - Botão "Resetar contador" pequeno e secundário no painel, com `confirm()` nativo, para limpar o `inscritos` (útil em demo).
  - Quando esgotado, botão de submit do formulário público fica oculto (já existe esse estado).
- **Sem backend**: nenhuma chamada a Supabase. Quando o backend entrar, basta substituir as funções `getLimite/setLimite/getInscritos/increment` por chamadas a uma tabela `conferencia_config` + contagem real de `inscricoes`.

## Estrutura de arquivos

```text
src/
  lib/
    vagas-store.ts        (novo — store + hook useVagas)
    site.ts               (ajuste mínimo — comentários sobre seeds)
  pages/
    admin/
      Cadastros.tsx       (editar — adicionar card "Controle de vagas")
    Inscricao.tsx         (editar — usar useVagas + recheck no submit + increment)
```

## Diagrama do fluxo

```text
┌─────────────────────┐        write        ┌──────────────────┐
│  /admin/cadastros   │ ─────────────────▶  │   localStorage   │
│  (define limite)    │                     │  vagas.limite    │
└─────────────────────┘                     │  vagas.inscritos │
                                            └──────────────────┘
                                                     ▲ │
                                                     │ │ read + subscribe
                                                     │ ▼
┌─────────────────────┐    increment ao    ┌──────────────────┐
│   /inscricao        │ ─── submeter ───▶  │  useVagas() hook │
│   (form público)    │                    │  (live updates)  │
└─────────────────────┘                    └──────────────────┘
```

## Não incluído nesta rodada

- Persistência real em banco de dados (fica para a rodada de Lovable Cloud + Supabase).
- Lista de espera quando esgotado.
- Histórico de alterações do limite.
- Reserva temporária de vaga durante o preenchimento (evita corridas reais entre múltiplos usuários).
