[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.04) ](./ch04_goal_driven.md) | [ ➡️ Next (Ch.06) ](./ch06_reasoning_steer.md)

# Ch.05 Defining the CAP Protocol: Building Your Project's AGENTS.md Rule Compliance Layer

Without clear boundaries, autonomous agents can become overly creative, rewriting legacy modules and breaking coding styles.

To maintain code hygiene, we establish `AGENTS.md` in the project root as our **Codex Collaboration Protocol (CAP)**.

---

## 5.1 Why AGENTS.md?
1.  **Context Restore**: Restores the tech stack, rules, and commands automatically on every startup.
2.  **Anti-Corruption**: Segregates editable domains from read-only core scripts.
3.  **Command Safety**: Constraints testing and deployment pipelines to avoid dangerous command execution.

---

## 5.2 AGENTS.md Structure

```markdown
# Project Fingerprint
- Explains active frameworks, directories, and tech stacks.

# Developer Commands
- Defines valid scripts for building, testing, and db migrations.

# Styles & Architecture Patterns
- Lists coding standards (e.g. Hooks in @/hooks, UI in @/components/ui).

# Agent Boundary & Hard Rules
- Defines read-only paths and required checks before PR creation.
```

---

## 5.3 A Production-Grade AGENTS.md Template

Find our reference template directly on the home page: [AGENTS.md](file:///Users/hunkwu/Desktop/ai/book/AGENTS.md).

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.04) ](./ch04_goal_driven.md) | [ ➡️ Next (Ch.06) ](./ch06_reasoning_steer.md)
