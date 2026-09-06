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

## 🚀 已完成任务 (Completed Tasks)

### 4. 在线阅读与分发体验
- [x] **上线 VitePress 双语沉浸阅读站 (2026年9月6日)**：搭建基于 VitePress 1.6 的双语在线阅读站，支持全文字段本地检索、暗黑模式切换、代码一键复制，并通过 GitHub Actions 自动部署至 GitHub Pages；完成与「飞书 Codex 值班助理」Ch.08 的双向链接对齐。
- [x] **上线 AGENTS.md 交互式生成器 (2026年9月6日)**：在静态阅读站双语内嵌基于 Vue 3 的交互式规约生成器，支持 10 套主流技术栈（Next.js/Vue3/FastAPI/Django/Spring/Expo/Go/Rust/Svelte/Chrome MV3）、沙盒等级与 Anti-Loop 护栏一键配置与复制。
- [x] **扩增 Chrome 扩展沙盒实战样例 (2026年9月6日)**：完成 `examples/ch06-chrome-extension` (Codex Web Copilot)，纯原生 Manifest V3 编写，遵循严格 CSP 与防死锁机制，并纳入 Examples CI 自动化守卫。
- [x] **完善社区案例库与 Contributors 机制 (2026年9月6日)**：沉淀入库首批真实典型实战 Case（SaaS Stripe 商业闭环与飞书移动值班助理），并上线 GitHub Issue 案例/模版在线投稿模版。

---

## 🔄 进行中任务 (Ongoing Tasks)
- [/] **社区投稿持续审阅**：持续审阅和校对读者通过 GitHub Issue 表单提交的社区新 Case。



---

## 🗺️ 未来规划 (Roadmap & Backlog)
- [x] **扩增技术栈规约模板**：新增 Go (Gin/Fiber)、Rust (Axum)、Svelte (SvelteKit) 三份双语 `AGENTS-*.md` 模板（沿用 Anti-Loop 体例与沙盒边界），模板总数达 9 套。(2026年8月12日)
- [x] **实战工程源码配套**：为 Ch.10 和 Ch.11 建立配套可运行工程，方便读者一键 clone 体验 → [examples/ch10-saas-mvp](file:///Users/hunkwu/Desktop/ai/book/examples/ch10-saas-mvp)（next build 通过）、[examples/ch11-expo-mobile](file:///Users/hunkwu/Desktop/ai/book/examples/ch11-expo-mobile)（expo lint 零错误 + expo-doctor 20/20）。(2026年8月12日)
- [x] **Watchdog 交互式部署脚本**：为 `codex-watchdog` 完成一键式安装交互向导 `codex-watchdog install`（环境自检 → 能力选择 → 参数收集 → 生成 `watchdog.config.json` 配置回退），降低反向穿透的使用门槛。(2026年8月12日)
- [x] **加入多端视频演示**：已在 [case-studies/](file:///Users/hunkwu/Desktop/ai/book/case-studies/README.md) 与 [README.md](file:///Users/hunkwu/Desktop/ai/book/README.md) 嵌入 Ch.07 自动巡检真实录屏（GIF + MP4，本机 Terminal 窗口按帧采集合成）。(2026年8月17日)

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

### 4. Online Reading & Distribution Experience
- [x] **Launch VitePress Bilingual Reader Site (September 6, 2026)**: Deployed online reader powered by VitePress 1.6 with client-side full-text search, dark/light toggle, and code-copy, automated via GitHub Actions to GitHub Pages; synchronized bidirectional links with Ch.08 and Codex Feishu Sentinel.
- [x] **Launch Interactive AGENTS.md Generator (September 6, 2026)**: Built an interactive Vue 3-powered protocol generator embedded within the bilingual reader site, supporting 10 frameworks (Next.js, Vue 3, FastAPI, Django, Spring, Expo, Go, Rust, Svelte, Chrome MV3), configurable sandbox tiers, and Anti-Loop guardrails with one-click copy.
- [x] **Expand Sandbox Repositories with Chrome Extension (September 6, 2026)**: Added `examples/ch06-chrome-extension` (Codex Web Copilot), built natively on Manifest V3 with strict CSP and zero build black-box, guarded by Examples CI.
- [x] **Establish Case Studies & Contributor Mechanisms (September 6, 2026)**: Curated the first 2 real-world landmark cases (SaaS Stripe closed-loop and Feishu Sentinel watchdog) and published GitHub Issue submission forms for community templates and case studies.

---

## 🔄 Ongoing Tasks
- [/] **Curate Community Submissions**: Continuously review incoming user cases and framework templates submitted via GitHub Issue forms.



---

## 🗺️ Roadmap & Backlog
- [x] **Additional Templates**: Added three bilingual `AGENTS-*.md` templates for Go (Gin/Fiber), Rust (Axum), and Svelte (SvelteKit) following the Anti-Loop format with sandbox boundaries — 9 templates in total. (August 12, 2026)
- [x] **Hands-On Repositories**: Companion, runnable projects for Ch.10 and Ch.11 → [examples/ch10-saas-mvp](file:///Users/hunkwu/Desktop/ai/book/examples/ch10-saas-mvp) (next build passed) and [examples/ch11-expo-mobile](file:///Users/hunkwu/Desktop/ai/book/examples/ch11-expo-mobile) (expo lint clean + expo-doctor 20/20). (August 12, 2026)
- [x] **Watchdog Install Script**: Shipped the interactive onboarding wizard `codex-watchdog install` (environment self-check → capability selection → parameter collection → generates `watchdog.config.json` fallback config), lowering the barrier for reverse tunneling. (August 12, 2026)
- [x] **Visual Democasting**: Embedded a real recording of the Ch.07 automated visual audit (GIF + MP4, captured frame-by-frame from a local Terminal window) in [case-studies/](file:///Users/hunkwu/Desktop/ai/book/case-studies/README.md) and [README.md](file:///Users/hunkwu/Desktop/ai/book/README.md). (August 17, 2026)
