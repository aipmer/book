# 📘 OpenAI Codex 蓝皮书：从入门到架构大师

> 💡 **AI 原生时代的产品研发与多端编排实战指南**
> 
> “做产品，最忌讳的是自嗨；用 AI 写代码，最忌讳的是‘人被 AI 牵着走’。本书不讲花哨的学术理论，我们只聊怎么帮独立开发者和产品经理，用最新的 OpenAI Codex 平台以最快速度搓出能赚钱、能跑通商业闭环的产品。这是我们在 pmer.cn 和‘实战产品说’一贯的硬核实战风格。” —— 主理人 Hunk Wu

---

## 🗺️ 多端发布与传播矩阵

本项目为 **“一源多端”** 发布体系，内容同步发布于以下渠道：

*   **开源源码库**：[GitHub Repository](https://github.com/hunkwu/book) (本仓库) - 存放所有源文件、配置模板与实战工程代码。
*   **个人站点**：[pmer.cn](http://pmer.cn) - 精美极客风在线文档站，支持暗黑模式、移动端优化与代码一键复制。
*   **微信公众号**：**实战产品说** - 深度硬核干货剖析、开发避坑踩坑实录、一人公司商业变现逻辑。
*   **高密 PDF**：简化脱水版 PDF，适合朋友圈与开发者社群一键转发。

---

## 🧭 全书目录与导航

### 第一部分：AI-Native 时代的产品生存法则
*   [Ch.01 告别手写代码：Vibe Coding 时代的产品心智](./chapters/ch01_mindset.md) - 重新思考人机协作边界
*   [Ch.02 跨端掌控：Codex 多端生产力矩阵搭建](./chapters/ch02_setup.md) - CLI、桌面端与移动端联调
*   [Ch.03 破局云端孤岛：沙盒调试与本地环境深度穿透](./chapters/ch03_sandbox.md) - 网络、文件挂载与端口映射

### 第二部分：架构工程与智能体约束
*   [Ch.04 目标驱动：用“边界与断言”驯服推理型智能体](./chapters/ch04_goal_driven.md) - 为什么不该教大厨切菜？
*   [Ch.05 制定 CAP 协议：构建项目专属的 AGENTS.md 规则层](./chapters/ch05_agents_protocol.md) - 制定上下文记忆与代码防腐层
*   [Ch.06 思维纠偏：如何像技术总监一样透视 CoT 推理链](./chapters/ch06_reasoning_steer.md) - 解读思考日志与动态干预

### 第三部分：高级多端编排与巡检
*   [Ch.07 视觉闭环：Desktop Computer Use 自动巡检与设计还原](./chapters/ch07_desktop_computer_use.md) - 模拟用户行为，打通视觉端到端测试
*   [Ch.08 移动看护工作流：全天候离线编排实战](./chapters/ch08_mobile_workflow.md) - 随时随地，用手机微信/Slack监控项目构建
*   [Ch.09 架构复苏：混乱遗留系统的全景解析与渐进式解耦](./chapters/ch09_legacy_code.md) - 让 AI 读懂并优化百万行混乱代码

### 第四部分：一人公司的商业闭环
*   [Ch.10 商业实战：2小时跑通 Next.js + Stripe 商业级 MVP](./chapters/ch10_saas_mvp.md) - Next.js 15 + Supabase + Stripe 实战
*   [Ch.11 触角延伸：Expo 跨端原生 App 开发与云端打包](./chapters/ch11_expo_mobile.md) - 从本地模拟器联调到云端一键打包
*   [Ch.12 终局思考：独立开发者如何打造自动化商业飞轮](./chapters/ch12_commercialization.md) - 一人公司（One-Person SaaS）的流量与变现路径

---

## 🤖 Codex 协作协议规范

开始实践前，建议在项目根目录下配置 **`AGENTS.md`**：

```markdown
# 🤖 Codex Collaboration Protocol (CAP)

## 📌 Project Signature
- Tech Stack: Node.js, React, TypeScript
- Directory Rule: Keep components in `src/components`, logic in `src/hooks`

## 🛑 Hard Constraints
- Never update package.json dependencies without manual approval.
- Do not remove any inline TypeScript documentation or comments.
- Always run `npm run test` before declaring a task complete.
```

---

*本项目持续迭代更新，欢迎在 pmer.cn 官网或公众号“实战产品说”中留言讨论！*
