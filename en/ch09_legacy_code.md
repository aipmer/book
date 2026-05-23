[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.08) ](./ch08_mobile_workflow.md) | [ ➡️ Next (Ch.10) ](./ch10_saas_mvp.md)

# Ch.09 Codebase Revitalization: Reverse Engineering and Progressive Decoupling of Legacy Systems

Don't rewrite legacy systems from scratch. Decouple them progressively using characterization tests.

---

## 9.1 Mapping the Database
Let Codex parse Prisma configurations to generate a visual database topology:

```markdown
# 🎯 Goal
Analyze the database configuration and generate a Mermaid ERD.
```

---

## 9.2 Writing Characterization Tests
Lock down current API endpoint behavior before refactoring:

```markdown
# 🎯 Goal
Write baseline integration tests for src/pages/api/checkout.ts.
Ensure zero modifications to the route logic during test setup.
```

---

## 9.3 Decomposing Logic
With tests verifying behavior, tell Codex to extract fat controller logic into modular services:

```markdown
# 🎯 Goal
Extract pricing calculations from checkout.ts to services/discountService.ts.

# 🧪 Validation Specs
- Run tests and ensure 100% pass rates.
```

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.08) ](./ch08_mobile_workflow.md) | [ ➡️ Next (Ch.10) ](./ch10_saas_mvp.md)
