# 📋 开发任务板 (Development Task Board)

[ 🌐 English Version ](#english-version)

本文档追踪《Codex 蓝皮书》项目的开发进度、当前任务及未来规划。

---

## 🚀 已完成任务 (Completed Tasks)

### 1. 核心书籍内容与本地化
- [x] **全书骨架搭建**：创建 Ch.01 至 Ch.12 中文章节，涵盖 AI 原生心智、沙盒穿透、智能体约束、CI/CD 与商业化闭环。
- [x] **全书英文翻译**：完成 Ch.01 至 Ch.12 的英文翻译与核对，并存放于 [en/](file:///Users/hunkwu/Desktop/ai/book/en) 文件夹。
- [x] **文档双语化合并**：将 [README.md](file:///Users/hunkwu/Desktop/ai/book/README.md)、[AGENTS.md](file:///Users/hunkwu/Desktop/ai/book/AGENTS.md) 及 [CONTRIBUTING.md](file:///Users/hunkwu/Desktop/ai/book/CONTRIBUTING.md) 合并为统一的双语结构。

### 2. 自动化构建与 CI 问题修复
- [x] **自动化 PDF 编译**：使用 `md-to-pdf` 并通过 [compile_pdf.js](file:///Users/hunkwu/Desktop/ai/book/scripts/compile_pdf.js) 编译输出中英文 PDF。
- [x] **CI 修复 (Puppeteer 挂起)**：引入 `--no-sandbox` 启动项解决 headless 模式在 Github Runner 的卡死问题。
- [x] **CI 修复 (中文字体乱码)**：自动在 Ubuntu Runner 安装 `fonts-noto-cjk` 和 `fonts-wqy-zenhei` 字体。
- [x] **CI 修复 (推送权限拒)**：给 `GITHUB_TOKEN` 显式声明 `contents: write` 读写权限。

### 3. 工具与模板支持
- [x] **Watchdog CLI 重构**：实现完全自包含的辅助工具包，用于手机 webhook 通信网关和云端/本地反向穿透，见 [scripts/codex-watchdog](file:///Users/hunkwu/Desktop/ai/book/scripts/codex-watchdog/README.md)。
- [x] **6套主流框架模板**：添加 Django、FastAPI、Next.js、React Native、Spring Boot、Vue 3 的智能体规约文件，见 [templates/](file:///Users/hunkwu/Desktop/ai/book/templates)。
- [x] **规约模版深度优化**：融入 **AI 循环防范机制 (Anti-Loop Safeguards)**、沙盒边界与去 AI 口水话表达。

---

## 🔄 进行中任务 (Ongoing Tasks)
- [/] **发布与分发管线对齐**：打通在线文档站点 `pmer.cn` 的自动同步流程，实现 GitHub commit 自动触发站点热更新。
- [/] **社区案例收集与校对**：运营 [case-studies/](file:///Users/hunkwu/Desktop/ai/book/case-studies) 实战案例库，开始收集和审阅读者的优秀投稿。

---

## 🗺️ 未来规划 (Roadmap & Backlog)
- [ ] **扩增技术栈规约模板**：提供 Rust (Axum)、Go (Fiber/Gin) 以及 Svelte 等更多前沿框架的 `AGENTS-*.md` 模板。
- [ ] **实战工程源码配套**：为 Ch.10 (Next.js SaaS MVP) 和 Ch.11 (Expo Mobile) 建立独立的配套 GitHub 代码仓库，方便读者一键 clone 体验。
- [ ] **Watchdog 交互式部署脚本**：为 `codex-watchdog` 制作一键式安装交互脚本，降低反向穿透的使用门槛。
- [ ] **加入多端视频演示**：在 [case-studies/](file:///Users/hunkwu/Desktop/ai/book/case-studies) 或 [README.md](file:///Users/hunkwu/Desktop/ai/book/README.md) 中嵌入自动化巡检 (Desktop Computer Use) 运行过程的录屏演示。

---
---

## <a name="english-version"></a> 📋 Development Task Board

This board tracks the progress, ongoing actions, and roadmap of the *Codex Blue Book* project.

---

## 🚀 Completed Tasks

### 1. Book Content & Translation
- [x] **Book Scaffolding**: Generated Ch.01 to Ch.12 (Chinese chapters) covering AI-Native dev, sandboxing, agent restrictions, and SaaS MVP pipelines.
- [x] **English Translation**: Complete translation and verification of all 12 chapters, located in the [en/](file:///Users/hunkwu/Desktop/ai/book/en) directory.
- [x] **Bilingual Consolidations**: Merged [README.md](file:///Users/hunkwu/Desktop/ai/book/README.md), [AGENTS.md](file:///Users/hunkwu/Desktop/ai/book/AGENTS.md), and [CONTRIBUTING.md](file:///Users/hunkwu/Desktop/ai/book/CONTRIBUTING.md) into single bilingual files.

### 2. PDF Automation & CI Fixes
- [x] **Automated PDF Compiling**: Created compilation script [compile_pdf.js](file:///Users/hunkwu/Desktop/ai/book/scripts/compile_pdf.js) and configured automated runner compilation.
- [x] **CI Puppeteer Fix**: Added `--no-sandbox` to resolve CI hanging.
- [x] **CI Chinese Font Fix**: Auto-installed `fonts-noto-cjk` and `fonts-wqy-zenhei` font packages.
- [x] **CI Auto-commit Fix**: Granted write access to the GITHUB_TOKEN inside [compile-pdf.yml](file:///Users/hunkwu/Desktop/ai/book/.github/workflows/compile-pdf.yml).

### 3. Companion Tools & Templates
- [x] **Watchdog CLI Refactoring**: Refactored [scripts/codex-watchdog](file:///Users/hunkwu/Desktop/ai/book/scripts/codex-watchdog/README.md) into a standalone command-line helper.
- [x] **6 Technology Templates**: Completed Django, FastAPI, Next.js, React Native, Spring Boot, and Vue 3 templates, located under [templates/](file:///Users/hunkwu/Desktop/ai/book/templates).
- [x] **Template Hardening**: Integrated **AI Anti-Loop Safeguards**, sandbox boundary guards, and text refinement into templates.

---

## 🔄 Ongoing Tasks
- [/] **Sync Publishing Pipelines**: Standardize content deployment to the online reader site `pmer.cn` upon commits.
- [/] **Manage Case Studies**: Curate case reports under the [case-studies/](file:///Users/hunkwu/Desktop/ai/book/case-studies) section.

---

## 🗺️ Roadmap & Backlog
- [ ] **Additional Templates**: Add templates for Rust (Axum), Go (Fiber/Gin), and Svelte frameworks.
- [ ] **Hands-On Repositories**: Create companion, executable project templates for Chapter 10 (SaaS MVP) and Chapter 11 (Expo Mobile).
- [ ] **Watchdog Install Script**: Create interactive command-line onboarding configurations for `codex-watchdog`.
- [ ] **Visual Democasting**: Integrate recordings of automated visual testing (Ch.07 Desktop Computer Use) in [README.md](file:///Users/hunkwu/Desktop/ai/book/README.md) and [case-studies/](file:///Users/hunkwu/Desktop/ai/book/case-studies).
