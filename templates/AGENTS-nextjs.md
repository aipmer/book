# 🤖 Next.js App Router 专属智能体协作规约 (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: Next.js 15 (App Router), TypeScript, TailwindCSS。
- **ORM & DB**: Prisma ORM, PostgreSQL (Supabase / Local Docker)。
- **Authentication**: Auth.js (Next-Auth v5)。

## 💻 Developer Commands
- **Install Dependencies**: `npm install` (仅在 package.json 发生变更时运行)
- **Dev Server**: `npm run dev` (侦听端口：localhost:3000)
- **Lint Code**: `npm run lint`
- **Run Tests**: `npm run test` (支持 Vitest)
- **DB Migration**: `npx prisma migrate dev` (严禁在 production 分支运行)
- **Prisma Validate**: `npx prisma validate`
- **Drizzle Check** (如使用 Drizzle): `npx drizzle-kit check`

## 🎨 Styles & Architecture Patterns
- **目录分配规范**：
  - **页面与 API 路由**：强制置于 `src/app/` 下。所有 API Route Handlers 路径为 `src/app/api/.../route.ts`。
  - **UI 组件**：采用 Shadcn 规范，全部存放于 `src/components/ui/`。
  - **业务 Hook**：全部存放于 `src/hooks/`。
  - **数据层模型**：Prisma 结构文件固定为 `prisma/schema.prisma`。
- **安全与编码准则**：
  - 所有 API 路由在解析 `request.json()` 时，**必须使用 Zod 库**进行 Body Schema 强校验。接口校验失败返回 HTTP 400，系统未捕获异常返回 HTTP 500。
  - 组件长度限制：单个 UI 组件文件代码超过 200 行时，智能体必须将其拆分为子组件或提取 Hook。
- **Server Actions 安全规范**：
  - 每个 Server Action 文件顶部必须声明 `"use server"`。
  - 所有 Server Actions 必须包含 CSRF 验证或 Session 校验逻辑。直接暴露无鉴权的 Server Action 视为安全缺陷。
  - Server Action 的入参必须使用 Zod 做 schema 校验，禁止信任客户端传入的原始数据。
- **数据库变更流程**：
  - 修改 `prisma/schema.prisma` 后，必须先执行 `npx prisma validate` 确认 schema 合法，再执行 `npx prisma migrate dev`。
  - 如使用 Drizzle ORM，修改 schema 后必须先执行 `npx drizzle-kit check`，再执行迁移命令。
  - 禁止跳过校验步骤直接执行迁移。

## 🔄 AI 循环防范 (Anti-Loop Safeguards)
- **依赖安装循环**：`npm install` 失败后最多重试 2 次。第 3 次失败时停止操作，向用户报告完整错误日志，由用户决定后续方案。
- **TypeScript 级联错误**：修复文件 A 导致文件 B/C 出现新的类型错误时，立即停止修复。列出完整的依赖链 (A → B → C)，向用户报告级联关系，等待用户确认修复策略。
- **测试 Mock 伪造**：禁止通过编写复杂的 mock 对象来强行通过测试。测试失败时，先检查 Prisma schema 与 fixture 数据是否匹配，再检查业务逻辑。如果需要 mock，mock 层级不得超过 2 层。

## 🏗️ 沙盒与环境边界 (Sandbox & Environment Boundaries)
- **端口隔离**：Next.js 开发服务器固定使用 `localhost:3000`。Docker 容器的 PostgreSQL 映射端口为 `5432:5432`。智能体不得擅自更改端口映射配置。
- **Connection Refused 诊断流程** (最多 3 步)：
  1. 检查目标端口是否被占用：`lsof -i :3000` 或 `lsof -i :5432`。
  2. 检查目标服务是否已启动：`docker ps` 确认容器运行状态 / `npm run dev` 确认开发服务器启动。
  3. 检查网络连通性：`curl -f http://localhost:3000/api/health`。若 3 步均无法定位原因，停止尝试，向用户报告诊断结果。
- **分支安全**：
  - `prisma migrate reset` 命令严禁在 `main`、`master`、`production` 分支上执行。
  - `git push --force` 严禁在上述受保护分支上使用。
  - 智能体执行破坏性命令前，必须通过 `git branch --show-current` 确认当前分支。

## 🛑 Agent Boundary & Hard Rules (安全红线)
- **只读目录/文件限制**：
  - 严禁修改 `src/app/api/auth/[...nextauth]/route.ts` 及其关联的配置文件。此为 OAuth 鉴权核心层。
  - 严禁擅自修改 `prisma/schema.prisma`。如需修改，智能体必须中断当前任务流，向用户发起确认申请。
- **Server Actions 安全红线**：
  - 禁止创建不含 Session 校验的公开 Server Action。每个 Server Action 必须在函数入口处调用 `auth()` 或等效的鉴权检查。
  - 违反此规则的代码必须在 Code Review 阶段被拦截。
- **数据库变更红线**：
  - 修改 Prisma schema 后未执行 `npx prisma validate` 就直接迁移，视为流程违规。
  - 禁止在一次提交中同时修改 schema 和业务逻辑代码，必须分两次提交：先 schema 迁移，再业务代码。
