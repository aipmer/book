# 🤝 《Codex 蓝皮书》开源贡献指南 (Contributing Guide)

[ 🌐 English Version ](#english-version)

感谢你关注《Codex 蓝皮书》项目！我们非常欢迎社区开发者、产品经理和 AI Native 探索者共同完善这本小册，让更多人掌握自主智能体（Autonomous Agents）的编排心智。

在提交任何修改（Pull Request）前，请花几分钟阅读本指南。

---

## 🧭 贡献领域

你可以通过以下几种方式参与共建：

1.  **实战案例投稿 (Case Studies)**：分享你使用 Codex/智能体开发产品并实现商业变现、解决屎山遗留系统、或者打通多端协同的实战故事。
2.  **`AGENTS.md` 规则规则**：为你日常使用的特定技术栈（如 Ruby on Rails, Go/Gin, Rust/Axum）提供经过实操验证的智能体约束模板。
3.  **内容纠错与润色**：修正排版问题、勘误错别字、或者优化英文翻译的地道程度。
4.  **工程化脚本优化**：优化 `/scripts` 目录下的自动化脚本，提升反向穿透与看护体验。

---

## 🛑 硬性约束 (Hard Rules)

为保持本书“实战产品说”一贯的高密度、无水分格调，所有贡献必须遵守以下硬红线：

*   **禁止使用占位符**：所有的代码示例、配置文件和 Specs 描述必须是**完全真实、可运行**的，严禁使用 `// your code here` 或 `TODO` 敷衍了事。
*   **统一的实战口吻**：语言力求精简、注重工程落地和避坑提示，避免空洞的学术理论。
*   **代码块规范**：所有代码块必须加上正确的语言标签（如 ` ```bash `, ` ```typescript `, ` ```text ` 等）。
*   **链接格式**：单独的章节文件中，链接必须使用相对路径；严禁提交包含本地绝对路径（如 `file:///Users/...`）的修改。

---

## 🚀 提交流程 (PR Workflow)

请遵循标准的 GitHub Fork & Pull Request 工作流：

1.  **Fork 仓库** 到你自己的 GitHub 账号下。
2.  **创建功能分支**：
    ```bash
    git checkout -b feat/add-agents-rails-template
    ```
3.  **进行修改**。如果涉及到章节修改，请确保本地重新编译 PDF 验证无误（本地安装依赖后运行 `npm run build:pdf`）。
4.  **提交并推送**：
    ```bash
    git add -A
    git commit -m "doc: add AGENTS.md template for Ruby on Rails"
    git push origin feat/add-agents-rails-template
    ```
5.  **提交 Pull Request**：在 GitHub 上向本仓库的 `main` 分支提交 PR。我们会在 2 个工作日内完成 Code Review 并合并。

---
---

## 🌐 English Version

# 🤝 Contributing Guide

[ 🌐 中文版 ](#)

Thank you for your interest in contributing to the Codex Blue Book project! We highly welcome community developers, product managers, and AI-Native explorers to collaborate on improving this guide, helping more creators master the orchestration mindset of autonomous agents.

Please take a few minutes to read this guide before submitting any Pull Requests.

---

## 🧭 Contribution Areas

You can participate in co-building through the following ways:

1.  **Case Studies**: Share your real-world stories of launching SaaS MVPs, refactoring legacy code bases, or setting up multi-device watchtowers using Codex/agents.
2.  **`AGENTS.md` Rules**: Submit pre-configured and tested agent boundary rules for your preferred tech stack (e.g., Ruby on Rails, Go/Gin, Rust/Axum).
3.  **Refinement**: Fix typos, formatting glitches, or refine English translations.
4.  **Tooling Improvements**: Enhance the scripts in `/scripts` to improve the local tunneling or telemetry experience.

---

## 🛑 Hard Constraints

To preserve the high-density and practical tone of this book, all contributions must respect these rules:

- **No placeholders**: All code snippets, configurations, and specs must be real and runnable. Do not use generic statements like `// your code here`.
- **Consistent Tone**: Keep your writing concise, professional, and practical. Avoid pure academic terminology.
- **Code Block Tags**: Every code block must specify its language (e.g. ` ```bash `, ` ```typescript `).
- **Relative Pathing**: Use relative pathing for file links inside chapter folders. Never submit absolute file paths (like `file:///Users/...`).

---

## 🚀 Pull Request Workflow

Please follow the standard GitHub workflow:

1.  **Fork the repo** to your own account.
2.  **Create a feature branch**:
    ```bash
    git checkout -b feat/add-agents-rails-template
    ```
3.  **Commit your modifications**:
    ```bash
    git add -A
    git commit -m "doc: add AGENTS.md template for Ruby on Rails"
    ```
4.  **Push and open a PR** to our `main` branch. We review and merge PRs within 2 business days.
