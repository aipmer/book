# Ch.13 Frontier Watch: The 2026 Codex Ecosystem Overhaul

> 🚀 **"Tools get a blood transfusion every quarter; your mental models are the only moat. This chapter is not a news digest — it's a migration battle map: which old commands are dead, and which new capabilities must take over your workflow today."**

The first twelve chapters built a version-independent orchestration methodology. But methodology must land on real tooling. In 2026, the Codex ecosystem went through four structural shifts: **the desktop merger, the model transition, the maturing plugin economy, and security becoming its own product line**. This chapter breaks down each shift with concrete migration commands and configurations.

---

## 13.1 The Desktop Merger: Codex App Folds into the ChatGPT Client

In July 2026, the standalone Codex desktop app was retired. All of its capabilities moved into the **ChatGPT desktop client** as a dedicated "Codex Code Mode," available to Free, Plus, and Enterprise users.

**Migration steps:**

```bash
# macOS: download ChatGPT.dmg and drag it into Applications
# Windows: install via winget
winget install OpenAI.ChatGPT
```

After signing in, click the **Codex** tab in the left sidebar to enter Code Mode. Two caveats:

1. **Account vs. API Key**: Signing in with a ChatGPT account unlocks the full feature set (cloud tasks, cross-device sync, Computer Use); an API key grants only basic local coding.
2. **Standalone components are unaffected**: the Codex CLI, the VS Code extension, and Codex Cloud continue to evolve independently. The multi-surface matrix from Ch.02 still holds — the "desktop app" cell is simply replaced by the ChatGPT client.

**New capabilities at a glance:**
- Upgraded built-in browser: search browsing history from the address bar; the Chrome extension can reference open tabs.
- **Multi-repo Review**: multi-folder projects show changed lines across all repositories in one review view — no more tab-hopping between diffs.
- **Sites**: create, deploy, and manage hosted web projects directly in the client, with Annotations for in-place "point and edit" workflows.

---

## 13.2 The Model Transition: GPT-5.6 Terra and Luna Take Over

As of August 31, 2026, `GPT-5.4` and `GPT-5.4 mini` are retired from Codex for ChatGPT-authenticated sessions. The official replacements:

| Retired model | Successor | Role |
| --- | --- | --- |
| `gpt-5.4` | `gpt-5.6-terra` (GPT-5.6 Terra) | Primary deep-reasoning model |
| `gpt-5.4-mini` | `gpt-5.6-luna` (GPT-5.6 Luna) | Lightweight fast model (Guardian approvals, etc.) |

**Migration checklist:**

```bash
# 1. Audit your configs for hard-coded legacy models
grep -rn "gpt-5.4" ~/.codex/config.toml .

# 2. Explicitly upgrade the default model in config.toml
```

```toml
# ~/.codex/config.toml
model = "gpt-5.6-terra"
# Lightweight background duties (e.g. auto-review) can be pinned separately
[profiles.guardian]
model = "gpt-5.6-luna"
```

> ⚠️ **Note**: API-key-authenticated sessions may continue calling the GPT-5.4 family, but ChatGPT sign-in sessions must switch. Audit every Automation, workspace default, and custom agent.

---

## 13.3 CLI 0.14x: The Breaking Changes You Must Know

The Codex CLI is now in the `0.14x` era (latest stable: `0.147.0` as of August 2026). These changes directly affect every command example earlier in this book:

```bash
npm install -g @openai/codex@latest
```

### 1. `--full-auto` Is Officially Removed

```bash
# ❌ Old syntax (now errors out)
codex exec --full-auto "fix all lint errors"

# ✅ New syntax: express autonomy via sandbox mode
codex exec --sandbox workspace-write "fix all lint errors"
```

### 2. The Hooks Engine Graduates to Stable

The interception layer from Ch.05 is now a first-class citizen. Configure `SessionStart` / `Stop` hooks inline in `config.toml`; hooks can observe MCP tool calls, `apply_patch`, and long-running Bash sessions:

```toml
# ~/.codex/config.toml
[hooks]
session_start = "bash scripts/bootstrap-env.sh"
stop = "npm run lint --silent"
```

### 3. Agent Plugins and Marketplaces

The plugin system is now production-grade, with local, personal, workspace, and remote catalogs — including third-party marketplaces for Amazon Bedrock and Claude Code:

