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

## 🛑 Agent Boundary & Hard Rules (安全红线)
- **只读核心文件限制**：
  - 严禁修改项目主目录下的 `settings.py`。任何环境变量的读取均应通过 `os.environ` 或 `django-environ` 包进行，且默认值必须安全。
- **环境安全**：
  - 严禁将含有数据库密码、密钥（如 `SECRET_KEY`）的 `.env` 或 `local_settings.py` 写入 Git 版本控制。
  - 在执行任何 `makemigrations` 动作后，智能体必须检查生成的 `migrations/00XX_*.py` 迁移文件，确保没有无意中删除或重命名核心业务字段。

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

## 🛑 Agent Boundary & Hard Rules
- **Read-Only / Protected Files**:
  - Do not modify `settings.py` directly. Loading environment configurations must use `os.environ` or the `django-environ` package with secure defaults.
- **Security Guardrails**:
  - Never commit `.env` or `local_settings.py` files containing passwords or database `SECRET_KEY` into Git.
  - After creating migrations via `makemigrations`, the agent must verify the generated files under `migrations/00XX_*.py` to ensure no active production columns are accidentally renamed or dropped.
