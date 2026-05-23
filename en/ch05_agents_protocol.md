[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.04) ](./ch04_goal_driven.md) | [ ➡️ Next (Ch.06) ](./ch06_reasoning_steer.md)

# Ch.05 Defining the CAP Protocol: Building Your Project's AGENTS.md Rule Compliance Layer

In the product development process, one of the most frustrating scenarios is fixing one bug only to introduce three new ones, or coding a new feature while completely disregarding the team's established coding standards.

In human-machine collaborative development, if Codex is left without boundary constraints, it too can become an overly eager and "destructive" employee. To place a tight rein on it, we need to establish an **`AGENTS.md`** file in the project root.

This is our **"agent collaboration constitution" (Codex Collaboration Protocol, CAP)**.

---

## 5.1 Why Do We Need `AGENTS.md`?

While many developers in the Claude Code ecosystem use `CLAUDE.md`, in our Codex framework, we name it `AGENTS.md`. Its core value lies in:
1.  **Immediate Context Restore**: Every time Codex starts, its first action is scanning the `AGENTS.md` file in the root directory. It instantly picks up the project's tech stack, directory structure, and collaboration constraints, eliminating the need for you to repeat instructions in chat.
2.  **Anti-Corruption Layer**: It explicitly defines which directories and files are "read-only/off-limits," preventing Codex from unilaterally refactoring critical security modules (e.g., authentication, database schema).
3.  **Command Execution Guardrails**: It specifies permissible test and deployment command options, avoiding the execution of destructive scripts by the AI.

---

## 5.2 The Four Core Sections of `AGENTS.md`

```markdown
# Project Fingerprint
- Tells the AI what kind of project this is and its core tech stack.

# Developer Commands
- Explicitly states the command lines for building, testing, and running database migrations.

# Styles & Architecture Patterns
- Dictates where files should be placed, size limits, and design patterns to use.

# Agent Boundary & Hard Rules
- Defines absolute forbidden paths. If touched, Codex must abort and ask for human verification.
```

---

## 5.3 Practice: A Production-Grade `AGENTS.md` Template

Here is a typical `AGENTS.md` specification for a full-stack SaaS project:

```markdown
# 🤖 Project: Aurora SaaS Core (AGENTS.md)

## 🧬 Project Fingerprint
- **Stack**: Next.js 15 (App Router), TypeScript, Prisma ORM, TailwindCSS.
- **Database**: PostgreSQL on Supabase.
- **Auth**: Next-Auth v5.

## 💻 Developer Commands
- **Install**: `npm install` (Only run if package.json has changed)
- **Dev Server**: `npm run dev`
- **Lint Code**: `npm run lint`
- **Run Tests**: `npm run test`
- **DB Migration**: `npx prisma migrate dev` (Never run in production branch)

## 🎨 Styles & Architecture Patterns
- **Directory Structure**:
  - Components: Keep UI components inside `@/components/ui/` (Shadcn styled).
  - Business Logic: Custom React hooks must go to `@/hooks/`.
  - API Routes: Next.js Route Handlers go to `src/app/api/.../route.ts`.
- **Formatting**:
  - Keep components modular. If a component exceeds 200 lines, decompose it.
  - All API routes must implement Zod schema validation for request body.
  - Return HTTP 400 for validation errors, 500 for internal uncaught errors.

## 🛑 Agent Boundary & Hard Rules
- **READ-ONLY Directories**: 
  - Never modify files inside `src/app/api/auth/[...nextauth]` (OAuth Core).
  - Never alter `prisma/schema.prisma` without explicit human confirmation.
- **PR Rules**:
  - Before declaring a feature complete, run `npm run test` and `npm run lint`.
  - If tests fail, rollback the change immediately and report the error logs.
- **Security Check**:
  - Never commit raw `.env` files or API Keys. Use environment variables.
```

---

## 5.4 Founders' Advice: Making Constraints Actually Stick

In Codex, `AGENTS.md` is loaded by default and injected directly into the system context.

When you (or Codex itself) execute a task that deviates from the rules defined in `AGENTS.md`, Codex's telemetry mechanism will trigger a hard warning, pausing the current step and sending you an interruption confirmation:

```bash
⚠️ [Warning] Codex attempts to edit src/app/api/auth/[...nextauth]/route.ts.
This path is flagged as READ-ONLY in AGENTS.md.
Do you want to override this rule? (y/N)
```

With this layer of protection, you can confidently delegate large blocks of business logic implementation to Codex without having to constantly worry about whether it broke the underlying security layers.

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.04) ](./ch04_goal_driven.md) | [ ➡️ Next (Ch.06) ](./ch06_reasoning_steer.md)
