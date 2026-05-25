# 🤖 FastAPI (Python) 专属智能体协作规约 (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2.0 (or Tortoise ORM), Alembic.
- **Async & Server**: Uvicorn, Asyncio.
- **Database**: PostgreSQL / MySQL.

## 💻 Developer Commands
- **Install Dependencies**: `poetry install` (若使用 Poetry) 或 `pip install -r requirements.txt` (仅在依赖发生变更时运行)
- **Dev Server**: `uvicorn app.main:app --reload` (侦听端口：localhost:8000)
- **Run Tests**: `pytest`
- **DB Migration (Generate)**: `alembic revision --autogenerate -m "migration_message"`
- **DB Migration (Apply)**: `alembic upgrade head`

## 🎨 Styles & Architecture Patterns
- **目录分配规范**：
  - **接口层 (API Routes)**：统一存放于 `app/api/` 目录下。
  - **数据库模型层 (Models)**：存放于 `app/models/`，所有数据模型继承 base。
  - **业务逻辑层 (Services)**：强逻辑、复杂计算、以及包含外部服务（如支付、短信）调用的方法，必须提取至 `app/services/` 目录中。
  - **输入/输出数据校验 (Schemas)**：所有的请求体与响应体定义，强制在 `app/schemas/` 下使用 Pydantic v2 定义。
- **安全与编码准则**：
  - 所有 API Route 的参数接收及返回，**必须显式定义 response_model** 限制字段溢出与敏感字段泄漏。
  - 针对所有的数据库写操作，优先使用异步 DB 会话驱动 (`AsyncSession`)。
  - 单个路由函数代码行数限制：如果超过 50 行，必须将业务逻辑提炼到 `app/services/` 对应的服务类中。
- **环境隔离与依赖规范**：
  - 所有 Python 命令必须通过「poetry run」或「.venv/bin/」前缀执行，严禁污染全局 Python 环境。
  - 示例：`poetry run pytest`、`poetry run uvicorn app.main:app --reload`、`.venv/bin/python -m pytest`。
  - 直接使用裸命令「pip install」「python」「pytest」视为违规，除非已确认处于激活的虚拟环境中。
- **Pydantic 版本约束**：
  - 项目统一使用 Pydantic v2。严禁使用 v1 兼容层（如 `from pydantic.v1 import ...`）。
  - 禁止使用已废弃的 v1 API：`validator`、`root_validator`、`Config` 内部类。统一迁移至 `field_validator`、`model_validator`、`model_config`。
  - Schema 定义中，字段类型注解必须使用 Python 原生类型（`str`、`int`、`list[str]`），禁止使用已弃用的 `pydantic.Field(...)` 旧签名。
- **CORS 配置安全**：
  - 本地开发环境可使用 `allow_origins=["*"]`。
  - 非本地环境（staging / production）中，`CORSMiddleware` 的「allow_origins」必须显式列出允许的域名列表，严禁使用通配符 `*`。

## 🔄 AI 循环防范 (Anti-Loop Safeguards)
- **依赖安装循环**：
  - `poetry install` 或 `pip install` 失败后，最多重试 2 次。第 3 次失败时立即停止，向人类报告错误日志并请求介入。
  - 禁止在循环中反复修改「pyproject.toml」或「requirements.txt」版本号试图碰撞兼容组合。
- **Pydantic v1/v2 迁移循环**：
  - 若修复 Pydantic v2 迁移问题时，修改文件 A 导致文件 B/C 出现新的类型错误，立即停止。列出完整的依赖链（A → B → C），报告人类审核后再继续。
  - 禁止为绕过类型检查而添加 `type: ignore` 注释。
- **Alembic 迁移冲突**：
  - 出现 `alembic heads` 返回多个 head 时，禁止自动 merge。停止操作，报告冲突分支信息，等待人类决策。
  - 若 `alembic upgrade head` 连续失败 2 次，停止重试并输出完整错误堆栈。
- **类型/编译级联**：
  - 修复 mypy / pyright 类型错误时，若修改 1 个文件引发 3 个以上文件的新错误，立即停止并报告级联链。

