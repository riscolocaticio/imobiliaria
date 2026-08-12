# Plataforma de Risco Locatício — Monorepo

## Escopo de Leitura

> **Instrução para o Claude:** Ao trabalhar em qualquer projeto deste repositório, leia **apenas** este arquivo e o `CLAUDE.md` do projeto específico onde está atuando (`api/CLAUDE.md` ou `web/CLAUDE.md`). Não explore o outro projeto, não leia `package.json`, `tsconfig` ou arquivos de configuração — tudo que precisa saber está nos `CLAUDE.md`. Só acesse outros arquivos quando o usuário pedir explicitamente ou quando for necessário ler/editar código.

## Sobre o produto

Plataforma colaborativa para imobiliárias consultarem, inserirem e excluírem registros de
ocorrências locatícias anteriores (inadimplência, abandono do imóvel, depredação, multa
contratual, descumprimento contratual, outros), usando o CPF do inquilino como chave. O
conceito funcional completo está em [`docs/CONCEITO-PLATAFORMA.md`](docs/CONCEITO-PLATAFORMA.md).

Princípio central: dado mínimo necessário. Sem score, sem cadastro completo de inquilino,
sem aprovação automática — a decisão final é sempre da imobiliária.

## Estrutura do Repositório

```
imobiliaria/
├── api/    # Backend (NestJS 11 + REST/Swagger + Prisma + PostgreSQL)
└── web/    # Frontend (Next.js + React 18 + Tailwind 3 + TanStack Query)
```

## Portas de Cada Serviço

| Serviço | Porta App | Porta DB (host)   |
| ------- | --------- | ------------------ |
| api     | 9010      | 5443 (PostgreSQL)  |
| web     | 8010      | —                   |

## Tecnologias Comuns

- **Linguagem:** TypeScript em todos os projetos
- **Package Manager:** npm
- **ORM:** Prisma
- **Auth:** JWT + Passport
- **Validação:** class-validator (backend), Zod (frontend)
- **Formulários (front):** react-hook-form
- **State/Cache (front):** TanStack React Query
- **HTTP client (front):** Axios

## Comunicação

> **CRÍTICO — Claude deve seguir obrigatoriamente:**
>
> - **Responder e funcionar sempre em Português do Brasil (PT-BR)**, independentemente do idioma usado na mensagem do usuário.
> - **Não explique o que está fazendo.** Execute diretamente.
> - **Não narre o processo.** Sem "vou fazer X", "agora farei Y", "como solicitado...".
> - **Pergunte apenas se houver ambiguidade real** que impeça a execução.
> - **Ao terminar:** mande apenas o que mudou + um resumo. Nada mais.

## Convenções Globais

- Nunca usar `any` explícito em TypeScript
- Nunca usar `console.log` sem que seja solicitado
- Variáveis de ambiente sempre via `.env` (nunca hardcoded)
- Package manager: sempre `npm`
- Commits seguem Conventional Commits
- Cada registro de ocorrência é **soft delete** (nunca apagar linha do banco) — retenção e rastreabilidade são requisito do produto, não opcional
- Toda ação sensível (login, consulta por CPF, inserção, exclusão) deve gravar `AuditLog`

## Contextos Específicos

Para detalhes de cada projeto, leia o `CLAUDE.md` dentro do diretório correspondente
(`api/CLAUDE.md`, `web/CLAUDE.md`).
