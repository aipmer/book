[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.04) ](./ch04_goal_driven.md) | [ ➡️ 下一章 (Ch.06) ](./ch06_reasoning_steer.md) | [ 🌐 English ](../en/ch05_agents_protocol.md)

# Ch.05 制定 CAP 协议：构建项目专属的 AGENTS.md 规则层

> 🎯 **具体工程麻烦**：AI 修好 1 个 Bug 带出 3 个新 Bug；在同一报错上连续重试 10 次烧钱自旋；擅自安装杂乱外部包或手写假 TODO。  
> 💡 **可运行实战代码与落地收益**：生产级 `AGENTS.md` 规则层模板；失败 2 次强制熔断机制；禁止假代码占位与依赖失控红线。  
> ⚡ **社交传播 / 截图金句**：“没有规则约束的 AI 就是脱缰野马。一份 AGENTS.md，让智能体像十年老架构师一样遵守工程规范。”

在实际做产品的过程中，最怕遇到的一种开发情况是：修好了一个 Bug，却顺手带出了三个新 Bug；或者新写了一个功能，结果把团队约定的代码风格破坏得一塌糊涂。

在人机协同开发中，Codex 如果没有边界约束，也会变成一个“破坏性极强”的勤奋员工。为了给它戴上缰绳，我们需要在项目根目录下建立 **`AGENTS.md`**。

这就是我们的 **“智能体协作宪法” (Codex Collaboration Protocol, CAP)**。

---

## 🎯 生活化直觉隐喻：新员工入职交接手册与安全守则

把 Codex 想象成刚刚入职你公司的“天才实习生”：

```Plaintext
【没给 AGENTS.md】 ──> 天才实习生第一天上班，没人告诉他规矩，他为了修一个前台样式，
                       顺手把你运行了三年的核心认证模块全重构成他喜欢的非标写法，上线直接炸库。
【配好 AGENTS.md】 ──> 天才实习生一进门，桌上放着打印好的《团队入职守则》：
                       - “这是 Next.js 15 项目，用 Tailwind”（明确技术栈）
                       - “编译运行 npm run build，别瞎改命令”（规范标准动作）
                       - “绝对禁止动 auth/ 鉴权目录，违者开除”（划定绝对红线）
                       实习生瞬间心领神会，效率翻倍且绝不闯祸。
```

`AGENTS.md` 就是这样一份免面试、零沟通成本的“AI 入职交接手册”。

---

## 🚀 新手极速上手 3 步走（无痛起步）

用 3 分钟为你的项目注入第一份智能体规约：

1. **步骤一：在项目根目录创建文件**  
   在终端运行：
   ```bash
   touch AGENTS.md
   ```
2. **步骤二：填入 4 大核心板块极简模板**  
   将以下内容存入 `AGENTS.md`：
   ```markdown
   # 🤖 Codex Collaboration Protocol

   ## 📌 Project Fingerprint
   - Stack: Next.js 15, TypeScript, Tailwind CSS
   
   ## 💻 Developer Commands
   - Build: `npm run build`
   - Test: `npm run test`

   ## 🛑 Hard Constraints
   - Never update package.json dependencies without human confirmation.
   - Never touch files inside `src/legacy/`.
   - Always run `npm run build` before completing the task.
   ```
3. **步骤三：启动 Codex 验证加载**  
   运行 `codex`，在 TUI 初始日志中确认已自动识别并挂载工作区规则。

---

## 5.1 为什么我们需要 `AGENTS.md`？

**`AGENTS.md` 是 OpenAI Codex 官方约定的指令文件名**。Codex 在启动时会从当前工作目录开始，**逐级向上扫描**并合并以下文件，作为系统级上下文的一部分：

1. `~/.codex/AGENTS.override.md`（最高优先级，个人覆盖）
2. `~/.codex/AGENTS.md`（全局指令）
3. 项目根目录的 `AGENTS.md`（团队约定）
4. 当前工作目录的 `AGENTS.md`（最具体的局部约定）

它的核心价值在于：

1. **启动即恢复记忆**：每次 Codex 启动时，第一件事就是扫描 `AGENTS.md`，瞬间拾起整个项目的技术栈、文件结构和协作约束，不需要你在对话里反复唠叨。
2. **代码防腐层**：明确定义哪些文件是“只读/禁止触碰”的，引导 Codex 不去擅自重构核心安全模块（如登录鉴权、数据库 Schema）。
3. **约束命令执行**：规定只能使用特定的测试和部署命令，降低 AI 误跑破坏性脚本的概率。

---

## 5.2 `AGENTS.md` 的核心四大版块

