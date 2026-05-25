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
- **Offline Build**: `./mvnw clean package -o` (离线模式，使用本地仓库缓存)
- **Dependency Tree**: `./mvnw dependency:tree` (排查依赖冲突)

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
- **构建缓存与离线编译**：
  - 在沙盒环境中执行 Maven 或 Gradle 构建时，必须附带离线或本地仓库缓存参数，防止 CI 超时。Maven 使用 `./mvnw -o` 或 `-Dmaven.repo.local=.m2/repository`；Gradle 使用 `--offline` 或配置 `buildCache { local { enabled = true } }`。
  - 禁止在沙盒内执行无缓存的全量依赖拉取。首次构建由人工在宿主机完成缓存预热后再挂载到沙盒。
- **JPA N+1 查询防范**：
  - 所有「一对多」或「多对多」关联查询必须使用 `@EntityGraph` 或 JPQL `JOIN FETCH` 显式声明加载策略。
  - 禁止依赖默认的 Lazy Loading 而不加任何 Fetch 优化。发现 N+1 查询日志时，立即修复为批量加载或 `@BatchSize` 注解。
  - MyBatis-Plus 场景下，禁止在循环中逐条调用 `selectById`，必须使用 `selectBatchIds` 或自定义 XML 联表查询。
- **Entity / DTO 分层强制**：
  - Controller 返回值类型必须为 DTO 或 VO，禁止直接返回 JPA Entity 或 MyBatis 实体。
  - 使用 `MapStruct` 或手动转换器完成 Entity 到 DTO 的映射，转换逻辑统一放置在 `converter/` 或 `assembler/` 包中。

## 🔄 AI 循环防范 (Anti-Loop Safeguards)
- **依赖解析失败**：
  - Maven 或 Gradle 依赖解析失败时，最多重试 2 次。第一次重试使用 `--update-snapshots`；第二次使用 `--offline` 回退到本地缓存。两次均失败则立即停止，向人工报告完整错误日志和 `dependency:tree` 输出。
  - 禁止循环修改 `pom.xml` 版本号试探兼容性。若发现版本冲突，生成 `mvn dependency:tree -Dincludes=<groupId>` 的分析结果后交由人工决策。
- **编译级联错误**：
  - 修复模块 A 的编译错误后，若模块 B、C 随之出现新的编译错误，立即停止修复。输出完整的模块依赖链（`./mvnw dependency:tree`），并列出所有受影响模块的报错文件清单，交由人工评估。
  - 禁止连续修复超过 3 个因级联导致的编译错误。
- **测试伪造禁令**：
  - 禁止通过大量 Mockito `when().thenReturn()` 伪造复杂业务链路来让测试通过。对于涉及数据库交互的场景，必须使用 `@SpringBootTest` + `@Testcontainers` 或 H2 内存数据库进行真实集成测试。
  - 若单元测试需要 Mock 外部 HTTP 服务，使用 `WireMock` 或 `MockWebServer`，禁止直接 Mock `RestTemplate` / `WebClient` 的内部实现。

## 🏗️ 沙盒与环境边界 (Sandbox & Environment Boundaries)
- **端口隔离**：
  - Spring Boot 默认端口 `8080` 必须通过容器端口映射暴露（如 `-p 8080:8080`）。禁止在沙盒内使用 `0.0.0.0` 监听全网段。
  - 若 `8080` 端口冲突，通过 `server.port` 配置切换，禁止强制 kill 宿主机进程。
- **连接拒绝排查流程**（最多 3 步）：
  1. 检查目标端口是否被监听：`lsof -i :8080`
  2. 检查 Spring Boot 进程是否存活：`ps aux | grep spring-boot`
  3. 检查容器网络连通性：`docker network inspect <network_name>`
  - 3 步内未定位问题，停止排查并附带以上 3 步的输出结果交由人工处理。
