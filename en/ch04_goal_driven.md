[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.03) ](./ch03_sandbox.md) | [ ➡️ Next (Ch.05) ](./ch05_agents_protocol.md)

# Ch.04 Goal-Driven Engineering: Taming Reasoning Agents with Boundaries and Assertions

In the era of reasoning models like o3 and GPT-5.5, step-by-step prompts constrain the AI. Reasoning models possess immense internal planning space—over-specifying instructions only limits their efficiency.

---

## 4.1 Concept: Don't Tell a Michelin Chef How to Chop

Avoid micro-managing the process:
❌ *"Import Express, import Axios, write a try-catch block, print errors via console.log."*

Instead, practice **Goal-Driven Engineering**:
✅ *"Create a GitHub OAuth route. Read GITHUB_ID from the env. Ensure Vitest tests pass."*

Define the **Goal**, establish **Constraints**, and provide **Validation Specs**—leaving execution details to the agent.

---

## 4.2 The Goal-Driven Specs Template

```markdown
# 🎯 Goal
[Define the desired end state clearly]

# 🛑 Constraints
- [List safety, architectural, and dependency constraints]

# 🧪 Validation Specs
- [Specify automated test scripts and verification criteria]
```

---

## 4.3 Case Study: Rate-Limited Express Gateway

### ❌ Procedural Prompt (Too Restrictive)
> "Write an Express proxy. Install express-rate-limit. Set windowMs to 15m. Proxy requests to github using axios and append bearer token."

### ✅ Goal-Driven Specs (Recommended)
```markdown
# 🎯 Goal
Implement an Express API proxy routing requests to GitHub.

# 🛑 Constraints
- Must use Redis as the store for rate-limiting (no memory store).
- Hard limit proxy timeouts to 3000ms.
- Load secrets securely from process.env.GH_TOKEN.

# 🧪 Validation Specs
- Return 429 Too Many Requests when limits exceed 60 req/min.
- Return 504 Gateway Timeout on proxy network errors.
```

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.03) ](./ch03_sandbox.md) | [ ➡️ Next (Ch.05) ](./ch05_agents_protocol.md)
