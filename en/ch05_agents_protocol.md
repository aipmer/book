[ 🏠 Index ](/en/) | [ ⬅️ Prev (Ch.04) ](./ch04_goal_driven.md) | [ ➡️ Next (Ch.06) ](./ch06_reasoning_steer.md) | [ 🌐 中文版 ](../chapters/ch05_agents_protocol.md)

# Ch.05 Defining the CAP Protocol: Building Your Project's AGENTS.md Rule Compliance Layer

> 🎯 **The Real Problem**: Fixing 1 bug creates 3 new bugs, infinite 10-retry loop spins that drain budgets, unwanted heavy npm packages, and lazy fake `TODO` stubs.  
> 💡 **Tangible Output & Takeaway**: Production-grade `AGENTS.md` project rules template, 2-retry hard circuit breaker, and zero-placeholder engineering boundaries.  
> ⚡ **Viral Screenshot Quote**: *"An unconstrained AI is a runaway horse. An AGENTS.md rulebook forces models to respect architecture like a principal engineer."*

In the product development process, one of the most frustrating scenarios is fixing one bug only to introduce three new ones, or coding a new feature while completely disregarding the team's established coding standards.

In human-machine collaborative development, if Codex is left without boundary constraints, it too can become an overly eager and "destructive" employee. To place a tight rein on it, we need to establish an **`AGENTS.md`** file in the project root.

This is our **"agent collaboration constitution" (Codex Collaboration Protocol, CAP)**.

---

## 🎯 Intuitive Metaphor: The New Employee Onboarding Handbook & Safety Code

Think of Codex as a brilliant, hyper-energetic new intern on their first day:

```Plaintext
【Without AGENTS.md】 ──> The intern arrives with no rulebook. To fix a minor frontend alignment bug,
                          they casually rewrite your 3-year-old core authentication module into an esoteric syntax,
                          crashing production upon release.
【With AGENTS.md】    ──> The intern sits at their desk and reads the team's printed handbook:
                          - "This is Next.js 15 with Tailwind" (Explicit stack)
                          - "Build with `npm run build`, never alter standard scripts" (Normalized operations)
                          - "DO NOT touch the auth/ directory under any circumstance" (Absolute red lines)
                          The intern immediately grasps the boundaries and operates with peak efficiency without breaking a thing.
```

`AGENTS.md` is that zero-friction onboarding manual for AI agents.

---

## 🚀 Beginner Quickstart: 3 Steps to Launch

Create your project's first compliance rulebook in 3 minutes:

1. **Step 1: Create the File in Your Project Root**  
   Run in your terminal:
   ```bash
   touch AGENTS.md
   ```
2. **Step 2: Paste the 4-Section Minimal Scaffold**  
   Save the following into `AGENTS.md`:
   ```markdown
   # 🤖 Codex Collaboration Protocol

   ## 📌 Project Fingerprint
   - Stack: Next.js 15, TypeScript, Tailwind CSS

   ## 💻 Developer Commands
   - Build: `npm run build`
   - Test: `npm run test`

   ## 🛑 Hard Constraints
   - Never update package.json dependencies without human confirmation.
   - Never touch files inside `src/legacy/`.
   - Always run `npm run build` before completing the task.
   ```
3. **Step 3: Launch Codex to Verify Protocol Loading**  
   Run `codex`; the initialization logs will confirm that workspace rules have been loaded.

---

## 5.1 Why Do We Need `AGENTS.md`?

**`AGENTS.md` is OpenAI Codex's official instruction specification file**. When starting up, Codex scans and merges configurations hierarchically:

1. `~/.codex/AGENTS.override.md` (Highest priority, user overrides)
2. `~/.codex/AGENTS.md` (Global user instructions)
3. Project root `AGENTS.md` (Team standard)
4. Current directory `AGENTS.md` (Specific workspace scope)

Its core value lies in:
1. **Immediate Context Restore**: Every time Codex starts, its first action is scanning `AGENTS.md`, instantly picking up the project's tech stack, directory structure, and collaboration constraints.
2. **Anti-Corruption Layer**: It explicitly defines which directories and files are "read-only/off-limits," preventing Codex from unilaterally refactoring critical security modules.
3. **Command Execution Guardrails**: It specifies permissible test and deployment command options, avoiding destructive shell commands.

---

## 5.2 The Four Core Sections of `AGENTS.md`

```Plaintext
# Project Fingerprint
- Tells the AI what kind of project this is and its core tech stack.

# Developer Commands
- Explicitly states the command lines for building, testing, and running migrations.

# Styles & Architecture Patterns
- Dictates where files should be placed, size limits, and design patterns.

# Agent Boundary & Hard Rules
- Defines absolute forbidden paths. If touched, Codex must abort and ask for human verification.
```

---

## 5.3 Practice: A Production-Grade `AGENTS.md` Template

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

## 5.4 Dual Defense: Soft Constraints vs. Hard Enforcements

Rules in `AGENTS.md` are natural language directives—models like GPT-5.6 Terra respect them with high fidelity, but they are "soft constraints."

To guarantee physical guardrails that cannot be breached, combine with Codex 0.14x runtime controls:

1. **Sandbox Mode**: Enforce `--sandbox workspace-write` to confine edits within the project workspace at the OS container level.
2. **Guardian Approvals**: Pass `--approve-for-me` to let Guardian evaluate policy violations automatically.
3. **Hooks Engine**: Configure `[hooks]` in `~/.codex/config.toml` to execute pre/post test scripts on file writes.

```toml
# ~/.codex/config.toml
model = "gpt-5.6-terra"

[hooks]
stop = "npm run lint --silent"
```

**"AGENTS.md Soft Specs + Sandboxes & Hooks Hard Fences"** creates the ultimate anti-corruption moat.

---

## 🛡️ Troubleshooting & Pitfall Cheat Sheet

| Symptom | Root Cause | Instant Fix |
| :--- | :--- | :--- |
| **Agent occasionally breaks rules despite being written** | Rules too long, contradictory, or buried in verbose prose | Keep rules concise and prefer negative constraints ("Never do X"); elevate to Hooks/Sandbox |
| **AI falls into a 5-attempt self-correction death loop** | Missing Anti-Loop circuit breaker in instructions | Add to AGENTS.md: "Stop immediately after 2 consecutive failed attempts and report root causes" |
| **Agent installs arbitrary unfamiliar npm packages** | Package managers allowed without gating | Mandate in Hard Rules: "Never run `npm install` for new dependencies without human consent" |

---

[ 🏠 Index ](/en/) | [ ⬅️ Prev (Ch.04) ](./ch04_goal_driven.md) | [ ➡️ Next (Ch.06) ](./ch06_reasoning_steer.md) | [ 🌐 中文版 ](../chapters/ch05_agents_protocol.md)
