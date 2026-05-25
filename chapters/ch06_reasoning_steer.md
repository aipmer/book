[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.05) ](./ch05_agents_protocol.md) | [ ➡️ 下一章 (Ch.07) ](./ch07_desktop_computer_use.md) | [ 🌐 English ](../en/ch06_reasoning_steer.md)

# Ch.06 思维纠偏：如何像技术总监一样透视 CoT 推理链

在传统开发中，管理初级程序员时，最担心的场景是其默默闭门造车，最终交付一堆偏离业务逻辑的代码，甚至导致系统崩溃。

在使用 GPT-5.5 等强推理模型驱动的 Codex 时，此类挑战依然存在。尽管智能体具备出色的推理能力，一旦前置假设发生偏差，仍可能沿着错误方向持续运行，陷入自我纠错的「无限循环」。

本章将介绍如何监控与解读 Codex 的**思维链 (Chain of Thought, CoT)** 日志，在智能体偏离轨道时进行精准干预。

---

## 6.1 为什么要透视 CoT（思维链）？

强推理模型与普通大模型（如 GPT-4o）的最大区别在于：它在输出最终代码前，会先在内部“打草稿”进行推理和自我模拟。这个打草稿的过程就是 CoT。

```text
[用户需求] ──> 1. 解析目标与限制 ──> 2. 规划步骤 ──> 3. 运行测试 ──> 4. 自我修正 ──> [最终输出]
                 └───(在终端显示为 CoT Logs，即你的“监考视窗”)───┘
```

如果你只看最终结果，你只能“被动接受”。如果你学会监控 CoT 日志，你就能在步骤 2 或 3 发现它的逻辑漏洞，提前干预，避免浪费你的 API Token 和时间。

---

## 6.2 如何查看并解读 Codex 的 CoT 实时日志

在运行 Codex 时，可以通过在 CLI 中追加调试参数，将它的内部思考过程实时打印在控制台：

```bash
# 启动 Codex 并开启详细思考日志
codex --verbose --show-cot
```

### 实时日志透视示例
当 Codex 收到“修复 Redis 限流器连接超时”的任务时，控制台会输出类似下方的思考流：

```text
[Thinking Process]
- User wants to fix Redis rate limiter connection timeout.
- Checking existing implementation in src/lib/redis.ts...
- I see `redis = new Redis()` without retryStrategy.
- If Redis is down, it hangs the Express app. This violates the 3000ms timeout constraint in AGENTS.md.
- Plan:
  1. Add `maxRetriesPerRequest: null` and `enableReadyCheck: false`.
  2. Implement custom retryStrategy up to 3 times.
  3. Write mock connection test to verify.
```

---

## 6.3 识别 AI 陷入的典型“死循环”

在“实战产品说”的实操经历中，我总结了 AI 容易陷入的三个死循环，一旦看到 CoT 中出现以下特征，必须立刻介入：

### 1. 无限 npm install 循环 (The Dependency Loop)
*   **现象**：AI 试图使用某个新库，运行安装报错；它在 CoT 里决定更换版本再次安装，又报错；接着它试图安装另一个同类库……
*   **CoT 特征**：`Error: Cannot resolve dependency ... Running npm install --legacy-peer-deps ...` 重复出现 3 次以上。

### 2. 代码重构自毁循环 (The Regression Loop)
*   **现象**：AI 修改了 A 文件导致单元测试 B 失败；它去修改 B 测试，结果导致 C 模块报错；它又去改 C，结果 A 又坏了。
*   **CoT 特征**：不断在两三个文件之间往返修改，并且测试通过率反复在 80% 和 90% 之间横跳。

---

## 6.4 介入三部曲：打断、修正与接管

当发现 AI 走偏或陷入死循环时，不要坐以待毙。请按照以下步骤进行干预：

### 第一步：果断打断 (`Ctrl + C` 或 `stop`)
在终端直接按下 `Ctrl + C` 或输入 `stop`。这会立刻冻结 Codex 的当前沙盒状态，阻止它继续消耗 Token。

### 第二步：点对点微调 (`refine`)
打断后，Codex 会进入交互命令行状态。此时，你可以使用 `refine` 命令，直接指出它思考过程中的逻辑盲区：

```bash
# 精准纠错命令
codex refine "你刚才试图安装 axios-retry，本项目禁止安装任何第三方 HTTP 库，请使用原生的 AbortController 来实现超时重试。"
```

### 第三步：人手接管与回滚
如果 AI 已经把代码改得面目全非，不要试图让它自己改回去。直接运行 Git 命令回滚，并在 `AGENTS.md` 中追加一条硬性红线：

```bash
# 撤销 AI 刚才的错误修改
git checkout -- src/lib/redis.ts
```

然后在 [AGENTS.md](../AGENTS.md) 中追加：
```markdown
- 禁止为任何简单的网络超时问题引入外部重试依赖库。
```

---

[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.05) ](./ch05_agents_protocol.md) | [ ➡️ 下一章 (Ch.07) ](./ch07_desktop_computer_use.md) | [ 🌐 English ](../en/ch06_reasoning_steer.md)
