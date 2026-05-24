# 🤖 Next.js App Router 专属智能体协作规约 (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: Next.js 15 (App Router), TypeScript, TailwindCSS.
- **ORM & DB**: Prisma ORM, PostgreSQL (Supabase / Local Docker).
- **Authentication**: Auth.js (Next-Auth v5).

## 💻 Developer Commands
- **Install Dependencies**: `npm install` (仅在 package.json 发生变更时运行)
- **Dev Server**: `npm run dev` (侦听端口：localhost:3000)
- **Lint Code**: `npm run lint`
- **Run Tests**: `npm run test` (支持 Vitest)
- **DB Migration**: `npx prisma migrate dev` (严禁在 production 分支运行)
- **Prisma Validate**: `npx prisma validate`

## 🎨 Styles & Architecture Patterns
- **目录分配规范**：
  - **页面与 API 路由**：强制置于 `src/app/` 下。所有的 API Route Handlers 路径为 `src/app/api/.../route.ts`。
  - **UI 组件**：采用 Shadcn 规范，全部存放于 `src/components/ui/`。
  - **业务 Hook**：全部存放于 `src/hooks/`。
  - **数据层模型**：Prisma 结构文件固定为 `prisma/schema.prisma`。
- **安全与编码准则**：
  - 所有的 API 路由在解析 `request.json()` 时，**必须使用 Zod 库**进行 Body Schema 强校验。
  - 接口校验失败返回 HTTP 400 状态码，系统未捕获异常返回 HTTP 500。
  - 组件长度限制：如果单个 UI 组件文件代码超过 200 行，智能体必须将其拆分为子组件或提取 Hook。

## 🛑 Agent Boundary & Hard Rules (安全红线)
- **只读目录/文件限制**：
  - 严禁修改 `src/app/api/auth/[...nextauth]/route.ts` 及其关联的配置文件，这是 OAuth 鉴权核心层。
  - 严禁擅自修改 `prisma/schema.prisma`。如需修改，智能体必须在 CoT 中中断思考，并向用户发起确认申请。
- **构建前安全检查**：
  - 严禁提交或同步任何含有明文 API Key/Token 的 `.env` 文件。
  - 在宣布任务完成前，必须先在沙盒中运行 `npm run lint` 和 `npm run test`，如有报错，必须立即回滚代码并报告错误堆栈。

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

## 🎨 Styles & Architecture Patterns
- **Directory Structure Conventions**:
  - **Pages & API Routes**: Must be placed under `src/app/`. All API Route Handlers must reside at `src/app/api/.../route.ts`.
  - **UI Components**: Follow Shadcn conventions, stored entirely inside `src/components/ui/`.
  - **Custom Hooks**: Stored inside `src/hooks/`.
  - **Database Models**: Prisma schema must be located at `prisma/schema.prisma`.
- **Security & Coding Standards**:
  - All API routes must utilize the **Zod** library to perform body schema validation on `request.json()`.
  - Failed validation must return HTTP 400, while unhandled server errors must return HTTP 500.
  - Component Size Limit: If a UI component exceeds 200 lines, the agent must split it into smaller sub-components or extract logic into hooks.

## 🛑 Agent Boundary & Hard Rules
- **Read-Only / Protected Files**:
  - Do not modify `src/app/api/auth/[...nextauth]/route.ts` or its imported config files. This is the core OAuth authentication layer.
  - Do not modify `prisma/schema.prisma` without explicit permission. The agent must halt CoT and request validation from the user.
- **Pre-flight & Security Check**:
  - Do not commit `.env` files containing raw API keys or tokens.
  - Before declaring a task complete, run `npm run lint` and `npm run test` in the sandbox. If errors occur, rollback edits and report the stack trace.
