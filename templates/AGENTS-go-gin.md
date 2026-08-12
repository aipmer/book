# 🤖 Go (Gin/Fiber) 专属智能体协作规约 (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: Go 1.22+, Gin (or Fiber), GORM (or sqlc), Wire/fx (依赖注入可选)。
- **Database**: PostgreSQL / MySQL / Redis。
- **Layout**: 标准 Go 项目布局（golang-standards/project-layout）。

## 💻 Developer Commands
- **Install Dependencies**: `go mod tidy` (仅在 go.mod 变更后运行)
- **Dev Server**: `go run ./cmd/api` (侦听端口：localhost:8080；热重载可用 `air`)
- **Run Tests**: `go test ./...`
- **Race Detector**: `go test -race ./...` (并发代码合并前必须运行)
- **Lint**: `golangci-lint run`
- **Build**: `go build -o bin/api ./cmd/api`

## 🎨 Styles & Architecture Patterns
- **目录分配规范**：
  - **入口层 (Entrypoint)**：`cmd/api/main.go` 只做依赖装配与启动，禁止写业务逻辑。
  - **接口层 (Handlers)**：HTTP 处理器统一存放于 `internal/handler/`，只负责参数解析、调用 service、返回响应。
  - **业务逻辑层 (Services)**：跨实体编排、外部服务调用（支付、短信、对象存储）必须提取至 `internal/service/`。
  - **数据访问层 (Repository)**：所有 SQL/GORM 调用集中在 `internal/repository/`，禁止在 handler 中直接写查询。
  - **禁止 `internal/` 之外的包引用内部实现**；对外可复用的 SDK 才放入 `pkg/`。
- **安全与编码准则**：
  - 所有必须返回 JSON 的接口使用统一的 `response.JSON(c, code, data, err)` 包装，禁止散落 `c.JSON` 裸调用。
  - 错误处理必须向上返回 `error` 并用 `fmt.Errorf("...: %w", err)` 包装上下文，禁止 `panic` 或静默 `_ =` 吞错。
  - 每个 HTTP 请求链路必须传递 `context.Context`，数据库与外部调用必须支持超时取消。
  - 单个 handler 函数超过 50 行，必须将逻辑下沉到 `internal/service/`。
- **并发纪律**：
  - 启动 goroutine 必须有明确的退出机制（context 取消或 WaitGroup 回收），禁止「启动后不管」的裸 `go func()`。
  - 共享状态必须使用 `sync.Mutex` / `sync.RWMutex` 或 channel 保护，合并前 `-race` 必须零报告。
- **配置规范**：
  - 配置统一通过 `internal/config` 用环境变量加载（`envconfig` 或 `viper`），禁止硬编码密钥与连接串。

## 🔄 AI 循环防范 (Anti-Loop Safeguards)
- **依赖安装循环**：
  - `go mod tidy` / `go get` 失败后最多重试 2 次，第 3 次立即停止，向人类报告错误并请求介入。
  - 禁止在循环中反复升降 `go.mod` 里的版本号碰撞兼容组合；禁止未经批准引入 `replace` 指令。
- **接口重构级联**：
  - 修改某个 interface 或 struct 定义导致 3 个以上文件编译失败时，立即停止。列出完整的依赖链（A → B → C），报告人类审核后再继续。
  - 禁止为绕过编译错误而给接口加 `_ interface{}` 空实现或滥用 `any`。
- **数据竞争修复循环**：
  - `-race` 报告的竞争禁止用「加全局大锁」一把梭掩盖；若同一处竞争修复后再次出现，停止并报告锁粒度设计，等待人类决策。
- **GORM 迁移冲突**：
  - `AutoMigrate` 检测到将产生 `DROP COLUMN` / `DROP TABLE` 时禁止执行，输出差异报告并等待人类确认。

## 🏗️ 沙盒与环境边界 (Sandbox & Environment Boundaries)
- **端口隔离**：
  - 开发服务器固定使用 `localhost:8080`。如端口被占用，执行 `lsof -i :8080` 诊断占用进程，禁止自行切换随机端口。
  - 数据库端口（PostgreSQL 5432 / MySQL 3306 / Redis 6379）仅限容器内部或本地连接，禁止暴露到 `0.0.0.0`。
- **连接拒绝排查流程**（最多 3 步，超出则报告人类）：
  1. 检查端口监听状态：`lsof -i :<port>` 或 `ss -tlnp | grep <port>`
  2. 检查目标服务是否启动：`docker ps` 或 `systemctl status <service>`
  3. 检查网络连通性：`curl -v http://localhost:<port>/healthz`
