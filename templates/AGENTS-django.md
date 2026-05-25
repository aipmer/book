# 🤖 Django (Python) Backend 专属智能体协作规约 (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: Python 3.11+, Django 5.x, Django REST Framework (DRF).
- **ORM & DB**: Django ORM, PostgreSQL.
- **Task Queue**: Celery + Redis.

## 💻 Developer Commands
- **Install Dependencies**: `pip install -r requirements.txt` (仅在 Python 依赖文件变更时执行)
- **Dev Server**: `python manage.py runserver` (端口：localhost:8000)
- **Run Tests**: `pytest` 或 `python manage.py test`
- **Lint & Format**: `flake8` && `black --check .`
- **Make Migrations**: `python manage.py makemigrations`
- **Apply Migrations**: `python manage.py migrate`

## 🎨 Styles & Architecture Patterns
- **目录及代码结构规范**：
  - 采用 **Fat Models, Thin Views, Service Layer** 设计模式。
  - **业务逻辑隔离**：复杂的计算、第三方集成及写操作强制写入 `services/` 目录下的服务类中，严禁堆砌在 `views.py` 或 Serializers 中。
  - **数据序列化**：DRF 接口进出参必须通过 `serializers.py` 进行数据校验与清洗。
  - **测试结构**：测试用例存放在各 App 下的 `tests/` 目录中，以 `test_*.py` 命名。
- **编码与异常处理**：
  - 严禁在 View 中直接使用 `try-except Exception` 吞掉异常。所有未处理异常应由 DRF 自带的 `exception_handler` 捕获。
  - 数据库查询时，针对多对多（Many-to-Many）和一对多（One-to-Many）关系，智能体在编写查询语句时**必须显式使用 `select_related` 或 `prefetch_related`**，杜绝 N+1 查询隐患。
- **SECRET_KEY 与敏感配置管理**：
  - 「SECRET_KEY」必须且只能通过「django-environ」读取，禁止在「settings.py」中硬编码。
  - 读取方式标准写法：`env("SECRET_KEY")`，禁止提供默认值（即禁止 `env("SECRET_KEY", default="...")`）。
  - 所有第三方 API Key、数据库密码均遵循同一规则，通过「.env」文件注入。
- **Model 变更与迁移工作流**：
  - 任何 Model 字段修改后，必须先执行 `python manage.py makemigrations`。
  - 生成迁移文件后，必须执行 `python manage.py sqlmigrate <app_name> <migration_number>` 打印 SQL diff，确认无破坏性 DDL 后方可执行 `migrate`。
  - 禁止跳过 diff 审查直接执行 `python manage.py migrate`。
- **N+1 查询预防**：
  - 所有涉及 ForeignKey 的 QuerySet，必须附带 `select_related()`。
  - 所有涉及 ManyToManyField 或反向关系的 QuerySet，必须附带 `prefetch_related()`。
  - 在 DRF Serializer 中使用嵌套 Serializer 时，对应的 ViewSet 必须在 `get_queryset()` 中配置预加载，禁止在 Serializer 内部触发额外查询。

## 🔄 AI 循环防范 (Anti-Loop Safeguards)
- **依赖安装循环**：
  - `pip install` 失败后，最多重试 2 次。第 3 次失败时立即停止，向人类报告完整错误日志并请求介入。
  - 禁止反复修改「requirements.txt」中的版本号试图碰撞兼容组合。应报告冲突的包名和版本约束，由人类决策。
- **迁移冲突循环**：
  - 执行 `makemigrations` 后出现「Conflicting migrations detected」错误时，禁止自动执行 `makemigrations --merge`。停止操作，列出冲突的迁移文件路径，等待人类审核。
  - 若 `migrate` 连续失败 2 次（同一迁移文件），停止重试，输出完整错误堆栈和当前 `showmigrations` 状态。
- **测试 Fixture 循环**：
  - 测试因数据库 Schema 不匹配失败时，禁止通过反复修改 fixture 数据来规避。必须先执行 `python manage.py showmigrations` 检查迁移状态，确认 DB Schema 与 Model 定义一致。
  - 禁止用 `unittest.mock.patch` 或 `MagicMock` 伪造 ORM 返回值来掩盖 Schema 错误。
- **类型/编译级联**：
  - 修复 mypy 类型错误时，若修改 1 个文件引发 3 个以上文件的新错误，立即停止并报告级联链。

## 🏗️ 沙盒与环境边界 (Sandbox & Environment Boundaries)
- **端口隔离**：
  - Django 开发服务器（`runserver`）固定使用 `localhost:8000`。端口被占用时，执行 `lsof -i :8000` 诊断占用进程，禁止自行切换到随机端口。
  - Celery Worker 和 Redis 使用默认端口（6379），禁止暴露到 `0.0.0.0`。
