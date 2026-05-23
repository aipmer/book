[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.05) ](./ch05_agents_protocol.md) | [ ➡️ Next (Ch.07) ](./ch07_desktop_computer_use.md)

# Ch.06 Correcting Course: Supervising the CoT Reasoning Chain Like a Tech Lead

Reasoning models plan their tasks through Chain of Thought (CoT). By monitoring CoT logs, you can spot logical errors and intervene before the agent runs into loops.

---

## 6.1 Inspecting CoT Logs in Real-time

Expose the internal draft logic using:
```bash
codex --verbose --show-cot
```

### Log Telemetry Example:
```text
[Thinking Process]
- Checking src/lib/redis.ts...
- Found `redis = new Redis()` without retryStrategy.
- Hangups violate 3s timeout constraint.
- Solution: Add custom retryStrategy.
```

---

## 6.2 Spotting AI Failure Loops

Watch for these red flags:
1.  **Dependency Loop**: AI installs packages, fails due to peer conflict, tries to force-install, fails, and switches to another package in an infinite loop.
2.  **Regression Loop**: AI edits A, breaking test B; edits B to fix it, breaking C; edits C, breaking A again.

---

## 6.3 Intervention: Stop, Refine, and Rollback

### Step 1: Interrupt (`Ctrl + C` or `stop`)
Freezes the sandbox state.

### Step 2: Refine (`refine`)
Redirect the agent's logic:
```bash
codex refine "Do not install axios-retry. Use native AbortController instead."
```

### Step 3: Rollback
If the code is corrupted, revert using git:
```bash
git checkout -- src/lib/redis.ts
```
Add a constraint in `AGENTS.md` to prevent similar actions.

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.05) ](./ch05_agents_protocol.md) | [ ➡️ Next (Ch.07) ](./ch07_desktop_computer_use.md)
