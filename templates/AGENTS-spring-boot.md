# 🤖 Spring Boot 专属智能体协作规约 (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: Spring Boot 3.x, Java 17+, Maven (or Gradle), Spring Data JPA / MyBatis-Plus.
- **Database**: MySQL / PostgreSQL, Redis.
- **Security**: Spring Security / JWT.

## 💻 Developer Commands
- **Compile & Build**: `./mvnw clean package -DskipTests` (或 `./gradlew build -x test`)
- **Dev Server**: `./mvnw spring-boot:run` (默认侦听端口：localhost:8080)
- **Run Tests**: `./mvnw test`
- **Lint & Format**: `./mvnw spotless:apply` (若配置了 Spotless)

## 🎨 Styles & Architecture Patterns
- **目录与架构规范**：
  - 强制采用标准的四层架构：
    - **控制层 (Controller)**：置于 `controller/` 包下，仅负责请求路由分发与基础校验，禁止在 Controller 中包含任何业务逻辑。
    - **服务层 (Service)**：服务接口定义在 `service/` 包中，具体实现置于 `service/impl/` 中。所有事务声明、业务判断、以及外部依赖服务均应写在服务实现中。
    - **持久层 (Repository / Mapper)**：定义于 `repository/` 或 `mapper/` 包中。
    - **实体类 (Entity / DTO)**：数据库映射模型置于 `entity/` 或 `model/` 包；对外输出数据和接收数据必须强制使用 DTO / VO，存放于 `dto/` 或 `vo/` 包。严禁将持久层 Entity 直接通过 Controller 返回给前端。
- **安全与编码准则**：
  - 接口入参必须使用 JSR-383 注解（如 `@NotNull`, `@Size`）结合 `@Validated` 进行强检验。
  - 系统必须有统一全局异常拦截处理类（如使用 `@RestControllerAdvice` 和 `@ExceptionHandler`）捕获异常并返回规范错误码，严禁直接给用户侧抛出未经处理的底层 RuntimeException 堆栈。

## 🛑 Agent Boundary & Hard Rules (安全红线)
- **只读目录/文件限制**：
  - 严禁擅自修改安全鉴权核心组件（如 `SecurityConfig` 鉴权过滤链或自定义 Token 解析拦截器）。
- **配置与安全合规**：
  - 严禁在 `application.yml` 或 `application-prod.yml` 中直接编写明文数据库账号密码或敏感秘钥。所有敏感信息必须使用环境变量占位符（如 `${SPRING_DATASOURCE_PASSWORD:default}`) 或通过 Vault 等外部配置中心注入。
  - 任何包含数据库字段的增删改，必须在代码提交前附带包含 DDL 的 `.sql` 变更脚本。在宣布任务完成前，必须在本地通过 `./mvnw test` 的所有单元测试。

---

## 🌐 English Version

# 🤖 Spring Boot Agent Collaboration Protocol (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: Spring Boot 3.x, Java 17+, Maven (or Gradle), Spring Data JPA / MyBatis-Plus.
- **Database**: MySQL / PostgreSQL, Redis.
- **Security**: Spring Security / JWT.

## 💻 Developer Commands
- **Compile & Build**: `./mvnw clean package -DskipTests` (or `./gradlew build -x test`)
- **Dev Server**: `./mvnw spring-boot:run` (listening port: localhost:8080)
- **Run Tests**: `./mvnw test`
- **Lint & Format**: `./mvnw spotless:apply` (if Spotless plugin is configured)

## 🎨 Styles & Architecture Patterns
- **Directory and Code Package Conventions**:
  - The classic 4-layer backend architecture must be strictly followed:
    - **Controller**: Located under `controller/`. Handles route parsing and request validation. Business logic inside Controllers is prohibited.
    - **Service**: Interfaces are under `service/`, and implementations are under `service/impl/`. Business logic, transaction management, and third-party calling must reside here.
    - **Repository / Mapper**: Database CRUD APIs under `repository/` or `mapper/`.
    - **Entities & DTOs**: Persistent database entities go under `entity/` or `model/`. Request/response objects must be mapped to distinct DTOs/VOs (under `dto/` or `vo/`). Returning raw JPA/MyBatis database entities directly to the frontend is strictly forbidden.
- **Coding Standards**:
  - Request inputs must use validation annotations (such as `@NotNull`, `@Size`) along with `@Validated`.
  - Global error routing must be configured using `@RestControllerAdvice` and `@ExceptionHandler` to return standardized HTTP error formats. Raw internal runtime error stack traces must never leak to the client side.

## 🛑 Agent Boundary & Hard Rules
- **Read-Only / Protected Files**:
  - Do not modify core security framework code (such as Spring Security filter chains, authentication managers, or JWT processors) without explicit permission.
- **Configuration Security**:
  - Never commit raw credentials, passwords, or encryption keys inside `application.yml` or `application-prod.yml`. Sensitive inputs must load dynamic env variables via placeholders (e.g. `${SPRING_DATASOURCE_PASSWORD:default}`).
  - Any database schema changes must be accompanied by a DDL script file (e.g. `schema.sql`) inside the repository.
  - Before declaring a task complete, all JUnit 5 tests must pass successfully by running `./mvnw test`.
