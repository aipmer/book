# 🤖 Rust (Axum) 专属智能体协作规约 (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: Rust 1.78+ (2021 edition), Axum, Tokio, SQLx (compile-time checked queries), Tower middleware.
- **Serialization**: serde / serde_json；校验用 validator。
- **Database**: PostgreSQL（首选）/ SQLite（本地与测试）。

## 💻 Developer Commands
- **Install/Sync Dependencies**: `cargo fetch` (仅在 Cargo.toml 变更后运行)
- **Dev Server**: `cargo run` (侦听端口：localhost:3000；热重载可用 `cargo watch -x run`)
- **Run Tests**: `cargo test`
- **Lint**: `cargo clippy --all-targets --all-features -- -D warnings`
- **Format**: `cargo fmt --check` (提交前必须零差异)
- **DB Migration**: `sqlx migrate run`；新增迁移 `sqlx migrate add <name>`
- **离线查询缓存**: `cargo sqlx prepare` (CI/沙盒无数据库时必做)

## 🎨 Styles & Architecture Patterns
- **目录分配规范**：
  - **入口层**：`src/main.rs` 只做配置加载、状态装配与 `axum::serve` 启动，禁止业务逻辑。
  - **路由层 (Routes)**：HTTP 处理器在 `src/routes/`，只负责提取器解析、调用 service、构造响应。
  - **业务逻辑层 (Services)**：跨实体编排、外部服务调用集中在 `src/services/`。
  - **数据访问层 (Repositories)**：所有 SQLx 查询集中在 `src/repositories/`，禁止在 handler 内联 SQL。
  - **领域模型 (Domain)**：`src/domain/` 存放核心类型与校验逻辑，与框架解耦。
- **安全与编码准则**：
  - 错误处理统一使用 `thiserror` 定义 `AppError` 并实现 `IntoResponse`，禁止使用 `unwrap()` / `expect()` 处理运行时错误（测试与 main 启动期除外）。
  - 所有请求体必须通过 serde + validator 校验，禁止信任未校验的输入直接入库。
  - 共享状态通过 `axum::extract::State<Arc<AppState>>` 注入，禁止全局可变静态变量（`static mut` 一律禁止）。
  - 单个 handler 超过 50 行，必须将逻辑下沉到 `src/services/`。
- **异步纪律**：
  - 禁止在 async 上下文中执行阻塞调用（`std::fs`、同步 HTTP 客户端）；必须使用时用 `tokio::task::spawn_blocking`。
  - 禁止持有锁跨 `.await`（`std::sync::MutexGuard`）；需要时用 `tokio::sync::Mutex` 并尽量缩短临界区。
- **配置规范**：
  - 配置统一在 `src/config.rs` 用环境变量加载（`dotenvy` 仅限本地），禁止硬编码密钥与连接串。

## 🔄 AI 循环防范 (Anti-Loop Safeguards)
- **编译修复级联**：
  - 修复 borrow checker / 生命周期报错时，若修改 1 个文件引发 3 个以上文件的新错误，立即停止。列出完整的依赖链（A → B → C），报告人类审核后再继续。
  - 禁止用 `.clone()` 满天飞或 `Arc<Mutex<>>` 一把梭来压制借用检查错误；每次引入 `unsafe` 必须先在回复中写明理由并获得人类确认。
- **依赖安装循环**：
  - `cargo fetch` / `cargo add` 失败后最多重试 2 次，第 3 次立即停止并报告。
  - 禁止在循环中反复升降 crate 版本碰撞兼容组合；禁止未经批准引入 `patch` 段。
- **SQLx 离线缓存失效循环**：
  - `cargo sqlx prepare` 生成的 `.sqlx/` 与查询不一致时，重新 prepare 一次；第 2 次仍不一致，停止并输出数据库 schema 差异报告。
  - 禁止删除 `.sqlx/` 缓存来「绕过」CI 编译。
- **clippy 抑制滥用**：
  - 禁止用 `#![allow(clippy::all)]` 或批量 `#[allow]` 让 lint 静默；单个豁免必须逐条写明注释理由。

