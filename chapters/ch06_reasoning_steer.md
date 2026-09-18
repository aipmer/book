[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.05) ](./ch05_agents_protocol.md) | [ ➡️ 下一章 (Ch.07) ](./ch07_desktop_computer_use.md) | [ 🌐 English ](../en/ch06_reasoning_steer.md)

# Ch.06 思维纠偏：如何像技术总监一样透视推理过程

> 🎯 **具体工程麻烦**：面对强推理模型只能干等；当 AI 第一步假设走偏时，它会顺着错误连续深陷，搞乱代码库。  
> 💡 **可运行实战代码与落地收益**：终端 TUI 实时透视 CoT 思考步骤方法；3 种死循环特征识别表；配套 Chrome 扩展实战工程 (`examples/ch06-chrome-extension`)。  
> ⚡ **社交传播 / 截图金句**：“别让 AI 蒙头狂奔 20 分钟才告诉你走偏了。看懂思考日志，在它跑偏的第一步一键拽回。”

在传统开发中，管理初级程序员时最让人头疼的情景，莫过于他闷头闭门造车一周，最后交付了一堆与业务方向南辕北辙的代码，甚至把主干分支改崩。

在使用 **GPT-5.6 Terra** 深度推理模型驱动的 Codex 时，虽然 AI 的代码能力极强，但一旦前置假设出错，它就会顺着错误的假设自圆其说、一路狂奔，甚至陷入自我纠错的“无限自旋”。

本章教你如何穿透 Codex 的**推理过程**，在它刚偏离航线时，像一个资深技术总监一样精准介入、一键拽回。

---

## 🎯 生活化直觉隐喻：在 AI 脑海里装一个“监考透视窗”

不要把 AI 推理当成一个黑盒魔术：

```Plaintext
【被动盲等模式】 ──> 就像期末考试，你坐在考场外干等 2 小时，交卷后才发现学生从第一道题就把公式背错了，整张试卷全判零分。
【透视纠偏模式】 ──> 就像你在考场里站在学生身后，看着他面前的「草稿纸」（Reasoning Summary）：
                     - 他刚在草稿纸写下：“假设要重写整个数据库 Schema……”
                     - 你立刻轻轻拍拍他肩膀：“别动 Schema，只改当前的查询索引！”
                     - 学生瞬间在草稿纸划掉错误思路，重新回到正轨。
```

看懂 Reasoning 摘要，就是拿到了这张草稿纸的实时透视权。

---

## 🚀 新手极速上手 3 步走（无痛起步）

用 3 步学会像技术总监一样监督并纠正 AI：

1. **步骤一：启动交互式 TUI 并锁定 Reasoning 面板**  
   直接在终端运行 `codex`，在分栏界面中实时观察滚动的思维日志。
2. **步骤二：发现假定走偏立即按下 `Ctrl + C`**  
   一旦在思考流中看到它打算引入陌生外部依赖或重构核心非目标文件，立即按下 `Ctrl + C` 中断。
3. **步骤三：一句话精准纠偏并恢复会话**  
   直接输入修正提示词：“禁止重构已有数据表，改用内存缓存解决”，AI 将清空错误假设重新规划。

---

## 6.1 为什么要看模型的推理过程？

强推理模型（如 GPT-5.6 Terra）与传统模型最大的区别在于：它在输出最终代码前，会先在内部进行深度的假设验证与自我模拟。Codex TUI 会在交互界面上**以推理摘要（Reasoning Summary）的形式**实时展示这个过程。

```Plaintext
[用户需求] ──> 1. 解析目标与限制 ──> 2. 规划步骤 ──> 3. 运行测试 ──> 4. 自我修正 ──> [最终输出]
                 └───(在 TUI 中显示为 Reasoning Summary，即你的“监考视窗”)───┘
```

> ⚠️ **注意**：完整的思维链（Chain of Thought）为安全防护内部流，TUI 中看到的是模型自主生成的**高保真推理摘要**——这已经完全足够用来判断其技术选型与规划方向。

---

## 6.2 如何在 TUI 中观察并解读推理过程

### 1. 交互模式（TUI）

直接运行 `codex` 进入 TUI，主面板会实时滚动推理摘要。常用审查与控制指令：

```bash
# TUI 交互快捷命令
/diff       # 查看当前会话生成的真实代码变动
/review     # 唤起子智能体自动审查最近的代码变更
/copy       # 快速复制最后一条响应代码
```

