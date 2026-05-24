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

## 🛑 Agent Boundary & Hard Rules (安全红线)
- **只读目录/文件限制**：
  - 严禁擅自修改 `app/core/config.py`（核心系统配置）。所有配置的读取均需通过 Pydantic `BaseSettings` 动态抓取环境变量或本地 `.env`。
- **数据库迁移前安全检查**：
  - 在运行 `alembic revision --autogenerate` 后，智能体必须强制检查自动生成的 `versions/` 下的迁移脚本，确认没有生成错误的 DDL（如无意的 `drop_table` 或 `drop_column`）。
  - 严禁将含有敏感账户密码及 Token 的 `.env` 配置文件提交进 Git。

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

## 🛑 Agent Boundary & Hard Rules
- **Read-Only / Protected Files**:
  - Do not modify `app/core/config.py` without explicit permission. All app variables must inherit from Pydantic `BaseSettings` reading dynamic OS environments or local `.env` files.
- **Database Migration Controls**:
  - After executing `alembic revision --autogenerate`, the agent must inspect the generated DDL files in `versions/` to verify no accidental destructive queries (such as drop table or rename columns) are present.
  - Under no circumstances should `.env` files containing live credentials or secret keys be committed to Git.
