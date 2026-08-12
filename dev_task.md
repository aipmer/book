# 📋 开发任务板 (Development Task Board)

[ 🌐 English Version ](#english-version)

本文档追踪《Codex 蓝皮书》项目的开发进度、当前任务及未来规划。

---

## 🚀 已完成任务 (Completed Tasks)

### 1. 核心书籍内容与本地化
- [x] **全书骨架搭建**：创建 Ch.01 至 Ch.12 中文章节，涵盖 AI 原生心智、沙盒穿透、智能体约束、CI/CD 与商业化闭环。
- [x] **全书英文翻译**：完成 Ch.01 至 Ch.12 的英文翻译与核对，并存放于 [en/](file:///Users/hunkwu/Desktop/ai/book/en) 文件夹。
- [x] **文档双语化合并**：将 [README.md](file:///Users/hunkwu/Desktop/ai/book/README.md)、[AGENTS.md](file:///Users/hunkwu/Desktop/ai/book/AGENTS.md) 及 [CONTRIBUTING.md](file:///Users/hunkwu/Desktop/ai/book/CONTRIBUTING.md) 合并为统一的双语结构。
- [x] **中英文内容同步 (2026年5月27日)**：完成了本地最新中文章节修改内容的翻译同步，校对确保中英文内容完全一致。
- [x] **封面图片与 PDF 电子书更新**：修复了 Markdown 中失效的飞书图片链接，统一替换为本地封面图片 [images/cover.jpg](file:///Users/hunkwu/Desktop/ai/book/images/cover.jpg) 及 [images/cover_en.jpg](file:///Users/hunkwu/Desktop/ai/book/images/cover_en.jpg)，并成功重新构建生成了最新的中英文 PDF 电子书。

### 2. 自动化构建与 CI 问题修复
- [x] **自动化 PDF 编译**：使用 `md-to-pdf` 并通过 [compile_pdf.js](file:///Users/hunkwu/Desktop/ai/book/scripts/compile_pdf.js) 编译输出中英文 PDF。
- [x] **CI 修复 (Puppeteer 挂起)**：引入 `--no-sandbox` 启动项解决 headless 模式在 Github Runner 的卡死问题。
- [x] **CI 修复 (中文字体乱码)**：自动在 Ubuntu Runner 安装 `fonts-noto-cjk` 和 `fonts-wqy-zenhei` 字体。
- [x] **CI 修复 (推送权限拒)**：给 `GITHUB_TOKEN` 显式声明 `contents: write` 读写权限。

### 3. 工具与模板支持
- [x] **Watchdog CLI 重构**：实现完全自包含的辅助工具包，用于手机 webhook 通信网关和云端/本地反向穿透，见 [scripts/codex-watchdog](file:///Users/hunkwu/Desktop/ai/book/scripts/codex-watchdog/README.md)。
- [x] **6套主流框架模板**：添加 Django、FastAPI、Next.js、React Native、Spring Boot、Vue 3 的智能体规约文件，见 [templates/](file:///Users/hunkwu/Desktop/ai/book/templates)。
- [x] **规约模版深度优化**：融入 **AI 循环防范机制 (Anti-Loop Safeguards)**、沙盒边界与去 AI 口水话表达。
- [x] **统一飞书插件克隆地址 (2026年5月27日)**：将 `plugins-codex-feishu` 仓库内所有克隆和引用链接统一规范为官方组织库 `https://github.com/aipmer/plugins-codex-feishu.git`，避免混淆。
- [x] **新增 Ch.13 前沿瞭望章节 (2026年8月11日)**：基于官方 Changelog 与 codexguide.ai，完成 2026 生态全景升级章节（中英双语），涵盖桌面端合并、GPT-5.6 模型换代、CLI 0.14x 变更、插件生态与 Codex Security，并同步 README 目录、构建脚本与 PDF。

---

## 🔄 进行中任务 (Ongoing Tasks)
- [/] **发布与分发管线对齐**：打通在线文档站点 `pmer.cn` 的自动同步流程，实现 GitHub commit 自动触发站点热更新。
- [/] **社区案例收集与校对**：运营 [case-studies/](file:///Users/hunkwu/Desktop/ai/book/case-studies) 实战案例库，开始收集和审阅读者的优秀投稿。

---

## 🗺️ 未来规划 (Roadmap & Backlog)
- [x] **扩增技术栈规约模板**：新增 Go (Gin/Fiber)、Rust (Axum)、Svelte (SvelteKit) 三份双语 `AGENTS-*.md` 模板（沿用 Anti-Loop 体例与沙盒边界），模板总数达 9 套。(2026年8月12日)
- [x] **实战工程源码配套**：为 Ch.10 和 Ch.11 建立配套可运行工程，方便读者一键 clone 体验 → [examples/ch10-saas-mvp](file:///Users/hunkwu/Desktop/ai/book/examples/ch10-saas-mvp)（next build 通过）、[examples/ch11-expo-mobile](file:///Users/hunkwu/Desktop/ai/book/examples/ch11-expo-mobile)（expo lint 零错误 + expo-doctor 20/20）。(2026年8月12日)
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
- [x] **Bilingual Synchronization (May 27, 2026)**: Translated and synchronized all recent Chinese edits to chapters 1-12 in the [en/](file:///Users/hunkwu/Desktop/ai/book/en) directory.
- [x] **Cover & PDF Compilation Update**: Replaced broken Feishu image links with local cover images [images/cover.jpg](file:///Users/hunkwu/Desktop/ai/book/images/cover.jpg) and [images/cover_en.jpg](file:///Users/hunkwu/Desktop/ai/book/images/cover_en.jpg), and successfully recompiled and updated PDF ebooks.

### 2. PDF Automation & CI Fixes
- [x] **Automated PDF Compiling**: Created compilation script [compile_pdf.js](file:///Users/hunkwu/Desktop/ai/book/scripts/compile_pdf.js) and configured automated runner compilation.
- [x] **CI Puppeteer Fix**: Added `--no-sandbox` to resolve CI hanging.
- [x] **CI Chinese Font Fix**: Auto-installed `fonts-noto-cjk` and `fonts-wqy-zenhei` font packages.
- [x] **CI Auto-commit Fix**: Granted write access to the GITHUB_TOKEN inside [compile-pdf.yml](file:///Users/hunkwu/Desktop/ai/book/.github/workflows/compile-pdf.yml).

### 3. Companion Tools & Templates
- [x] **Watchdog CLI Refactoring**: Refactored [scripts/codex-watchdog](file:///Users/hunkwu/Desktop/ai/book/scripts/codex-watchdog/README.md) into a standalone command-line helper.
- [x] **6 Technology Templates**: Completed Django, FastAPI, Next.js, React Native, Spring Boot, and Vue 3 templates, located under [templates/](file:///Users/hunkwu/Desktop/ai/book/templates).
- [x] **Template Hardening**: Integrated **AI Anti-Loop Safeguards**, sandbox boundary guards, and text refinement into templates.
- [x] **Unify Feishu Plugin Repository Clone URLs (May 27, 2026)**: Unified all repository clone and reference URLs in `plugins-codex-feishu` repository to the official organization repository `https://github.com/aipmer/plugins-codex-feishu.git`.
- [x] **New Chapter Ch.13 Frontier Watch (August 11, 2026)**: Based on the official changelog and codexguide.ai, completed the 2026 ecosystem overhaul chapter (bilingual) covering the desktop merger, GPT-5.6 model transition, CLI 0.14x changes, the plugin economy, and Codex Security; synced README TOCs, the build script, and PDFs.

---

## 🔄 Ongoing Tasks
- [/] **Sync Publishing Pipelines**: Standardize content deployment to the online reader site `pmer.cn` upon commits.
- [/] **Manage Case Studies**: Curate case reports under the [case-studies/](file:///Users/hunkwu/Desktop/ai/book/case-studies) section.

---

## 🗺️ Roadmap & Backlog
- [x] **Additional Templates**: Added three bilingual `AGENTS-*.md` templates for Go (Gin/Fiber), Rust (Axum), and Svelte (SvelteKit) following the Anti-Loop format with sandbox boundaries — 9 templates in total. (August 12, 2026)
- [x] **Hands-On Repositories**: Companion, runnable projects for Ch.10 and Ch.11 → [examples/ch10-saas-mvp](file:///Users/hunkwu/Desktop/ai/book/examples/ch10-saas-mvp) (next build passed) and [examples/ch11-expo-mobile](file:///Users/hunkwu/Desktop/ai/book/examples/ch11-expo-mobile) (expo lint clean + expo-doctor 20/20). (August 12, 2026)
- [ ] **Watchdog Install Script**: Create interactive command-line onboarding configurations for `codex-watchdog`.
- [ ] **Visual Democasting**: Integrate recordings of automated visual testing (Ch.07 Desktop Computer Use) in [README.md](file:///Users/hunkwu/Desktop/ai/book/README.md) and [case-studies/](file:///Users/hunkwu/Desktop/ai/book/case-studies).
