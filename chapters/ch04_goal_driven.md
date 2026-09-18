[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.03) ](./ch03_sandbox.md) | [ ➡️ 下一章 (Ch.05) ](./ch05_agents_protocol.md) | [ 🌐 English ](../en/ch04_goal_driven.md)

# Ch.04 目标驱动：用“边界与断言”驾驭推理型智能体

> 🎯 **具体工程麻烦**：写太长 Prompt 像教大厨切土豆丝导致模型受限；一句话太模糊又导致 AI 胡编乱造改出 10 个 Bug。  
> 💡 **可运行实战代码与落地收益**：目标驱动 Specs 标准模板（目标 + 前提 + 验收断言 + 禁区红线）；传统 Prompt 与 Specs 真实测试对比。  
> ⚡ **社交传播 / 截图金句**：“教大厨切土豆丝只会把菜炒糊。给 AI 下指令，定死输入输出与验收断言才是专业做法。”

在以 **GPT-5.6 Terra** 等强推理模型为核心的 Codex 时代，传统流水账式的 Prompt 技巧已经过时。推理模型具备内生规划（Internal Planning）空间，死板的过程式指令反而会捆绑模型的思考手脚。

本章教你如何用专业产品 Specs 的方式，精准指挥 Codex。

---

## 🎯 生活化直觉隐喻：米其林主厨与点餐下单单

很多人给 AI 派任务，就像在米其林餐厅吃饭时，冲进后厨对大厨指手画脚：

```Plaintext
【保姆式命令（过程驱动）】 ──> ❌ “大厨，你左手拿刀，把土豆切成 2mm 细丝，锅烧到 180 度倒 15ml 油，翻炒 3 分钟，最后放 3g 盐。”
                               （大厨觉得你在侮辱他的厨艺，而且一旦煤气火候微变，菜必糊无疑。）
【架构师下单（目标驱动）】 ──> ✅ “大厨，我要一份香煎土豆做牛排配菜。
                               - 目标 (Goal)：口感香脆，作为晚宴配菜；
                               - 红线 (Constraints)：热量低于 200 卡，严禁使用黄油与花生油（客人过敏）；
                               - 验收 (Validation)：15 分钟内出菜，中心温度达到 75℃。”
```

Codex 就是精通算法和架构的“米其林主厨”。你要做的是告诉它吃什么、什么不能碰、怎么算合格，具体的刀工和火候完全交给它自己规划。

---

## 🚀 新手极速上手 3 步走（无痛起步）

起草你的第一份目标驱动 Specs：

1. **步骤一：定义终态 (Goal)**  
   用一句话说清最终交付物，如：“在 `/api/checkout` 实现 Stripe 支付会话创建接口”。
2. **步骤二：划定绝对红线 (Constraints)**  
   写明 2-3 条不能触碰的规则，如：“严禁明文打印 Secret Key，禁止修改全局中间件”。
3. **步骤三：提供自动校验断言 (Validation)**  
   给出一个可运行的命令，如：“运行 `npm test -- checkout.test.ts` 必须一次性全绿通过”。

---

## 4.1 目标驱动的 Markdown 结构规范

在终端或 ChatGPT 桌面端中向 Codex 发起任务时，建议使用标准 Markdown 结构：

```markdown
# 🎯 Goal
[描述希望达到的最终业务状态。例如：实现一个支持 GitHub OAuth 登录并能持久化存储偏好的路由。]

# 🛑 Constraints (红线约束)
- [安全约束：绝对不能将密钥明文写入代码或日志中。]
- [选型约束：必须沿用现有 Tailwind，禁止额外引入新的 UI 库。]
- [防腐约束：严禁改动 src/legacy 目录下的任何历史文件。]

# 🧪 Validation Specs (验收断言)
- [自动化测试：运行 npm run test:unit 测试套件必须 100% 通过。]
- [边界异常：当输入字段缺失时，接口必须返回 400 Bad Request 并附带标准 JSON 错误说明。]
```

---

## 4.2 真实案例对比：传统 Prompt vs 目标驱动 Specs

假设我们要写一个 **“带 Redis 限流的 API 代理服务”**。

### ❌ 传统过程驱动型 Prompt

> “请帮我用 Express 写一个 API 代理。首先引入 express 和 express-rate-limit。然后配置 rate-limit，设置 windowMs 为 15 分钟，max 为 100 次。接着写一个路由 `/api/proxy`，使用 axios 请求第三方 API `https://api.github.com`。如果请求成功就返回数据，如果失败就返回 500 错误。注意在请求头里带上 Authorization Bearer Token。”

### ✅ 目标驱动 Specs

```markdown
# 🎯 Goal
实现一个 Express API 代理路由，安全代理所有发往 GitHub API 的请求。

# 🛑 Constraints
- 必须使用 Redis 作为限流器的数据源，禁止使用内存型限流，以支持多容器横向扩展。
- 代理请求的超时时间（Timeout）必须硬性限制在 3000ms 以内，防止挂起 Node 事件循环。
- 严禁将 GitHub Token 写入代码或日志，必须从 `process.env.GH_TOKEN` 安全读取。

# 🧪 Validation Specs
- 压测模拟：1 分钟内发送超过 60 次请求时，代理必须返回 429 Too Many Requests。
- 容错断言：当上游发生超时或网络断开时，必须返回 504 Gateway Timeout 并包含结构化 JSON。
```

---

## 4.3 GPT-5.6 Terra 对 Specs 的推理链路分析

当你把这套规范交给 Codex 后，其内部推理过程会这样高效拆解：

```Plain Text
[解析 Specs 目标] ──> 分析 Constraints (Redis限流 / 3s超时 / 密钥隔离)
                           │
                           ▼
[自主选型与架构规划] ──> 引入 ioredis + rate-limit-redis，配置 Axios 拦截器与超时断路器
                           │
                           ▼
[对齐 Validation Specs 编写断言自测] ──> 模拟 429 频控场景 + 模拟超时场景并验证
                           │
                           ▼
[自愈代码直至测试 100% 通过] ──> 提交最终干净的代码与测试报告
```

**把逻辑规划权让渡给 AI，把验收标准牢牢攥在自己手里。** 这就是 AI 时代最高效的人机协同法则。

---

## 🛡️ 翻车自救与避坑速查表

| 常见踩坑现象 | 致命原因 | 极速自救指南 |
| :--- | :--- | :--- |
| **步骤写太碎，AI 遇到异常直接卡死** | 过程命令剥夺了 GPT-5.6 的自愈规划空间 | 删掉具体实现步骤，只保留目标、红线与测试断言，放手让 AI 规划 |
| **AI 改完后产生连锁反应改坏其他模块** | 没有设定明确的代码防腐与修改范围 Constraints | 在 Specs 中严厉声明红线：“仅允许修改 `src/modules/auth/`，严禁碰触其他目录” |
| **AI 以为写完了，其实逻辑存在致命破绽** | 缺少自动执行的断言（Validation Specs） | 要求它在终端自行运行 `npm run test` 或编写单元测试覆盖边界条件 |

---

[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.03) ](./ch03_sandbox.md) | [ ➡️ 下一章 (Ch.05) ](./ch05_agents_protocol.md) | [ 🌐 English ](../en/ch04_goal_driven.md)
