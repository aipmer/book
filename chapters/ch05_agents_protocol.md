[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.04) ](./ch04_goal_driven.md) | [ ➡️ 下一章 (Ch.06) ](./ch06_reasoning_steer.md)

# Ch.05 制定 CAP 协议：构建项目专属的 AGENTS.md 规则层

在实际做产品的过程中，最怕遇到的一种开发情况是：修好了一个 Bug，却顺手带出了三个新 Bug；或者新写了一个功能，结果把团队约定的代码风格破坏得一塌糊涂。

在人机协同开发中，Codex 如果没有边界约束，也会变成一个“破坏性极强”的勤奋员工。为了给它戴上缰绳，我们需要在项目根目录下建立 **`AGENTS.md`**。

这就是我们的 **“智能体协作宪法” (Codex Collaboration Protocol, CAP)**。

---

## 5.1 为什么我们需要 `AGENTS.md`？

在 Claude Code 中，大家常用 `CLAUDE.md`。而在我们的 Codex 体系下，我们将其命名为 `AGENTS.md`。它的核心价值在于：
1.  **启动即恢复记忆**：每次 Codex 启动时，第一件事就是扫描根目录下的 `AGENTS.md`，瞬间拾起整个项目的技术栈、文件结构和协作约束，不需要你在对话里反复唠叨。
2.  **代码防腐层**：明确定义哪些文件是“只读/禁止触碰”的，防止 Codex 擅自重构核心安全模块（如登录鉴权、数据库 Schema）。
3.  **约束命令执行**：规定只能使用特定的测试和部署命令，防止 AI 误跑破坏性脚本。

---

## 5.2 `AGENTS.md` 的核心四大版块

```markdown
# 项目指纹 (Project Fingerprint)
- 告诉 AI 这是一个什么样的项目，核心技术栈是什么。

# 开发常用命令 (Commands)
- 明确指出编译、测试、迁移数据库的命令，不要让 AI 瞎猜。

# 架构与编码规范 (Styles & Patterns)
- 规定文件存放目录、大小限制及必用的设计模式。

# 智能体安全红线 (Hard Rules)
- 绝对的禁区。一旦触碰，Codex 必须立刻中止并请求人工确认。
```

---

## 5.3 实战：一个生产级的 `AGENTS.md` 模板

以下是一个典型的全栈 SaaS 项目的 `AGENTS.md` 规范：

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

## 5.4 实战产品说建议：如何让约束真正落地？

在 Codex 中，`AGENTS.md` 是被默认读取并注入到系统上下文中的。

当你（或 Codex 自身）执行的任务偏离了 `AGENTS.md` 里的规则时，Codex 的遥测机制会触发硬警告，停止在当前步骤，并向你发送中断确认：

```bash
⚠️ [Warning] Codex attempts to edit src/app/api/auth/[...nextauth]/route.ts.
This path is flagged as READ-ONLY in AGENTS.md.
Do you want to override this rule? (y/N)
```

有了这层保护，你才敢放心地把大段的业务开发逻辑委托给 Codex，而不用时刻盯着它是否改坏了底层核心模块。

---

[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.04) ](./ch04_goal_driven.md) | [ ➡️ 下一章 (Ch.06) ](./ch06_reasoning_steer.md)