## 🏗️ 沙盒与环境边界 (Sandbox & Environment Boundaries)
- **端口隔离**：
  - 开发服务器固定使用 `localhost:3000`。如端口被占用，执行 `lsof -i :3000` 诊断，禁止自行切换随机端口。
  - 数据库端口（PostgreSQL 5432）仅限容器内部或本地连接，禁止暴露到 `0.0.0.0`。
- **连接拒绝排查流程**（最多 3 步，超出则报告人类）：
  1. 检查端口监听状态：`lsof -i :<port>` 或 `ss -tlnp | grep <port>`
  2. 检查目标服务是否启动：`docker ps` 或 `systemctl status <service>`
  3. 检查网络连通性：`curl -v http://localhost:<port>/health`
- **分支安全**：
  - 在「main」「master」「production」「release/*」分支上，禁止直接执行 `sqlx migrate run` 或 `sqlx migrate revert`，必须先通过 PR review。
  - 禁止在上述分支执行 `DROP TABLE`、`TRUNCATE` 等破坏性 SQL。
- **容器与主机隔离**：
  - 容器内数据库 host 使用服务名（如「db」），主机上使用「localhost」。混用会导致连接失败。

## 🛑 Agent Boundary & Hard Rules (安全红线)
- **只读目录/文件限制**：
  - 严禁手工编辑 `Cargo.lock`（只允许通过 cargo 命令变更）。
  - 严禁修改 `src/config.rs` 以绕过环境变量校验（如把必填改可选）。
- **密钥与提交安全**：
  - 严禁将含有敏感账户密码及 Token 的 `.env` 文件提交进 Git；提交前必须运行 `git diff --cached | grep -iE "(secret|token|password)"` 自检。
- **CORS 生产约束**：
  - `tower_http::cors::CorsLayer::permissive()` 仅限本地开发；生产必须使用 `CorsLayer` 显式白名单 `allow_origin`。
  - 部署配置中出现 `ALLOW_ORIGINS=*` 视为安全漏洞，必须修复后才能继续。
- **执行权限约束**：
  - 禁止 `sudo cargo install`；`CARGO_HOME` 必须位于用户目录下。
  - 禁止在生产构建中设置 `RUSTFLAGS` 关闭 debug assert 之外的任何检查类 flag。

---

## 🌐 English Version

# 🤖 Rust (Axum) Agent Collaboration Protocol (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: Rust 1.78+ (2021 edition), Axum, Tokio, SQLx (compile-time checked queries), Tower middleware.
- **Serialization**: serde / serde_json; validation via validator.
- **Database**: PostgreSQL (preferred) / SQLite (local & tests).

## 💻 Developer Commands
- **Install/Sync Dependencies**: `cargo fetch` (run only after Cargo.toml changes)
- **Dev Server**: `cargo run` (port: localhost:3000; use `cargo watch -x run` for live reload)
- **Run Tests**: `cargo test`
- **Lint**: `cargo clippy --all-targets --all-features -- -D warnings`
- **Format**: `cargo fmt --check` (must be zero-diff before commit)
- **DB Migration**: `sqlx migrate run`; create with `sqlx migrate add <name>`
- **Offline Query Cache**: `cargo sqlx prepare` (mandatory for CI/sandbox without a database)

## 🎨 Styles & Architecture Patterns
- **Directory Structure Conventions**:
  - **Entrypoint**: `src/main.rs` only loads config, assembles state, and starts `axum::serve`; no business logic.
  - **Routes**: HTTP handlers in `src/routes/` — extractor parsing, service calls, response building only.
  - **Services**: Cross-entity orchestration and third-party calls live in `src/services/`.
  - **Repositories**: All SQLx queries are centralized in `src/repositories/`; inline SQL in handlers is forbidden.
  - **Domain**: `src/domain/` holds core types and validation logic, decoupled from the framework.
- **Coding Standards**:
  - Errors use a unified `AppError` via `thiserror` implementing `IntoResponse`; `unwrap()` / `expect()` on runtime errors is forbidden (tests and boot-time main excepted).
  - All request bodies must be validated via serde + validator; unvalidated input must never reach the database.
  - Shared state is injected via `axum::extract::State<Arc<AppState>>`; mutable global statics (`static mut`) are forbidden.
  - Handlers over 50 lines must push logic down into `src/services/`.
- **Async Discipline**:
  - No blocking calls (`std::fs`, sync HTTP clients) inside async contexts; use `tokio::task::spawn_blocking` when unavoidable.
  - Never hold a `std::sync::MutexGuard` across `.await`; use `tokio::sync::Mutex` with minimal critical sections.
- **Configuration**:
  - Config is loaded in `src/config.rs` from environment variables (`dotenvy` for local only); hard-coded secrets and DSNs are forbidden.

## 🔄 Anti-Loop Safeguards
- **Compile Fix Cascades**:
  - When fixing borrow-checker / lifetime errors, if modifying 1 file triggers new errors in 3+ files, stop immediately. List the dependency chain (A → B → C) and report before proceeding.
  - Do not suppress borrow errors with scattershot `.clone()` or blanket `Arc<Mutex<>>`; every `unsafe` block requires a written justification and human approval first.
- **Dependency Install Loops**:
  - After `cargo fetch` / `cargo add` failure, retry at most 2 times; halt and report on the 3rd.
  - Do not bounce crate versions hoping for compatibility; adding `[patch]` sections without approval is forbidden.
- **SQLx Offline Cache Loops**:
  - If `.sqlx/` cache mismatches the queries, re-run `cargo sqlx prepare` once; if it still mismatches, stop and output the schema diff report.
  - Deleting `.sqlx/` to "bypass" CI compilation is forbidden.
- **Clippy Suppression Abuse**:
  - `#![allow(clippy::all)]` and blanket `#[allow]` are forbidden; each individual exemption needs an inline justification comment.

## 🏗️ Sandbox & Environment Boundaries
- **Port Isolation**:
  - The dev server is fixed to `localhost:3000`. If occupied, diagnose with `lsof -i :3000`; silently switching ports is forbidden.
  - Database ports (PostgreSQL 5432) accept local or container-internal connections only. Binding to `0.0.0.0` is forbidden.
- **Connection Refused Troubleshooting** (max 3 steps, then escalate):
  1. Check listening ports: `lsof -i :<port>` or `ss -tlnp | grep <port>`
  2. Check service status: `docker ps` or `systemctl status <service>`
  3. Check connectivity: `curl -v http://localhost:<port>/health`
- **Branch Safety**:
  - On `main`, `master`, `production`, or `release/*` branches, running `sqlx migrate run` / `revert` directly is forbidden without PR review.
  - Destructive SQL (`DROP TABLE`, `TRUNCATE`) is forbidden on these branches.
- **Container vs Host Isolation**:
  - DB host is the service name (e.g. `db`) inside containers and `localhost` on the host. Mixing them causes connection failures.

## 🛑 Agent Boundary & Hard Rules
- **Read-Only / Protected Files**:
  - Never hand-edit `Cargo.lock`; changes go through cargo commands only.
  - Do not modify `src/config.rs` to bypass environment validation (e.g. downgrading required vars to optional).
- **Secrets & Commit Safety**:
  - `.env` files with live credentials must never be committed; run `git diff --cached | grep -iE "(secret|token|password)"` before every commit.
- **CORS Production Constraints**:
  - `tower_http::cors::CorsLayer::permissive()` is local-dev only; production must use an explicit `allow_origin` whitelist.
  - `ALLOW_ORIGINS=*` in deployment configs is treated as a security vulnerability and must be fixed before proceeding.
- **Execution Privilege Constraints**:
  - `sudo cargo install` is forbidden; `CARGO_HOME` must live under the user directory.
  - Do not set `RUSTFLAGS` in production builds to disable any check-class flags beyond debug asserts.