- **构建前安全检查**：
  - 严禁提交或同步任何含有明文 API Key/Token 的 `.env` 文件。
  - 在宣布任务完成前，必须先运行 `npm run lint` 和 `npm run test`。如有报错，必须立即回滚代码并报告错误堆栈。

---

## 🌐 English Version

# 🤖 Next.js App Router Agent Collaboration Protocol (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: Next.js 15 (App Router), TypeScript, TailwindCSS.
- **ORM & DB**: Prisma ORM, PostgreSQL (Supabase / Local Docker).
- **Authentication**: Auth.js (Next-Auth v5).

## 💻 Developer Commands
- **Install Dependencies**: `npm install` (run only when package.json changes)
- **Dev Server**: `npm run dev` (listening port: localhost:3000)
- **Lint Code**: `npm run lint`
- **Run Tests**: `npm run test` (Vitest supported)
- **DB Migration**: `npx prisma migrate dev` (strictly prohibited on production branch)
- **Prisma Validate**: `npx prisma validate`
- **Drizzle Check** (if using Drizzle): `npx drizzle-kit check`

## 🎨 Styles & Architecture Patterns
- **Directory Structure Conventions**:
  - **Pages & API Routes**: Must be placed under `src/app/`. All API Route Handlers must reside at `src/app/api/.../route.ts`.
  - **UI Components**: Follow Shadcn conventions, stored entirely inside `src/components/ui/`.
  - **Custom Hooks**: Stored inside `src/hooks/`.
  - **Database Models**: Prisma schema must be located at `prisma/schema.prisma`.
- **Security & Coding Standards**:
  - All API routes must use the **Zod** library for body schema validation on `request.json()`. Failed validation returns HTTP 400; unhandled server errors return HTTP 500.
  - Component Size Limit: If a UI component exceeds 200 lines, the agent must split it into sub-components or extract logic into hooks.
- **Server Actions Security**:
  - Every Server Action file must declare `"use server"` at the top.
  - All Server Actions must include CSRF validation or Session verification. Exposing unauthenticated Server Actions is treated as a security defect.
  - Server Action inputs must be validated with Zod. Never trust raw client-side data.
- **Database Change Workflow**:
  - After modifying `prisma/schema.prisma`, run `npx prisma validate` before executing `npx prisma migrate dev`.
  - If using Drizzle ORM, run `npx drizzle-kit check` after schema changes, before running migrations.
  - Skipping the validation step and running migrations directly is forbidden.

## 🔄 Anti-Loop Safeguards
- **Dependency Install Loops**: Retry `npm install` at most 2 times on failure. On the 3rd failure, stop and report the full error log to the user for decision.
- **TypeScript Cascade Errors**: If fixing file A introduces new type errors in files B/C, stop immediately. List the full dependency chain (A → B → C), report the cascade to the user, and wait for confirmation on the fix strategy.
- **Test Mock Forgery**: Do not write elaborate mock objects just to force tests to pass. On test failure, first verify that the Prisma schema and fixture data are aligned, then check business logic. If mocks are needed, mock depth must not exceed 2 layers.

## 🏗️ Sandbox & Environment Boundaries
- **Port Isolation**: Next.js dev server uses `localhost:3000`. Docker PostgreSQL maps to `5432:5432`. The agent must not alter port mapping configurations without permission.
- **Connection Refused Diagnostic Flow** (max 3 steps):
  1. Check if the target port is occupied: `lsof -i :3000` or `lsof -i :5432`.
  2. Check if the target service is running: `docker ps` for container status / `npm run dev` for dev server.
  3. Check network connectivity: `curl -f http://localhost:3000/api/health`. If all 3 steps fail to identify the issue, stop and report diagnostic results to the user.
- **Branch Safety**:
  - `prisma migrate reset` is strictly forbidden on `main`, `master`, or `production` branches.
  - `git push --force` is strictly forbidden on the above protected branches.
  - Before executing destructive commands, the agent must verify the current branch via `git branch --show-current`.

## 🛑 Agent Boundary & Hard Rules
- **Read-Only / Protected Files**:
  - Do not modify `src/app/api/auth/[...nextauth]/route.ts` or its imported config files. This is the core OAuth authentication layer.
  - Do not modify `prisma/schema.prisma` without explicit permission. The agent must halt the current task flow and request validation from the user.
- **Server Actions Security Rules**:
  - Creating a public Server Action without Session verification is forbidden. Every Server Action must call `auth()` or an equivalent authentication check at the function entry.
  - Code violating this rule must be caught during Code Review.
- **Database Change Rules**:
  - Running migrations without first executing `npx prisma validate` after a schema change is a process violation.
  - Schema changes and business logic code must be committed separately: schema migration first, then business code.
- **Pre-flight & Security Check**:
  - Do not commit `.env` files containing raw API keys or tokens.
  - Before declaring a task complete, run `npm run lint` and `npm run test` in the sandbox. If errors occur, rollback edits and report the stack trace.
