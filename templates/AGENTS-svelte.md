# 🤖 Svelte (SvelteKit) 专属智能体协作规约 (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: Svelte 5 (Runes), SvelteKit 2, TypeScript, Vite, Tailwind CSS。
- **Data**: SvelteKit load / form actions；数据库用 Drizzle ORM（或 Prisma）。
- **Testing**: Vitest（单元）+ Playwright（端到端）。

## 💻 Developer Commands
- **Install Dependencies**: `pnpm install` (仅在 lockfile 变更后运行)
- **Dev Server**: `pnpm dev` (侦听端口：localhost:5173)
- **Type Check**: `pnpm check` (即 `svelte-kit sync && svelte-check --tsconfig ./tsconfig.json`)
- **Run Unit Tests**: `pnpm test:unit` (Vitest)
- **Run E2E Tests**: `pnpm test:e2e` (Playwright，需先 `pnpm build && pnpm preview`)
- **Lint & Format**: `pnpm lint` (eslint + prettier --check)
- **Build**: `pnpm build`

## 🎨 Styles & Architecture Patterns
- **目录分配规范**：
  - **路由层**：页面与端点统一在 `src/routes/`，优先使用 `+page.server.ts` 的 load 与 form actions 做数据交互，禁止在组件里裸 `fetch` 自家 API。
  - **组件层**：可复用组件在 `src/lib/components/`，页面私有组件放路由旁的 `_components/` 子目录。
  - **服务端逻辑**：数据库与第三方调用一律放 `src/lib/server/`，确保不会被打包进客户端 bundle。
  - **状态管理**：跨组件共享状态用 Svelte 5 Runes（`.svelte.ts` 模块），禁止再引入老版 `writable` store 模式。
- **安全与编码准则**：
  - 所有 form action 的输入必须用 zod（或 valibot）校验，禁止信任 `request.formData()` 原始值直接入库。
  - 服务端密钥只允许出现在 `$env/static/private` 或 `$env/dynamic/private`；严禁把私钥 import 进 `+page.ts`（非 server 文件）或任何 `src/lib/` 非 server 模块。
  - 单个 `.svelte` 组件超过 300 行，必须拆分为子组件。
  - 样式优先 Tailwind 工具类；仅在复杂动效时使用组件内 `<style>`。
- **类型规范**：
  - `load` 与 actions 的返回类型依赖 SvelteKit 自动生成的 `./$types`，禁止手写重复的接口定义。
  - 禁止用 `any` 绕过 `svelte-check`；类型实在无法推导时显式标注并写注释说明。

## 🔄 AI 循环防范 (Anti-Loop Safeguards)
- **依赖安装循环**：
  - `pnpm install` 失败后最多重试 2 次，第 3 次立即停止，向人类报告错误日志并请求介入。
  - 禁止在循环中反复升降 `package.json` 版本号碰撞兼容组合；尤其 Svelte 4→5 迁移期，禁止降级回 Svelte 4 语法敷衍。
- **类型修复级联**：
  - 修复 `svelte-check` 类型错误时，若修改 1 个文件引发 3 个以上文件的新错误，立即停止。列出完整的依赖链（A → B → C），报告人类审核后再继续。
  - 禁止用 `<!-- @ts-ignore -->` 或 `as any` 让检查静默。
- **SSR/CSR 水合报错循环**：
  - 出现 hydration mismatch 时，禁止用 `{#if browser}` 大面积包裹来掩盖；先定位真正依赖浏览器 API 的代码，移入 `onMount` 或 `+page.js` 的 `ssr = false`（仅限该路由）。
  - 同一报错修复 2 次仍复发，停止并输出最小复现，等待人类决策。
- **Playwright 测试抖动**：
  - E2E 用例 flaky 时禁止无脑加 `waitForTimeout`；优先用 `expect(...).toBeVisible()` 等自动等待断言。同一用例连续失败 2 次，停止并报告 trace 文件位置。