```bash
# Unified plugin management entry point
codex plugin list
codex plugin marketplace add https://plugins.example.com/catalog.json
codex plugin install security-workbench
```

Mention a plugin in chat with `@plugin` to auto-inject its context (MCP / App / Skill).

### 4. Subagents and Multi-Agent Orchestration

The CLI natively spawns subagents with independent context windows, slicing large efforts into parallel pipelines:

```text
> Spawn two subagents: one adds integration tests for src/api,
  another refactors state management in src/hooks in parallel.
  Aggregate the diffs for my review at the end.
```

Combined with `git worktree` isolation, multiple agents work in parallel without polluting each other — the official realization of Ch.04's goal-driven philosophy.

### 5. Guardian Auto-Approval and `--approve-for-me`

Human confirmation is no longer the only path for high-risk operations. The new `--approve-for-me` flag routes approval requests to a Guardian subagent (powered by GPT-5.6 Luna): in-policy actions pass automatically; violations are blocked with reasons:

```bash
codex --approve-for-me "upgrade dependencies and make tests pass"
```

This complements Ch.08's mobile approval gateway: Guardian handles the low-risk queue; only genuinely dangerous operations reach your phone.

### 6. The MCP 2026-07-28 Protocol

Paginated discovery, multi-round requests, and non-blocking server startup are now supported. Legacy `.mcp.json` configs remain compatible, but new MCP servers should target the 2026-07-28 spec.

---

## 13.4 The Skills Economy: Compounding Repeated Workflows into Assets

If AGENTS.md is a project's "constitutional law," **Skills are the "standard operating procedures" for specific task types**: PR review, Feishu doc grooming, PPT generation, CI repair, security scanning. Any workflow repeated three times or more deserves to become a Skill.

```text
# Standard Skill layout (under ~/.codex/skills/ or inside a plugin package)
skills/
└── pr-review/
    └── SKILL.md      # a procedural manual with YAML frontmatter
```

Skills ship with plugins to marketplaces for uniform team installation. This delivers on Ch.05's promise of cross-project reuse: the protocol constrains behavior; the Skill freezes the procedure.

---

## 13.5 Codex Security and Daybreak: Security Becomes a Product Line

In August 2026, OpenAI introduced the two-tier **Daybreak** access system for defenders:

- **Daybreak Blue**: general-purpose models (GPT-5.6 Sol) for vulnerability discovery, secure code review, detection engineering, incident response, malware analysis, and patch validation — start here for most defensive work.
- **Daybreak Red**: purpose-trained models (GPT-5.6 Cyber) for explicitly authorized vulnerability reproduction, exploit validation, penetration testing, and red teaming; requires separate approval and provisioning.

Together with the **Codex Security plugin and CLI**, security workflows are fully productized:

```bash
# Run a deep scan in the workbench
codex plugin install codex-security
# Or run bulk scans in CI
codex-security scan --deep --report sarif > results.sarif
```

Operational red lines (continuous with Ch.05's sandbox boundaries):

1. Work in an **isolated environment** with an explicitly defined engagement scope.
2. Use least-privilege permission profiles.
3. Configure **Auto-review** for actions that cross the sandbox boundary, so Guardian reviews them first.

---

## 13.6 Migration Checklist (TL;DR)

```bash
# ① Desktop: retire the old Codex App, install the ChatGPT client
winget install OpenAI.ChatGPT        # Windows
# macOS: download ChatGPT.dmg

# ② Upgrade the CLI to 0.147.0+
npm install -g @openai/codex@latest

# ③ Switch models to the GPT-5.6 family (before August 31)
grep -rn "gpt-5.4" ~/.codex/ .       # full audit

# ④ Replace the removed --full-auto flag
codex exec --sandbox workspace-write "<task>"

# ⑤ Enable Guardian auto-approval
codex --approve-for-me "<task>"

# ⑥ Install plugin marketplaces and the security plugin
codex plugin marketplace add <catalog-url>
codex plugin install codex-security
```

---

## 13.7 The Constants That Survive Every Version

The tooling lesson is singular: **every version number, CLI flag, and model codename hard-coded into scripts is technical debt**. Centralize them in `config.toml` and `AGENTS.md`, so migration cost collapses to "edit one line."

And the three principles that outlive every release cycle are exactly what this book keeps hammering: drive by goals, not steps; set boundaries before granting trust; divide labor between human and AI — never let the AI lead the human. Tools change blood; your mindset compounds.
