# 🤖 Vue 3 + Vite 专属智能体协作规约 (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: Vue 3 (Composition API), Vite, TypeScript, Pinia, Vue Router, TailwindCSS.
- **Styling**: TailwindCSS, CSS Variables.
- **Lint & Format**: ESLint, Prettier.

## 💻 Developer Commands
- **Install Dependencies**: `npm install` (仅在 package.json 发生变更时运行)
- **Dev Server**: `npm run dev` (侦听端口：localhost:3000 / 5173)
- **Build App**: `npm run build` (用于验证生产包是否能编译成功)
- **Lint Code**: `npm run lint`

## 🎨 Styles & Architecture Patterns
- **目录分配规范**：
  - **页面级组件**：强制存放于 `src/views/` 目录下。
  - **通用 UI 组件**：存放于 `src/components/ui/`（若是 Shadcn-vue）或 `src/components/`。
  - **状态管理**：Pinia Stores 必须统一存放于 `src/stores/` 目录。
  - **路由配置**：统一置于 `src/router/index.ts`。
  - **API 网络接口**：必须统一存放于 `src/api/`，严禁在页面或组件中直接引入 axios 发起网络请求。
- **安全与编码准则**：
  - 单文件组件 (SFC) 必须强制使用 `<script setup lang="ts">` 语法糖。
  - 每一个 reactive 状态与 props 必须显式定义 TypeScript 接口 (Interface) 或类型。
  - 组件长度限制：如果单个组件代码超过 250 行，智能体必须进行组件拆分或提取为 Composable 组合式函数（存放在 `src/composables/`）。

## 🛑 Agent Boundary & Hard Rules (安全红线)
- **只读目录/文件限制**：
  - 严禁擅自修改 `src/router/index.ts`。如果必须修改路由或路由拦截守卫（如权限校验拦截），智能体必须先在 CoT 中断思考，并向用户发起确认申请。
- **构建前安全检查**：
  - 严禁提交任何包含真实 API Key/Token 的 `.env` 环境变量文件。
  - 在宣布任务完成前，智能体必须在本地运行 `npm run build` 和 `npm run lint`。如果发生任何编译警告或报错，必须立即定位并修复，严禁将无法通过打包的代码遗留给用户。

---

## 🌐 English Version

# 🤖 Vue 3 + Vite Agent Collaboration Protocol (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: Vue 3 (Composition API), Vite, TypeScript, Pinia, Vue Router, TailwindCSS.
- **Styling**: TailwindCSS, CSS Variables.
- **Lint & Format**: ESLint, Prettier.

## 💻 Developer Commands
- **Install Dependencies**: `npm install` (run only when package.json changes)
- **Dev Server**: `npm run dev` (listening port: localhost:3000 / 5173)
- **Build App**: `npm run build` (run to verify that production bundles compile successfully)
- **Lint Code**: `npm run lint`

## 🎨 Styles & Architecture Patterns
- **Directory Structure Conventions**:
  - **Page Components**: Must be stored inside `src/views/`.
  - **Generic UI Components**: Stored inside `src/components/ui/` (if using Shadcn-vue) or `src/components/`.
  - **State Management**: Pinia stores must be centralized in `src/stores/`.
  - **Routing Config**: Centralized in `src/router/index.ts`.
  - **API Request Interceptors**: Must be centralized in `src/api/`. Raw axios/fetch requests inside individual view components are strictly prohibited.
- **Coding Standards**:
  - Single File Components (SFC) must use `<script setup lang="ts">` syntax.
  - Every reactive state and prop definition must be typed explicitly using TypeScript interfaces/types.
  - Component Size Limit: If a component exceeds 250 lines, the agent must extract sub-components or extract business logic into composables (under `src/composables/`).

## 🛑 Agent Boundary & Hard Rules
- **Read-Only / Protected Files**:
  - Do not modify `src/router/index.ts` without explicit user permission. If adding routes or auth middleware guard logic, the agent must pause CoT and request user approval.
- **Pre-flight & Security Check**:
  - Never commit `.env` files containing raw secrets, API tokens, or passwords to Git.
  - Before declaring a task complete, the agent must run `npm run build` and `npm run lint` in the sandbox. Any warning or error must be resolved immediately; pushing broken builds is unacceptable.