## 🏗️ 沙盒与环境边界 (Sandbox & Environment Boundaries)
- **端口隔离**：
  - Uvicorn 开发服务器固定使用 `localhost:8000`。如端口被占用，执行 `lsof -i :8000` 诊断占用进程，禁止自行切换到随机端口。
  - 数据库端口（PostgreSQL 5432 / MySQL 3306）仅限容器内部或本地连接，禁止暴露到 `0.0.0.0`。
- **连接拒绝排查流程**（最多 3 步，超出则报告人类）：
  1. 检查端口监听状态：`lsof -i :<port>` 或 `ss -tlnp | grep <port>`
  2. 检查目标服务是否启动：`docker ps` 或 `systemctl status <service>`
  3. 检查网络/防火墙：`curl -v http://localhost:<port>/health`
- **分支安全**：
  - 在「main」「master」「production」「release/*」分支上，禁止直接执行 `alembic upgrade head`。必须先通过 PR review。
  - 禁止在上述分支上执行 `alembic downgrade`、`DROP TABLE`、`DROP DATABASE` 等破坏性命令。
- **容器与主机隔离**：
  - 容器内服务通过 Docker 网络互连，主机通过端口映射访问。
  - 数据库连接字符串中的 host 值：容器内使用服务名（如「db」「postgres」），主机上使用「localhost」或「127.0.0.1」。混用会导致连接失败。

## 🛑 Agent Boundary & Hard Rules (安全红线)
- **只读目录/文件限制**：
  - 严禁擅自修改 `app/core/config.py`（核心系统配置）。所有配置的读取均需通过 Pydantic `BaseSettings` 动态抓取环境变量或本地 `.env`。
- **数据库迁移前安全检查**：
  - 在运行 `alembic revision --autogenerate` 后，智能体必须强制检查自动生成的 `versions/` 下的迁移脚本，确认没有生成错误的 DDL（如无意的 `drop_table` 或 `drop_column`）。
  - 严禁将含有敏感账户密码及 Token 的 `.env` 配置文件提交进 Git。
- **环境隔离强制执行**：
  - 所有 Python 执行入口必须经过虚拟环境。若检测到当前环境为系统级 Python（`which python` 输出为 `/usr/bin/python` 或 `/usr/local/bin/python`），立即停止并提示激活虚拟环境。
  - 禁止使用 `sudo pip install`。
- **CORS 生产约束**：
  - 部署配置文件（如「docker-compose.prod.yml」「.env.production」）中出现 `CORS_ORIGINS=*` 视为安全漏洞，必须修复后才能继续。
  - 智能体在修改 CORS 相关代码时，必须同时检查对应的环境配置文件。

---

## 🌐 English Version

# 🤖 FastAPI Agent Collaboration Protocol (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2.0 (or Tortoise ORM), Alembic.
- **Async & Server**: Uvicorn, Asyncio.
- **Database**: PostgreSQL / MySQL.

## 💻 Developer Commands
- **Install Dependencies**: `poetry install` (if using Poetry) or `pip install -r requirements.txt` (run only when dependency definitions change)
- **Dev Server**: `uvicorn app.main:app --reload` (listening port: localhost:8000)
- **Run Tests**: `pytest`
- **DB Migration (Generate)**: `alembic revision --autogenerate -m "migration_message"`
- **DB Migration (Apply)**: `alembic upgrade head`

## 🎨 Styles & Architecture Patterns
- **Directory Structure Conventions**:
  - **API Routes**: Centralized under `app/api/`.
  - **DB Models**: Centralized under `app/models/` (inheriting from unified Base).
  - **Business Logic (Services)**: Multi-step orchestrations, third-party integrations (e.g. Stripe, SendGrid) must be placed in `app/services/`.
  - **Schemas (Validation)**: Request body and response parsing schemas must be created using Pydantic v2 under `app/schemas/`.
- **Coding Standards**:
  - All API routes must define a `response_model` explicitly to prevent accidental database record/password exposure.
  - Database writes must leverage asynchronous sessions (`AsyncSession`) to maximize performance.
  - Route function size limit: If an API endpoint contains more than 50 lines of code, the core logic must be moved to service layers under `app/services/`.
- **Environment Isolation & Dependency Rules**:
  - All Python commands must be prefixed with `poetry run` or `.venv/bin/`. Global Python environment pollution is forbidden.
  - Examples: `poetry run pytest`, `poetry run uvicorn app.main:app --reload`, `.venv/bin/python -m pytest`.
  - Bare commands like `pip install`, `python`, `pytest` are violations unless the virtual environment is confirmed active.
- **Pydantic Version Constraints**:
  - The project uses Pydantic v2 exclusively. The v1 compatibility layer (`from pydantic.v1 import ...`) is forbidden.
  - Deprecated v1 APIs are banned: `validator`, `root_validator`, `Config` inner class. Use `field_validator`, `model_validator`, `model_config` instead.
  - Schema field annotations must use native Python types (`str`, `int`, `list[str]`). Deprecated `pydantic.Field(...)` signatures are forbidden.
- **CORS Configuration Security**:
  - `allow_origins=["*"]` is permitted only in local development.
  - In non-local environments (staging / production), `CORSMiddleware` `allow_origins` must explicitly list allowed domains. Wildcards are forbidden.

## 🔄 Anti-Loop Safeguards
- **Dependency Install Loops**:
  - After `poetry install` or `pip install` failure, retry at most 2 times. On the 3rd failure, halt immediately and report the error log to the human for intervention.
  - Do not iteratively modify `pyproject.toml` or `requirements.txt` version pins trying to brute-force compatibility.
- **Pydantic v1/v2 Migration Loops**:
  - If fixing a Pydantic v2 migration issue in file A causes new type errors in files B/C, stop immediately. List the full dependency chain (A → B → C) and report to the human before proceeding.
  - Adding `type: ignore` comments to bypass type checks is forbidden.
- **Alembic Migration Conflicts**:
  - When `alembic heads` returns multiple heads, do not auto-merge. Stop, report the conflicting branch info, and wait for human decision.
  - If `alembic upgrade head` fails 2 consecutive times, stop retrying and output the full error stack.
- **Type/Compile Cascades**:
  - When fixing mypy / pyright type errors, if modifying 1 file triggers new errors in 3+ files, stop immediately and report the cascade chain.

## 🏗️ Sandbox & Environment Boundaries
- **Port Isolation**:
  - Uvicorn dev server is fixed to `localhost:8000`. If the port is occupied, run `lsof -i :8000` to diagnose. Do not silently switch to a random port.
  - Database ports (PostgreSQL 5432 / MySQL 3306) must only accept local or container-internal connections. Binding to `0.0.0.0` is forbidden.
- **Connection Refused Troubleshooting** (max 3 steps, then escalate to human):
  1. Check port listening: `lsof -i :<port>` or `ss -tlnp | grep <port>`
  2. Check service status: `docker ps` or `systemctl status <service>`
  3. Check network/firewall: `curl -v http://localhost:<port>/health`
- **Branch Safety**:
  - On `main`, `master`, `production`, or `release/*` branches, `alembic upgrade head` is forbidden without prior PR review.
  - Destructive commands (`alembic downgrade`, `DROP TABLE`, `DROP DATABASE`) are forbidden on these branches.
- **Container vs Host Isolation**:
  - Container services communicate via Docker networks; host access is through port mapping only.
  - Database connection host values: use service names (e.g. `db`, `postgres`) inside containers, use `localhost` or `127.0.0.1` on the host. Mixing these causes connection failures.

## 🛑 Agent Boundary & Hard Rules
- **Read-Only / Protected Files**:
  - Do not modify `app/core/config.py` without explicit permission. All app variables must inherit from Pydantic `BaseSettings` reading dynamic OS environments or local `.env` files.
- **Database Migration Controls**:
  - After executing `alembic revision --autogenerate`, the agent must inspect the generated DDL files in `versions/` to verify no accidental destructive queries (such as drop table or rename columns) are present.
  - Under no circumstances should `.env` files containing live credentials or secret keys be committed to Git.
- **Environment Isolation Enforcement**:
  - All Python entry points must go through the virtual environment. If the current environment is detected as system-level Python (`which python` outputs `/usr/bin/python` or `/usr/local/bin/python`), halt immediately and prompt virtual environment activation.
  - `sudo pip install` is forbidden.
- **CORS Production Constraints**:
  - `CORS_ORIGINS=*` in deployment config files (e.g. `docker-compose.prod.yml`, `.env.production`) is treated as a security vulnerability and must be fixed before proceeding.
  - When modifying CORS-related code, the agent must also verify the corresponding environment configuration files.
