[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.08) ](./ch08_mobile_workflow.md) | [ ➡️ Next (Ch.10) ](./ch10_saas_mvp.md) | [ 🌐 中文版 ](../chapters/ch09_legacy_code.md)

# Ch.09 Codebase Revitalization: Reverse Engineering and Progressive Decoupling of Legacy Systems

When working on solo projects or inheriting outsourced contracts, the biggest headache is not building from scratch. It is inheriting a legacy "spaghetti code" system left behind by previous developers, complete with zero documentation and zero unit tests. Every minor code modification feels like dancing in a minefield.

In "Real-World Product Talk", I often advise: **Do not blindly tear down and rewrite. By leveraging Codex's panoramic analysis and reasoning power, we can implement progressive decoupling and refactoring of legacy systems.**

This chapter teaches you how to direct Codex to act as your legacy codebase operator.

---

## 9.1 Step 1: Panoramic Reverse Engineering - Generating Codebase Topology

The first task when inheriting a messy project is **drawing the map**. Do not comb through the code yourself; let Codex reverse-engineer the project configuration for you.

### 1. Reverse-Engineering Database Schemas
If the project uses Prisma or raw SQL, you can ask Codex to reverse-engineer a Mermaid Entity-Relationship Diagram (ERD) directly from the schema file.

Dispatch the following task specs locally to Codex:

```markdown
# 🎯 Goal
Analyze the database configuration of the current project and generate a Mermaid ERD illustrating core table structures and foreign key relationships.

# 🛑 Constraints
- Only analyze files under /prisma/schema.prisma or /src/db/models/.
- Exclude temporary tables and third-party metadata tables.

# 🧪 Validation Specs
- Output a properly rendered Markdown Mermaid code block in /docs/database_topology.md.
```

Codex will automatically parse table relations and generate an intuitive topology diagram, which is hundreds of times faster than manually auditing database relationships.

---

## 9.2 Step 2: Safety Guardrails - Writing Characterization Tests

The golden rule of refactoring legacy code is: **Verify that old behaviors are not broken before writing new logic.**
We must instruct Codex to automatically write **characterization tests** for existing key endpoints (e.g., checkout payments, OAuth callbacks) to serve as safety boundaries.

### Practice: Dispatching Characterization Test Instructions to Codex
```markdown
# 🎯 Goal
Write unit tests for the src/pages/api/checkout.ts endpoint to capture current request behaviors and response payloads.

# 🛑 Constraints
- Do not modify any logic in src/pages/api/checkout.ts.
- Run tests using Jest / Vitest inside the local sandbox.

# 🧪 Validation Specs
- Cover at least three scenarios: successful product checkout, out-of-stock errors, and unauthenticated access block.
- Ensure the test suite pass rate is 100%.
```

With these characterization tests serving as the AI's validation guardrails, any subsequent refactoring changes that break legacy logic will be instantly caught during compilation and testing inside the sandbox.

---

## 9.3 Step 3: Minimally Invasive Surgery - Implementing Progressive Decoupling

Equipped with our "map" (topology diagram) and "shield" (characterization tests), we can now direct Codex to perform the actual refactoring.

### 1. Decoupling Fat Controllers
Suppose we have a 500-line API route that mixes authentication, discount calculations, emails, inventory updates, and logging. We can command Codex to extract this logic:

```markdown
# 🎯 Goal
Extract the "discount calculation logic" from src/pages/api/checkout.ts into a standalone service class src/services/discountService.ts.

# 🛑 Constraints
- Ensure the endpoint input and output schemas remain completely unchanged.
- Strictly avoid affecting other core logic within checkout.ts.

# 🧪 Validation Specs
- Run `npm run test` and ensure the previously written checkout characterization tests pass 100%.
- Run `npm run lint` and verify there are no syntax or formatting errors.
```

### 2. Local Validation and Automated Rollbacks
As Codex begins the refactoring task, it will modify the code and run the test suite inside the sandbox. If the tests fail, it will analyze its CoT thinking chain to determine whether the refactoring code was flawed or if the characterization tests were outdated.

Using this minimally invasive refactoring cycle (Extract Logic -> Run Tests -> Rollback on Error -> Readjust), you can refactor a chaotic, unmaintainable legacy codebase of tens of thousands of lines into a clean, modular, and tested system in just a few hours.

**Do not fear legacy spaghetti code. Use goal-driven specs and characterization tests as your shield, and let Codex handle the heavy lifting of refactoring.**

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.08) ](./ch08_mobile_workflow.md) | [ ➡️ Next (Ch.10) ](./ch10_saas_mvp.md) | [ 🌐 中文版 ](../chapters/ch09_legacy_code.md)
