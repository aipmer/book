[ 🏠 Index ](/en/) | [ ⬅️ Prev (Ch.03) ](./ch03_sandbox.md) | [ ➡️ Next (Ch.05) ](./ch05_agents_protocol.md) | [ 🌐 中文版 ](../chapters/ch04_goal_driven.md)

# Ch.04 Goal-Driven Engineering: Taming Reasoning Agents with Boundaries and Assertions

> 🎯 **The Real Problem**: Overly verbose prompts micromanage models like dictating every cut to a chef, while vague prompts invite hallucinations and regression bugs.  
> 💡 **Tangible Output & Takeaway**: Standard goal-driven specification template (Goal + Preconditions + Output Assertions + Prohibited Actions) and real benchmark comparisons.  
> ⚡ **Viral Screenshot Quote**: *"Micromanaging a chef burns the dinner. Define strict input-output assertions and let the agent engineer the solution."*

In the era of Codex, powered by deep reasoning models like **GPT-5.6 Terra**, traditional step-by-step prompt engineering has become counterproductive. Reasoning models possess immense internal planning space; over-specifying execution steps only handcuffs their ability to self-correct.

This chapter shares how to guide Codex using a professional "Product Specs" approach in actual development.

---

## 🎯 Intuitive Metaphor: Michelin Chef and the Order Ticket

Many people dispatch tasks to AI like an unruly customer barging into a Michelin kitchen:

```Plaintext
【Babysitting Commands (Process-Driven)】 ──> ❌ "Chef, take the knife in your left hand, chop potatoes into 2mm strips, heat the oil to 180°C, stir for 3 minutes, then add 3g salt."
                                              (The chef feels insulted, and if stove pressure shifts slightly, the dish burns.)
【Architect Spec Order (Goal-Driven)】   ──> ✅ "Chef, I need pan-seared crispy potatoes as a steak side dish:
                                              - Goal: Crispy texture, dinner side dish;
                                              - Constraints: Under 200 kcal, strictly NO butter or peanuts (customer allergy);
                                              - Validation: Plated within 15 minutes, core temperature at 75°C."
```

Codex is an algorithmic master chef. Your role is defining what to make, what cannot be touched, and how success is measured—leaving the heat and chopping technique to the agent.

---

## 🚀 Beginner Quickstart: 3 Steps to Launch

Draft your first Goal-Driven Spec in 3 steps:

1. **Step 1: Define the End State (Goal)**  
   State the deliverable in one sentence: "Implement Stripe payment session creation at `/api/checkout`".
2. **Step 2: Enforce Inviolable Guardrails (Constraints)**  
   List 2-3 boundaries: "Never log secret keys in plain text; do not modify global middleware".
3. **Step 3: Provide Automated Verification Assertions (Validation)**  
   Give a runnable command: "Running `npm test -- checkout.test.ts` must pass 100% on the first run".

---

## 4.1 The Goal-Driven Markdown Specs Template

When triggering coding tasks in your terminal or ChatGPT Desktop, use this structured Markdown layout:

```markdown
# 🎯 Goal
[Describe desired business outcome. Example: Implement GitHub OAuth login route and persist preferences.]

# 🛑 Constraints
- [Security: Never commit credentials or write keys to log streams.]
- [Stack: Strictly use existing Tailwind classes; do not introduce new UI libraries.]
- [Anti-pollution: Prohibited from editing any file under src/legacy/.]

# 🧪 Validation Specs
- [Automated Testing: Running `npm run test:unit` must pass 100%.]
- [Edge behaviors: If inputs are missing, return 400 Bad Request with structured JSON error payloads.]
```

---

## 4.2 Real Case Comparison: Traditional Prompt vs. Goal-Driven Specs

Suppose we need to write a **"Redis-based Rate-Limiting API Proxy Service"**.

### ❌ Traditional Process-Driven Prompt
> "Please help me write an API proxy with Express. First, import express and express-rate-limit. Then configure rate-limiting, setting windowMs to 15 minutes and max to 100. Then write a route `/api/proxy` using axios to request the third-party API `https://api.github.com`. If successful, return the data; if it fails, return a 500 error. Make sure to include the Authorization Bearer Token in the headers."

### ✅ Goal-Driven Specs

```markdown
# 🎯 Goal
Implement an Express API proxy route that forwards all incoming requests safely to the GitHub API.

# 🛑 Constraints
- Must use Redis as the rate-limiting data source (no memory-based limiting) to support multi-container scaling.
- Limit proxy request timeout strictly to 3000ms to prevent hanging the Node event loop.
- Never write the GitHub token into the codebase or logs; fetch securely from `process.env.GH_TOKEN`.

# 🧪 Validation Specs
- Under simulated load: return 429 Too Many Requests when requests exceed 60 req/min.
- Fault tolerance: return 504 Gateway Timeout with structured JSON on timeouts or network drops.
```

---

## 4.3 GPT-5.6 Terra Reasoning Architecture for Specs

When presented with this spec, Codex breaks down the solution chain:

```Plaintext
[Parse Specs Goal] ──> Analyze Constraints (Redis rate-limit / 3s timeout / Secret isolation)
                            │
                            ▼
[Self-Directed Architecture] ──> Import ioredis + rate-limit-redis, configure Axios abort controllers
                            │
                            ▼
[Align with Validation Specs] ──> Simulate 429 rate limit & timeout fallbacks in unit tests
                            │
                            ▼
[Self-Heal Code Until Tests Pass 100%] ──> Deliver clean code with green verification reports
```

**Delegate logic planning to AI, but keep verification standards firmly in your own hands.**

---

## 🛡️ Troubleshooting & Pitfall Cheat Sheet

| Symptom | Root Cause | Instant Fix |
| :--- | :--- | :--- |
| **Overly fragmented steps cause agent to freeze on errors** | Procedural commands stripped GPT-5.6 of self-healing planning space | Strip out implementation steps; retain only Goal, Constraints, and Validation |
| **Agent modified unrelated files, breaking other features** | Lacked directory scope constraints | Declare strict boundaries: "Edits restricted to `src/modules/auth/`; never touch other directories" |
| **Agent claimed completion, but logic has fatal flaws** | Missing automated validation assertions | Add explicit requirement: "Must run `npm test` and produce green unit test assertions" |

---

[ 🏠 Index ](/en/) | [ ⬅️ Prev (Ch.03) ](./ch03_sandbox.md) | [ ➡️ Next (Ch.05) ](./ch05_agents_protocol.md) | [ 🌐 中文版 ](../chapters/ch04_goal_driven.md)