### 2. 非交互模式（脚本化分析）

在后台运行长任务时，可通过 JSONL 流进行监控：

```bash
# 非交互模式，输出结构化 JSONL 流
codex exec --json "重构认证中间件" > task.jsonl
```

### 实时推理摘要示范

当 Codex 收到“修复 Redis 限流器连接超时”时，Reasoning 面板的健康思考流通常如下：

```Plaintext
[Reasoning Summary - 正常流]
- User wants to fix Redis rate limiter connection timeout.
- Checking existing implementation in src/lib/redis.ts...
- Found `redis = new Redis()` without retryStrategy.
- If Redis is unreachable, this hangs the Node process, violating the 3000ms SLA in AGENTS.md.
- Action Plan:
  1. Add `maxRetriesPerRequest: null` and explicit connectTimeout: 2000.
  2. Implement custom retryStrategy up to 3 attempts.
  3. Run `npm run test:redis` to verify behavior.
```

---

## 6.3 识别 AI 陷入的典型“死循环”

在日常开发中，必须对以下两类死循环保持敏锐：

### 1. 依赖狂躁循环 (The Dependency Loop)
- **特征**：AI 尝试使用一个未经测试的新库，安装报错后，在推理流中尝试更换 3 个不同的版本或换成另一个更陌生的第三方库。
- **信号**：终端连续出现 `npm install --legacy-peer-deps` 超过 2 次。

### 2. 补丁打地鼠循环 (The Regression Loop)
- **特征**：修改 A 文件导致测试用例 B 挂掉；它去改 B，结果 C 模块报错；它回头去改 C，A 又坏了。
- **信号**：测试通过率在 80% 和 90% 之间反复横跳，且反复修改同一批文件。

---

## 6.4 介入三部曲：打断、修正与接管

### 第一步：果断打断 (`Ctrl + C`)
按下 `Ctrl + C`，立即终止当前任务，阻止 Token 损耗。

### 第二步：点对点纠偏（直接对话）
打断后直接告诉它盲区所在：
```Plaintext
你刚才试图引入 axios-retry，但本项目严禁使用第三方 HTTP 重试库。请使用原生的 AbortController 实现超时，重新规划。
```

### 第三步：人手接管与 Git 回滚
如果代码已经被改乱，使用 Git 撤销并追加规约：
```bash
git checkout -- src/lib/redis.ts
```
在 [AGENTS.md](../AGENTS.md) 中追加一条红线：“严禁引入外部重试依赖”。

---

## 6.5 章节实操配套：Codex Web Copilot (Chrome 扩展沙盒样例)

为了让读者直观体验如何使用 Codex 思考链引导与 Anti-Loop 护栏进行浏览器插件开发，本项目配套提供了开箱即用的轻量开源样例：

👉 **源码沙盒目录**：[examples/ch06-chrome-extension](https://github.com/aipmer/codex-blue-book/tree/main/examples/ch06-chrome-extension)

### 核心亮点：
1. **纯原生 Manifest V3**：零打包依赖，直接在 Chrome 浏览器中「加载已解压的扩展程序」即可 1 分钟开箱体验；
2. **严格 CSP 护栏**：在 `AGENTS.md` 中严禁内联脚本与 `eval()`，展示 AI 智能体如何在最严苛的浏览器安全沙盒下编写高可用代码；
3. **自动化测试守卫**：执行 `npm test` 自动验证 MV3 规范与脚本语法。

---

## 🛡️ 翻车自救与避坑速查表

| 常见踩坑现象 | 致命原因 | 极速排查与自救指南 |
| :--- | :--- | :--- |
| **AI 陷入自我修改死循环停不下来** | 提示词缺少明确的重试上限阈值 | 立即 `Ctrl + C` 中断，在对话中追加指令：“已触发重试阈值，停止自旋，输出排查结论” |
| **打断后重新提问，AI 忘记了前面的背景** | 会话上下文丢失 | 使用 `codex resume` 恢复原有会话线程，保留先前的思考上下文 |
| **AI 改坏了多个历史核心文件** | 未在修改前做 Git 干净分支隔离 | 运行 `git checkout .` 快速还原，并重新使用 `--sandbox workspace-write` 约束活动范围 |

---

[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.05) ](./ch05_agents_protocol.md) | [ ➡️ 下一章 (Ch.07) ](./ch07_desktop_computer_use.md) | [ 🌐 English ](../en/ch06_reasoning_steer.md)