- **数据库变更安全**：
  - 禁止在 `production` 或 `main` 分支上直接执行 `flyway migrate` 或手动 DDL 脚本。所有生产数据库变更必须通过 CI/CD 管线中的 Flyway/Liquibase 自动化迁移执行。
  - 沙盒内可自由执行 DDL，但仅限于 H2 / Testcontainers 提供的临时数据库实例。
- **容器 JVM 内存限制**：
  - Docker 容器内运行 Spring Boot 时，必须显式设置 JVM 内存参数：`-XX:MaxRAMPercentage=75.0`，并在 `docker run` 中配置 `--memory=512m` 或更高值。
  - 禁止不设内存上限直接运行 JVM 容器，防止 OOM Kill。
- **分支安全**：
  - 禁止在 `main`、`master`、`production` 分支上执行 `git push --force`、`git reset --hard` 或 `DROP TABLE` 等破坏性命令。

## 🛑 Agent Boundary & Hard Rules (安全红线)
- **只读目录/文件限制**：
  - 严禁擅自修改安全鉴权核心组件（如 `SecurityConfig` 鉴权过滤链或自定义 Token 解析拦截器）。
- **配置与安全合规**：
  - 严禁在 `application.yml` 或 `application-prod.yml` 中直接编写明文数据库账号密码或敏感秘钥。所有敏感信息必须使用环境变量占位符（如 `${SPRING_DATASOURCE_PASSWORD:default}`）或通过 Vault 等外部配置中心注入。
  - 任何包含数据库字段的增删改，必须在代码提交前附带包含 DDL 的 `.sql` 变更脚本。在宣布任务完成前，必须在本地通过 `./mvnw test` 的所有单元测试。
- **构建缓存强制**：
  - 沙盒环境中所有 Maven/Gradle 构建必须开启本地缓存。未使用缓存参数的构建命令视为违规，智能体需自行追加 `-o` 或 `--offline` 参数后重试。
- **N+1 查询零容忍**：
  - 代码评审阶段发现任何疑似 N+1 查询模式（循环内逐条查库、未声明 Fetch 策略的 Lazy 关联），必须阻断提交并要求修复。
  - 推荐在测试阶段启用 `spring.jpa.show-sql=true` 结合日志分析工具检测 N+1 问题。
- **Entity/DTO 分离强制**：
  - Controller 方法签名中出现 JPA Entity 类型的返回值或参数，视为违规。智能体必须创建对应 DTO 类并完成映射后才能继续。

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
- **Offline Build**: `./mvnw clean package -o` (offline mode, uses local repository cache)
- **Dependency Tree**: `./mvnw dependency:tree` (diagnose dependency conflicts)

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
- **Build Caching & Offline Compilation**:
  - When running Maven or Gradle inside a sandbox, always pass offline or local repo cache flags to prevent CI timeouts. Maven: `./mvnw -o` or `-Dmaven.repo.local=.m2/repository`. Gradle: `--offline` or configure `buildCache { local { enabled = true } }`.
  - Full dependency downloads without a warm cache are forbidden inside sandboxes. The first build must be performed on the host machine to populate the cache, then mounted into the sandbox.
- **JPA N+1 Query Prevention**:
  - All `@OneToMany` or `@ManyToMany` associations must declare an explicit fetch strategy using `@EntityGraph` or JPQL `JOIN FETCH`.
  - Relying on default Lazy Loading without any fetch optimization is forbidden. When N+1 query patterns appear in logs, fix immediately using batch loading or `@BatchSize`.
  - In MyBatis-Plus projects, calling `selectById` inside a loop is prohibited. Use `selectBatchIds` or custom XML join queries instead.
- **Entity / DTO Layer Enforcement**:
  - Controller return types must be DTO or VO classes. Returning JPA Entity or MyBatis model objects directly is forbidden.
  - Use `MapStruct` or manual converters for Entity-to-DTO mapping. Conversion logic must reside in a `converter/` or `assembler/` package.