- **连接拒绝排查流程**（最多 3 步，超出则报告人类）：
  1. 检查端口监听状态：`lsof -i :<port>` 或 `ss -tlnp | grep <port>`
  2. 检查目标服务是否启动：`docker ps` 或 `systemctl status <service>`
  3. 检查网络/防火墙：`curl -v http://localhost:<port>/`
- **分支安全**：
  - 在「main」「master」「production」「release/*」分支上，禁止直接执行 `python manage.py migrate`。必须先通过 PR review 确认迁移文件安全。
  - 禁止在上述分支上执行 `migrate --fake`、`flush`、`sqlflush`、`DROP TABLE` 等破坏性命令。
- **容器与主机 DB 连接**：
  - 容器内 Django 连接数据库时，`DATABASES["default"]["HOST"]` 使用 Docker 服务名（如「db」「postgres」）。
  - 主机上开发时，使用「localhost」或「127.0.0.1」。
  - 混用会导致「Connection refused」错误。切换环境时，通过「.env」文件中的「DATABASE_HOST」变量控制，禁止硬编码。

## 🛑 Agent Boundary & Hard Rules (安全红线)
- **只读核心文件限制**：
  - 严禁修改项目主目录下的 `settings.py`。任何环境变量的读取均应通过「django-environ」包进行，且默认值必须安全。
- **环境安全**：
  - 严禁将含有数据库密码、密钥（如「SECRET_KEY」）的「.env」或「local_settings.py」写入 Git 版本控制。
  - 在执行任何 `makemigrations` 动作后，智能体必须检查生成的 `migrations/00XX_*.py` 迁移文件，确保没有无意中删除或重命名核心业务字段。
- **SECRET_KEY 隔离强制执行**：
  - 智能体在任何情况下，禁止在代码文件中写入明文「SECRET_KEY」值。
  - 若检测到「settings.py」中存在 `SECRET_KEY = "..."` 硬编码模式，必须立即将其替换为 `env("SECRET_KEY")` 并在「.env.example」中添加占位提示。
- **迁移验证工作流强制执行**：
  - 完整的迁移工作流为：`makemigrations` → `sqlmigrate` 审查 SQL → 人类确认 → `migrate`。
  - 智能体禁止跳过「sqlmigrate」审查步骤。若 SQL diff 包含 `DROP`、`ALTER ... RENAME`、`DELETE FROM` 等语句，必须高亮标记并等待人类确认。
  - 单次 PR 中的迁移文件数量超过 3 个时，智能体应主动提示人类审查迁移顺序和依赖关系。

---

## 🌐 English Version

# 🤖 Django (Python) Backend Agent Collaboration Protocol (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: Python 3.11+, Django 5.x, Django REST Framework (DRF).
- **ORM & DB**: Django ORM, PostgreSQL.
- **Task Queue**: Celery + Redis.

## 💻 Developer Commands
- **Install Dependencies**: `pip install -r requirements.txt` (only run when Python dependencies modify)
- **Dev Server**: `python manage.py runserver` (port: localhost:8000)
- **Run Tests**: `pytest` or `python manage.py test`
- **Lint & Format**: `flake8` && `black --check .`
- **Make Migrations**: `python manage.py makemigrations`
- **Apply Migrations**: `python manage.py migrate`

## 🎨 Styles & Architecture Patterns
- **Directory and Code Conventions**:
  - Follow the **Fat Models, Thin Views, Service Layer** design pattern.
  - **Logic Separation**: Complex calculations, third-party APIs, and write operations must be placed in service classes under `services/`, and are forbidden inside `views.py` or Serializers.
  - **Data Serialization**: Inbound and outbound endpoints must use DRF `serializers.py` for validation and cleaning.
  - **Tests Directory**: Test suites must reside under each app's `tests/` directory and follow the `test_*.py` naming convention.
- **Coding & Error Handling**:
  - Do not use generic `try-except Exception` statements inside views to silence errors. All unhandled errors must be captured by DRF's standard `exception_handler`.
  - Database Optimization: When querying many-to-many or foreign key relationships, the agent **must explicitly use `select_related` or `prefetch_related`** to prevent N+1 query overheads.
- **SECRET_KEY & Sensitive Config Management**:
  - `SECRET_KEY` must only be read via `django-environ`. Hardcoding it in `settings.py` is forbidden.
  - Standard pattern: `env("SECRET_KEY")`. Providing a default value (i.e. `env("SECRET_KEY", default="...")`) is forbidden.
  - All third-party API keys and database passwords follow the same rule, injected via `.env` files.
- **Model Change & Migration Workflow**:
  - After any Model field modification, run `python manage.py makemigrations` first.
  - After generating migration files, run `python manage.py sqlmigrate <app_name> <migration_number>` to print the SQL diff. Confirm no destructive DDL before running `migrate`.
  - Skipping the diff review and running `python manage.py migrate` directly is forbidden.
- **N+1 Query Prevention**:
  - All QuerySets involving ForeignKey must include `select_related()`.
  - All QuerySets involving ManyToManyField or reverse relations must include `prefetch_related()`.
  - When using nested Serializers in DRF, the corresponding ViewSet must configure prefetching in `get_queryset()`. Triggering extra queries inside Serializers is forbidden.

## 🔄 Anti-Loop Safeguards
- **Dependency Install Loops**:
  - After `pip install` failure, retry at most 2 times. On the 3rd failure, halt immediately and report the full error log to the human for intervention.
  - Do not iteratively modify version pins in `requirements.txt` trying to brute-force compatibility. Report the conflicting package names and version constraints; let the human decide.
- **Migration Conflict Loops**:
  - When `makemigrations` produces a "Conflicting migrations detected" error, do not auto-execute `makemigrations --merge`. Stop, list the conflicting migration file paths, and wait for human review.
  - If `migrate` fails 2 consecutive times on the same migration file, stop retrying and output the full error stack along with current `showmigrations` status.
- **Test Fixture Loops**:
  - When tests fail due to DB schema mismatch, do not repeatedly modify fixture data to work around it. Run `python manage.py showmigrations` first to verify migration state and confirm DB schema matches Model definitions.
  - Using `unittest.mock.patch` or `MagicMock` to fake ORM return values to hide schema errors is forbidden.
- **Type/Compile Cascades**:
  - When fixing mypy type errors, if modifying 1 file triggers new errors in 3+ files, stop immediately and report the cascade chain.

## 🏗️ Sandbox & Environment Boundaries
- **Port Isolation**:
  - Django dev server (`runserver`) is fixed to `localhost:8000`. If the port is occupied, run `lsof -i :8000` to diagnose. Do not silently switch to a random port.
  - Celery Worker and Redis use default ports (6379). Binding to `0.0.0.0` is forbidden.
- **Connection Refused Troubleshooting** (max 3 steps, then escalate to human):
  1. Check port listening: `lsof -i :<port>` or `ss -tlnp | grep <port>`
  2. Check service status: `docker ps` or `systemctl status <service>`
  3. Check network/firewall: `curl -v http://localhost:<port>/`
- **Branch Safety**:
  - On `main`, `master`, `production`, or `release/*` branches, `python manage.py migrate` is forbidden without prior PR review confirming migration file safety.
  - Destructive commands (`migrate --fake`, `flush`, `sqlflush`, `DROP TABLE`) are forbidden on these branches.
- **Container vs Host DB Connection**:
  - Inside containers, `DATABASES["default"]["HOST"]` uses Docker service names (e.g. `db`, `postgres`).
  - On the host, use `localhost` or `127.0.0.1`.
  - Mixing these causes "Connection refused" errors. When switching environments, control via `DATABASE_HOST` in the `.env` file. Hardcoding is forbidden.

## 🛑 Agent Boundary & Hard Rules
- **Read-Only / Protected Files**:
  - Do not modify `settings.py` directly. Loading environment configurations must use the `django-environ` package with secure defaults.
- **Security Guardrails**:
  - Never commit `.env` or `local_settings.py` files containing passwords or database `SECRET_KEY` into Git.
  - After creating migrations via `makemigrations`, the agent must verify the generated files under `migrations/00XX_*.py` to ensure no active production columns are accidentally renamed or dropped.
- **SECRET_KEY Isolation Enforcement**:
  - The agent must never write a plaintext `SECRET_KEY` value into any code file under any circumstances.
  - If a hardcoded `SECRET_KEY = "..."` pattern is detected in `settings.py`, it must be immediately replaced with `env("SECRET_KEY")` and a placeholder must be added to `.env.example`.
- **Migration Verification Workflow Enforcement**:
  - The complete migration workflow is: `makemigrations` → `sqlmigrate` review → human confirmation → `migrate`.
  - The agent must not skip the `sqlmigrate` review step. If the SQL diff contains `DROP`, `ALTER ... RENAME`, or `DELETE FROM` statements, they must be highlighted and the agent must wait for human confirmation.
  - When a single PR contains more than 3 migration files, the agent should proactively prompt the human to review migration order and dependencies.
