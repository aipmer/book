[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.05) ](./ch05_agents_protocol.md) | [ ➡️ Next (Ch.07) ](./ch07_desktop_computer_use.md)

# Ch.06 Correcting Course: Supervising the CoT Reasoning Chain Like a Tech Lead

In traditional software development, when hiring a junior programmer, your biggest fear is not that they won't write code. Rather, it is that they will secretly work in isolation and ultimately hand you a pile of code that completely deviates from the business requirements, or worse, crashes the system.

This same challenge exists when using Codex driven by reasoning models (o-series / GPT-5.5). Although the AI possesses powerful reasoning capabilities, if its initial assumptions are incorrect, it will sprint down the wrong logical path and can even get stuck in an infinite "self-correction" loop.

This chapter teaches you how to look inside Codex's **Chain of Thought (CoT)** so you can intervene like a seasoned tech lead when the agent starts going off course.

---

## 6.1 Why Look Inside CoT (Chain of Thought)?

The biggest difference between reasoning models and standard LLMs (like GPT-4o) is that before outputting final code, the reasoning model "drafts" its reasoning and simulates the execution internally. This draft process is the Chain of Thought (CoT).

```text
[User Request] ──> 1. Parse Goal & Constraints ──> 2. Plan Steps ──> 3. Run Tests ──> 4. Self-Correct ──> [Final Output]
                     └──────(Displayed in terminal as CoT Logs, your supervisor viewport)──────┘
```

If you only inspect the final output, you are limited to a passive role. If you monitor the CoT logs in real-time, you can detect logical errors at step 2 or 3 and intervene early, avoiding wasted API tokens and time.

---

## 6.2 How to View and Interpret Codex's Real-Time CoT Logs

When running Codex, you can print its internal thinking process directly to the console by appending debugging flags to the CLI command:

```bash
# Start Codex and print detailed thinking process logs
codex --verbose --show-cot
```

### Real-Time Logs Viewport Example
When Codex receives a task like "Fix connection timeout in the Redis rate limiter," the console will output a thought flow similar to this:

```text
[Thinking Process]
- User wants to fix Redis rate limiter connection timeout.
- Checking existing implementation in src/lib/redis.ts...
- I see `redis = new Redis()` without retryStrategy.
- If Redis is down, it hangs the Express app. This violates the 3000ms timeout constraint in AGENTS.md.
- Plan:
  1. Add `maxRetriesPerRequest: null` and `enableReadyCheck: false`.
  2. Implement custom retryStrategy up to 3 times.
  3. Write mock connection test to verify.
```

---

## 6.3 Identifying Typical AI "Infinite Loops"

From my hands-on experience running "Real-World Product Talk", I have identified three common infinite loops that AI gets trapped in. If you see these signs in the CoT, you must intervene immediately:

### 1. The Dependency Loop (Infinite `npm install`)
*   **Symptom**: The AI attempts to use a new library, fails during installation, decides in the CoT to try another version, fails again, and then tries installing another similar package.
*   **CoT Indicators**: `Error: Cannot resolve dependency ... Running npm install --legacy-peer-deps ...` repeating more than 3 times.

### 2. The Regression Loop (Self-Destructive Code Refactoring)
*   **Symptom**: The AI edits file A, causing unit test B to fail; it modifies test B, which leads to module C throwing errors; it edits C, which breaks file A again.
*   **CoT Indicators**: The AI constantly bounces back and forth between two or three files, and the test pass rate fluctuates repeatedly between 80% and 90%.

---

## 6.4 The Three-Step Intervention: Interruption, Correction, and Rollback

When you find the AI going off track or caught in a loop, do not just sit back. Intervene using these steps:

### Step 1: Interrupt (`Ctrl + C` or `stop`)
Press `Ctrl + C` directly in the terminal or enter `stop`. This immediately freezes Codex's sandbox state, preventing it from consuming further tokens.

### Step 2: Refine (`refine`)
After interrupting, Codex will enter an interactive command prompt mode. You can use the `refine` command to point out the logical blind spot directly:

```bash
# Point-to-point correction command
codex refine "You just attempted to install axios-retry. This project prohibits installing any third-party HTTP libraries. Use native AbortController to implement timeout retries instead."
```

### Step 3: Rollback and Add Safeguards
If the AI has already altered the codebase beyond recognition, do not let it attempt to fix it. Roll back using git and append a hard rule to `AGENTS.md`:

```bash
# Revert the AI's erroneous modifications
git checkout -- src/lib/redis.ts
```

Then append this to [AGENTS.md](../AGENTS.md):
```markdown
- Do not introduce external retry helper libraries for basic network timeout issues.
```

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.05) ](./ch05_agents_protocol.md) | [ ➡️ Next (Ch.07) ](./ch07_desktop_computer_use.md)