## 🏗️ 沙盒与环境边界 (Sandbox & Environment Boundaries)
- **端口隔离**：
  - Vite 开发服务器固定使用 `localhost:5173`。如端口被占用，执行 `lsof -i :5173` 诊断，禁止自行切换随机端口（Playwright 配置依赖该端口）。
  - 数据库端口（PostgreSQL 5432）仅限容器内部或本地连接，禁止暴露到 `0.0.0.0`。
- **连接拒绝排查流程**（最多 3 步，超出则报告人类）：
  1. 检查端口监听状态：`lsof -i :<port>` 或 `ss -tlnp | grep <port>`
  2. 检查目标服务是否启动：`docker ps` 或 `systemctl status <service>`
  3. 检查网络连通性：`curl -v http://localhost:<port>/`
- **分支安全**：
  - 在「main」「master」「production」「release/*」分支上，禁止直接执行数据库迁移（`drizzle-kit push` / `migrate`），必须先通过 PR review。
  - 禁止在上述分支执行 `DROP TABLE`、`TRUNCATE` 等破坏性 SQL。
- **构建产物约束**：
  - `.svelte-kit/` 与 `build/` 为生成目录，禁止手工编辑或提交；`pnpm build` 异常时先 `rm -rf .svelte-kit && pnpm check` 重建类型再排查。

## 🛑 Agent Boundary & Hard Rules (安全红线)
- **只读目录/文件限制**：
  - 严禁手工编辑 `pnpm-lock.yaml`、`src/lib/server/` 下的密钥加载逻辑。
  - `svelte.config.js` 中的 adapter 配置变更必须经人类确认（直接影响部署目标）。
- **密钥与提交安全**：
  - 严禁将含有敏感账户密码及 Token 的 `.env` 文件提交进 Git；提交前必须运行 `git diff --cached | grep -iE "(secret|token|password)"` 自检。
  - 客户端可见环境变量必须以 `PUBLIC_` 前缀命名；发现私钥被冠以 `PUBLIC_` 前缀，立即按安全事故处理并报告。
- **CORS 生产约束**：
  - 自定义 `+server.ts` 端点的 CORS 响应头，`Access-Control-Allow-Origin: *` 仅限本地开发；生产必须显式白名单。
- **执行权限约束**：
  - 禁止 `sudo pnpm install -g`；全局工具一律用 `pnpm dlx` 或项目内 devDependencies。

---

## 🌐 English Version

# 🤖 Svelte (SvelteKit) Agent Collaboration Protocol (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: Svelte 5 (Runes), SvelteKit 2, TypeScript, Vite, Tailwind CSS.
- **Data**: SvelteKit load / form actions; database via Drizzle ORM (or Prisma).
- **Testing**: Vitest (unit) + Playwright (E2E).

## 💻 Developer Commands
- **Install Dependencies**: `pnpm install` (run only after lockfile changes)
- **Dev Server**: `pnpm dev` (port: localhost:5173)
- **Type Check**: `pnpm check` (i.e. `svelte-kit sync && svelte-check --tsconfig ./tsconfig.json`)
- **Run Unit Tests**: `pnpm test:unit` (Vitest)
- **Run E2E Tests**: `pnpm test:e2e` (Playwright; run `pnpm build && pnpm preview` first)
- **Lint & Format**: `pnpm lint` (eslint + prettier --check)
- **Build**: `pnpm build`

## 🎨 Styles & Architecture Patterns
- **Directory Structure Conventions**:
  - **Routes**: Pages and endpoints live in `src/routes/`; prefer `+page.server.ts` load functions and form actions for data flow — raw `fetch` against your own API inside components is forbidden.
  - **Components**: Reusable components in `src/lib/components/`; page-private components in a colocated `_components/` folder.
  - **Server Logic**: Database and third-party calls live in `src/lib/server/` so they never leak into the client bundle.
  - **State Management**: Cross-component shared state uses Svelte 5 Runes (`.svelte.ts` modules); re-introducing legacy `writable` store patterns is forbidden.
- **Coding Standards**:
  - All form action input must be validated with zod (or valibot); raw `request.formData()` values must never reach the database.
  - Server secrets may only come from `$env/static/private` or `$env/dynamic/private`; importing private env into `+page.ts` (non-server) or any non-server `src/lib/` module is forbidden.
  - `.svelte` components over 300 lines must be split into child components.
  - Prefer Tailwind utility classes; component-scoped `<style>` only for complex animations.
- **Typing Standards**:
  - `load` and action return types rely on SvelteKit's generated `./$types`; handwritten duplicate interfaces are forbidden.
  - Do not silence `svelte-check` with `any`; when inference truly fails, annotate explicitly with a comment.

## 🔄 Anti-Loop Safeguards
- **Dependency Install Loops**:
  - After `pnpm install` failure, retry at most 2 times; halt and report on the 3rd.
  - Do not bounce version pins in `package.json` hoping for compatibility; during Svelte 4→5 migration, falling back to Svelte 4 syntax is forbidden.
- **Type Fix Cascades**:
  - When fixing `svelte-check` errors, if modifying 1 file triggers new errors in 3+ files, stop immediately. List the dependency chain (A → B → C) and report before proceeding.
  - `<!-- @ts-ignore -->` and `as any` silencers are forbidden.
- **SSR/CSR Hydration Loops**:
  - For hydration mismatches, wrapping everything in `{#if browser}` is forbidden; locate the actual browser-API-dependent code and move it into `onMount` or route-level `ssr = false`.
  - If the same error recurs after 2 fixes, stop and produce a minimal reproduction for human review.
- **Playwright Flakiness**:
  - Do not paper over flaky E2E with `waitForTimeout`; prefer auto-waiting assertions like `expect(...).toBeVisible()`. If a test fails twice in a row, stop and report the trace file location.

## 🏗️ Sandbox & Environment Boundaries
- **Port Isolation**:
  - The Vite dev server is fixed to `localhost:5173`. If occupied, diagnose with `lsof -i :5173`; silently switching ports is forbidden (Playwright config depends on it).
  - Database ports (PostgreSQL 5432) accept local or container-internal connections only. Binding to `0.0.0.0` is forbidden.
- **Connection Refused Troubleshooting** (max 3 steps, then escalate):
  1. Check listening ports: `lsof -i :<port>` or `ss -tlnp | grep <port>`
  2. Check service status: `docker ps` or `systemctl status <service>`
  3. Check connectivity: `curl -v http://localhost:<port>/`
- **Branch Safety**:
  - On `main`, `master`, `production`, or `release/*` branches, running DB migrations (`drizzle-kit push` / `migrate`) directly is forbidden without PR review.
  - Destructive SQL (`DROP TABLE`, `TRUNCATE`) is forbidden on these branches.
- **Build Artifact Constraints**:
  - `.svelte-kit/` and `build/` are generated directories — never hand-edit or commit them. On `pnpm build` anomalies, first rebuild types with `rm -rf .svelte-kit && pnpm check`.

## 🛑 Agent Boundary & Hard Rules
- **Read-Only / Protected Files**:
  - Never hand-edit `pnpm-lock.yaml` or the secret-loading logic under `src/lib/server/`.
  - Adapter changes in `svelte.config.js` require human approval (they directly change the deploy target).
- **Secrets & Commit Safety**:
  - `.env` files with live credentials must never be committed; run `git diff --cached | grep -iE "(secret|token|password)"` before every commit.
  - Client-visible env vars must carry the `PUBLIC_` prefix; a secret found under `PUBLIC_` is a security incident — report immediately.
- **CORS Production Constraints**:
  - `Access-Control-Allow-Origin: *` on custom `+server.ts` endpoints is local-dev only; production requires an explicit whitelist.
- **Execution Privilege Constraints**:
  - `sudo pnpm install -g` is forbidden; global tooling goes through `pnpm dlx` or project devDependencies.