- **分支安全**：
  - 在「main」「master」「production」「release/*」分支上，禁止直接执行数据库迁移或 `go clean -modcache`。
  - 禁止在上述分支执行 `DROP TABLE`、`TRUNCATE` 等破坏性 SQL。
- **容器与主机隔离**：
  - 容器内服务通过 Docker 网络互连；数据库连接 host 在容器内使用服务名（如「db」），主机上使用「localhost」。混用会导致连接失败。

## 🛑 Agent Boundary & Hard Rules (安全红线)
- **只读目录/文件限制**：
  - 严禁擅自修改 `go.mod` / `go.sum` 的手工编辑（只允许通过 `go get` / `go mod tidy` 变更）。
  - 严禁修改 `internal/config/` 的加载逻辑以绕过环境变量校验。
- **密钥与提交安全**：
  - 严禁将含有敏感账户密码及 Token 的 `.env` 文件提交进 Git；提交前必须运行 `git diff --cached | grep -iE "(secret|token|password)"` 自检。
- **CORS 生产约束**：
  - Gin 的 `cors.Default()`（允许所有来源）仅限本地开发；生产配置必须显式列出 `AllowOrigins` 域名列表。
  - 部署文件中出现 `ALLOW_ORIGINS=*` 视为安全漏洞，必须修复后才能继续。
- **执行权限约束**：
  - 禁止 `sudo go install`；GOBIN 必须位于用户目录下。

---

## 🌐 English Version

# 🤖 Go (Gin/Fiber) Agent Collaboration Protocol (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: Go 1.22+, Gin (or Fiber), GORM (or sqlc), Wire/fx (optional DI).
- **Database**: PostgreSQL / MySQL / Redis.
- **Layout**: Standard Go project layout (golang-standards/project-layout).

## 💻 Developer Commands
- **Install Dependencies**: `go mod tidy` (run only after go.mod changes)
- **Dev Server**: `go run ./cmd/api` (port: localhost:8080; use `air` for live reload)
- **Run Tests**: `go test ./...`
- **Race Detector**: `go test -race ./...` (mandatory before merging concurrent code)
- **Lint**: `golangci-lint run`
- **Build**: `go build -o bin/api ./cmd/api`

## 🎨 Styles & Architecture Patterns
- **Directory Structure Conventions**:
  - **Entrypoint**: `cmd/api/main.go` only wires dependencies and boots the server; no business logic.
  - **Handlers**: HTTP handlers live in `internal/handler/` — parse input, call services, write responses only.
  - **Services**: Cross-entity orchestration and third-party calls (payments, SMS, object storage) go to `internal/service/`.
  - **Repository**: All SQL/GORM calls are centralized in `internal/repository/`; raw queries in handlers are forbidden.
  - Nothing outside `internal/` may import internal implementation details; reusable SDKs belong in `pkg/`.
- **Coding Standards**:
  - All JSON endpoints use a unified `response.JSON(c, code, data, err)` wrapper; scattered raw `c.JSON` calls are forbidden.
  - Errors must be returned upward wrapped with `fmt.Errorf("...: %w", err)`; `panic` and silently swallowing with `_ =` are forbidden.
  - Every request path must propagate `context.Context`; DB and external calls must honor timeouts/cancellation.
  - Handler functions over 50 lines must push logic down into `internal/service/`.
- **Concurrency Discipline**:
  - Every goroutine needs an explicit exit path (context cancellation or WaitGroup); fire-and-forget bare `go func()` is forbidden.
  - Shared state must be guarded by `sync.Mutex` / `sync.RWMutex` or channels; `-race` must report zero before merge.
- **Configuration**:
  - Config is loaded via `internal/config` from environment variables (`envconfig` or `viper`); hard-coded secrets and DSNs are forbidden.

## 🔄 Anti-Loop Safeguards
- **Dependency Install Loops**:
  - After `go mod tidy` / `go get` failure, retry at most 2 times; on the 3rd failure halt and report to the human.
  - Do not bounce version pins in `go.mod` hoping for a compatible combination; adding `replace` directives without approval is forbidden.
- **Interface Refactor Cascades**:
  - If changing an interface or struct breaks compilation in 3+ files, stop immediately. List the dependency chain (A → B → C) and report before proceeding.
  - Do not silence compile errors with blank `_ interface{}` implementations or indiscriminate `any`.
- **Data Race Fix Loops**:
  - Do not hide `-race` reports behind one giant global lock; if the same race reappears after a fix, stop and report the lock-granularity design for human review.
- **GORM Migration Conflicts**:
  - If `AutoMigrate` would produce `DROP COLUMN` / `DROP TABLE`, execution is forbidden — output the diff and wait for human confirmation.

## 🏗️ Sandbox & Environment Boundaries
- **Port Isolation**:
  - The dev server is fixed to `localhost:8080`. If occupied, diagnose with `lsof -i :8080`; silently switching ports is forbidden.
  - Database ports (PostgreSQL 5432 / MySQL 3306 / Redis 6379) accept local or container-internal connections only. Binding to `0.0.0.0` is forbidden.
- **Connection Refused Troubleshooting** (max 3 steps, then escalate):
  1. Check listening ports: `lsof -i :<port>` or `ss -tlnp | grep <port>`
  2. Check service status: `docker ps` or `systemctl status <service>`
  3. Check connectivity: `curl -v http://localhost:<port>/healthz`
- **Branch Safety**:
  - On `main`, `master`, `production`, or `release/*` branches, running DB migrations or `go clean -modcache` directly is forbidden.
  - Destructive SQL (`DROP TABLE`, `TRUNCATE`) is forbidden on these branches.
- **Container vs Host Isolation**:
  - Containers communicate over Docker networks; DB host is the service name (e.g. `db`) inside containers and `localhost` on the host. Mixing them causes connection failures.

## 🛑 Agent Boundary & Hard Rules
- **Read-Only / Protected Files**:
  - Never hand-edit `go.mod` / `go.sum`; changes go through `go get` / `go mod tidy` only.
  - Do not modify `internal/config/` loading logic to bypass environment validation.
- **Secrets & Commit Safety**:
  - `.env` files with live credentials or tokens must never be committed; run `git diff --cached | grep -iE "(secret|token|password)"` before every commit.
- **CORS Production Constraints**:
  - Gin's `cors.Default()` (allow all origins) is local-dev only; production must explicitly list `AllowOrigins`.
  - `ALLOW_ORIGINS=*` in deployment files is treated as a security vulnerability and must be fixed before proceeding.
- **Execution Privilege Constraints**:
  - `sudo go install` is forbidden; GOBIN must live under the user directory.