## 🔄 Anti-Loop Safeguards
- **Dependency Resolution Failure**:
  - Max 2 retries when Maven/Gradle dependency resolution fails. First retry: use `--update-snapshots`. Second retry: fall back to `--offline` using local cache. If both fail, halt immediately and report the full error log along with `dependency:tree` output to the human.
  - Do not iteratively modify `pom.xml` version numbers to probe compatibility. On version conflicts, produce `mvn dependency:tree -Dincludes=<groupId>` analysis and defer to human decision.
- **Compile Cascade Errors**:
  - If fixing a compilation error in module A introduces new errors in modules B or C, stop immediately. Output the full module dependency chain (`./mvnw dependency:tree`), list all affected files, and hand off to the human for assessment.
  - Do not fix more than 3 consecutive cascade-induced compilation errors.
- **Test Forgery Ban**:
  - Do not use elaborate Mockito `when().thenReturn()` chains to fake complex business flows just to pass tests. For database interactions, use `@SpringBootTest` + `@Testcontainers` or an H2 in-memory database for real integration tests.
  - When mocking external HTTP services, use `WireMock` or `MockWebServer`. Mocking the internals of `RestTemplate` / `WebClient` is prohibited.

## 🏗️ Sandbox & Environment Boundaries
- **Port Isolation**:
  - Spring Boot's default port `8080` must be exposed via container port mapping (e.g. `-p 8080:8080`). Binding to `0.0.0.0` inside the sandbox is forbidden.
  - If port `8080` conflicts, switch via `server.port` configuration. Do not force-kill host-machine processes.
- **Connection Refused Troubleshooting** (max 3 steps):
  1. Check if the target port is being listened on: `lsof -i :8080`
  2. Check if the Spring Boot process is alive: `ps aux | grep spring-boot`
  3. Inspect container network connectivity: `docker network inspect <network_name>`
  - If the issue is not identified within these 3 steps, stop and hand the outputs to the human.
- **Database Migration Safety**:
  - Running `flyway migrate` or manual DDL scripts on `production` or `main` branches is forbidden. All production database changes must go through Flyway/Liquibase automated migrations in the CI/CD pipeline.
  - DDL execution inside the sandbox is permitted only against H2 / Testcontainers ephemeral database instances.
- **Container JVM Memory Limits**:
  - When running Spring Boot inside Docker, JVM memory must be explicitly set: `-XX:MaxRAMPercentage=75.0`, and `docker run` must include `--memory=512m` or higher.
  - Running JVM containers without a memory ceiling is forbidden to prevent OOM kills.
- **Branch Safety**:
  - `git push --force`, `git reset --hard`, and `DROP TABLE` are forbidden on `main`, `master`, and `production` branches.

## 🛑 Agent Boundary & Hard Rules
- **Read-Only / Protected Files**:
  - Do not modify core security framework code (such as Spring Security filter chains, authentication managers, or JWT processors) without explicit permission.
- **Configuration Security**:
  - Never commit raw credentials, passwords, or encryption keys inside `application.yml` or `application-prod.yml`. Sensitive inputs must load dynamic env variables via placeholders (e.g. `${SPRING_DATASOURCE_PASSWORD:default}`).
  - Any database schema changes must be accompanied by a DDL script file (e.g. `schema.sql`) inside the repository.
  - Before declaring a task complete, all JUnit 5 tests must pass successfully by running `./mvnw test`.
- **Build Cache Enforcement**:
  - All Maven/Gradle builds in the sandbox must have local caching enabled. Build commands without cache flags are violations; the agent must append `-o` or `--offline` and retry.
- **N+1 Query Zero Tolerance**:
  - Any suspected N+1 query pattern discovered during code review (per-row queries inside loops, lazy associations without declared fetch strategy) must block the commit and require a fix.
  - Enable `spring.jpa.show-sql=true` during the test phase and use log analysis to detect N+1 issues.
- **Entity/DTO Separation Enforcement**:
  - If a Controller method signature returns or accepts a JPA Entity type, it is a violation. The agent must create a corresponding DTO class and complete the mapping before proceeding.
