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