```Plaintext
# 项目指纹 (Project Fingerprint)
- 告诉 AI 这是一个什么样的项目，核心技术栈是什么。

# 开发常用命令 (Commands)
- 明确指出编译、测试、迁移数据库的命令，不要让 AI 瞎猜。

# 架构与编码规范 (Styles & Patterns)
- 规定文件存放目录、大小限制及必用的设计模式。

# 智能体安全红线 (Hard Rules)
- 绝对的禁区。一旦触碰，Codex 必须立刻中止并请求人工确认。
```

---

## 5.3 实战：一个生产级的 `AGENTS.md` 模板

以下是一个典型的全栈 SaaS 项目的 `AGENTS.md` 规范：

```markdown
# 🤖 Project: Aurora SaaS Core (AGENTS.md)

## 🧬 Project Fingerprint
- **Stack**: Next.js 15 (App Router), TypeScript, Prisma ORM, TailwindCSS.
- **Database**: PostgreSQL on Supabase.
- **Auth**: Next-Auth v5.

## 💻 Developer Commands
- **Install**: `npm install` (Only run if package.json has changed)
- **Dev Server**: `npm run dev`
- **Lint Code**: `npm run lint`
- **Run Tests**: `npm run test`
- **DB Migration**: `npx prisma migrate dev` (Never run in production branch)

## 🎨 Styles & Architecture Patterns
- **Directory Structure**:
  - Components: Keep UI components inside `@/components/ui/` (Shadcn styled).
  - Business Logic: Custom React hooks must go to `@/hooks/`.
  - API Routes: Next.js Route Handlers go to `src/app/api/.../route.ts`.
- **Formatting**:
  - Keep components modular. If a component exceeds 200 lines, decompose it.
  - All API routes must implement Zod schema validation for request body.
  - Return HTTP 400 for validation errors, 500 for internal uncaught errors.

## 🛑 Agent Boundary & Hard Rules
- **READ-ONLY Directories**: 
  - Never modify files inside `src/app/api/auth/[...nextauth]` (OAuth Core).
  - Never alter `prisma/schema.prisma` without explicit human confirmation.
- **PR Rules**:
  - Before declaring a feature complete, run `npm run test` and `npm run lint`.
  - If tests fail, rollback the change immediately and report the error logs.
- **Security Check**:
  - Never commit raw `.env` files or API Keys. Use environment variables.
```

---

## 5.4 软约束与硬约束的组合防线

需要特别厘清的一点是：**`AGENTS.md` 里写的规则本质上是“软约束”**——它是注入到模型上下文里的自然语言指令，GPT-5.6 Terra 等模型会**高优先级遵守**，但并不等同于操作系统的只读挂载。

如果你要实现“物理级绝不可越界”的拦截，必须搭配 Codex 0.14x 的三层运行时硬性控制：

1. **沙盒模式 (Sandbox Mode)**：使用 `--sandbox workspace-write` 从 OS 容器层面收紧文件写入范围，阻断越界篡改。
2. **Guardian 审批策略 (Approval Policy)**：使用 `--approve-for-me`，当操作涉及全局依赖安装、系统级文件写出时触发 Guardian 自动评审或中断等待。
3. **Hooks 拦截引擎**：在 `config.toml` 中配置 `[hooks]`（0.14x 转正），在 `session_start` 或执行写入前自动触发安全检查脚本。

```toml
# ~/.codex/config.toml
model = "gpt-5.6-terra"

[hooks]
stop = "npm run lint --silent"
```

**“AGENTS.md 业务软规约 + 沙盒与 Hooks 物理硬围栏”**，这就是让大团队和新手都能高枕无忧的防腐护城河。

---

## 🛡️ 翻车自救与避坑速查表

| 常见踩坑现象 | 致命原因 | 极速排查与自救指南 |
| :--- | :--- | :--- |
| **规则写得密密麻麻，AI 还是偶尔犯规** | 单个文件字数超标或存在相互矛盾的条目 | 精简规则，优先写“负向禁止（Never do X）”；关键安全规则升级为沙盒/Hooks 硬拦截 |
| **AI 陷入同一 Bug 连续自我修改 5 次死循环** | 缺少 Anti-Loop 防死锁机制 | 在 AGENTS.md 写入：“连续尝试修复同一错误超过 2 次必须立即停下，输出根因并等待指令” |
| **AI 擅自安装各种乱七八糟的 npm 依赖** | 允许其随意执行包管理器命令 | 在红线中严令：“禁止在未获批准的情况下运行 npm install 添加新 package” |

---

[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.04) ](./ch04_goal_driven.md) | [ ➡️ 下一章 (Ch.06) ](./ch06_reasoning_steer.md) | [ 🌐 English ](../en/ch05_agents_protocol.md)
