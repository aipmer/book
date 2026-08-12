# 📝 更新日志 (Changelog)

[ 🌐 English Version ](#english-version)

本文档记录了《Codex 蓝皮书》项目近期的更新、遇到的技术问题及其解决方案。

---

## 📅 2026年8月12日
### 🚀 项目更新
- **Ch.11 配套实战工程落地**：新增 [examples/ch11-expo-mobile](file:///Users/hunkwu/Desktop/ai/book/examples/ch11-expo-mobile) —— 基于 `create-expo-app` 的 Expo SDK 57 工程，按章节 Specs 配齐 Expo Router（`src/app` 文件路由）、NativeWind（tailwind.config / metro / babel / global.css 指令全套）与 `eas.json` 三档打包 profile，首页内置 NativeWind className 渲染演示。自带 CAP 协议 `AGENTS.md`。章节（中英双语）已加入源码链接。
- **验证**：`npx expo lint` 零错误、`npx expo-doctor` 20/20 全部通过。
- **新增 Examples CI 防腐流水线**：[examples-ci.yml](file:///Users/hunkwu/Desktop/ai/book/.github/workflows/examples-ci.yml) 在 `examples/**` 变更时自动重跑两套验证：Ch.10（prisma validate/generate + next build）与 Ch.11（expo lint + expo-doctor），防止模板升级后工程腐烂。首跑 53 秒通过。
- **新增 3 套技术栈规约模板**：[templates/](file:///Users/hunkwu/Desktop/ai/book/templates) 新增 Go (Gin/Fiber)、Rust (Axum)、Svelte (SvelteKit) 双语 `AGENTS-*.md`，沿用 Anti-Loop Safeguards 与沙盒边界体例（覆盖 borrow checker 级联、hydration 循环、数据竞争等栈特有循环场景），模板总数从 6 套扩至 9 套。README 双语模板清单已同步。

### 🐞 遇到问题与解决方案
- **问题 7：`create-expo-app` 在已有 Git 仓库内交互式提示卡死**
  - **症状**：脚手架询问「是否跳过 git init」时 TUI 挂起，非交互终端无法回应。
  - **解决方案**：以 `CI=1 npx create-expo-app` 非交互模式重跑，成功生成模板。
- **问题 8：Expo 模板自带 `use-color-scheme.web.ts` 触发 React Compiler lint 错误**
  - **症状**：`npx expo lint` 报 `set-state-in-effect`（effect 内同步 setState 导致级联渲染）。
  - **解决方案**：重构为 `useSyncExternalStore`（服务端快照 false / 客户端快照 true），lint 归零。

---

## 📅 2026年8月11日
### 🚀 项目更新
- **新增 Ch.13 前沿瞭望章节**：基于 OpenAI 官方 Changelog 与 CodexGuide 站点内容，新增 [Ch.13 前沿瞭望：2026 Codex 生态全景升级](file:///Users/hunkwu/Desktop/ai/book/chapters/ch13_2026_frontier.md)（中英双语），覆盖四大结构性变化：
  1. **桌面端合并**：独立 Codex App 退役，能力并入 ChatGPT 桌面客户端 Code Mode，含 Sites、Annotations 与多仓库审查。
  2. **模型换代**：`GPT-5.4`/`GPT-5.4 mini` 于 2026-08-31 退役，迁移至 `gpt-5.6-terra` 与 `gpt-5.6-luna`，附 `config.toml` 迁移示例。
  3. **CLI 0.14x 决定性变更**：`--full-auto` 移除（改用 `--sandbox workspace-write`）、Hooks 引擎转正、Agent Plugins 与插件市场、子智能体并行编排、Guardian 自动审批（`--approve-for-me`）、MCP 2026-07-28 协议。
  4. **安全能力独立成军**：Daybreak Blue/Red 双层访问体系与 Codex Security 插件/CLI。
- **目录与构建同步**：更新 [README.md](file:///Users/hunkwu/Desktop/ai/book/README.md) 双语目录（新增第五部分）、[compile_collection.py](file:///Users/hunkwu/Desktop/ai/book/scripts/compile_collection.py) 章节清单，并重新构建中英文合并书稿与 PDF 电子书。
- **Ch.10 配套实战工程落地**：新增 [examples/ch10-saas-mvp](file:///Users/hunkwu/Desktop/ai/book/examples/ch10-saas-mvp) —— 完整可运行的订阅制 AI 翻译 SaaS（TransFlow），技术栈与章节严格一致（Next.js 15.5 + Prisma + Supabase Auth + Stripe Webhook 验签 + OpenAI），自带 CAP 协议 `AGENTS.md` 与 `.env.example`。已通过 `npx prisma validate`、`prisma generate` 与 `next build`（9 个路由零错误）验证。章节（中英双语）已加入源码链接。

### 🐞 遇到问题与解决方案
- **问题 5：Next.js 15.3.0 存在安全漏洞（CVE-2025-66478）**
  - **症状**：`npm install` 时提示该版本有安全漏洞，要求升级。
  - **解决方案**：将 `next` 升级至 15.5.23（15.x 最新修复版）后重新安装并构建通过。
- **问题 6：`npx prisma validate` 报 P1012（缺少 DATABASE_URL）**
  - **症状**：无 `.env` 时 Prisma 校验失败。
  - **解决方案**：生成仅用于本地构建的占位 `.env`（已加入 `.gitignore`，不会入库），校验与生成通过。

---

## 📅 2026年5月27日
### 🚀 项目更新
- **中英双语同步**：完成了中文新增内容的英文翻译并同步至所有章节，对 [en/](file:///Users/hunkwu/Desktop/ai/book/en) 目录下所有章节进行了校验，确保中英文内容完全匹配。
- **飞书图片链接修复**：修复了 Markdown 中无法正常打开的飞书图片链接，统一替换为 GitHub 本地封面图片 [images/cover.jpg](file:///Users/hunkwu/Desktop/ai/book/images/cover.jpg) 及 [images/cover_en.jpg](file:///Users/hunkwu/Desktop/ai/book/images/cover_en.jpg)，并成功重新构建生成了最新的中英文 PDF 电子书。
- **README 路径优化**：将 [README.md](file:///Users/hunkwu/Desktop/ai/book/README.md) 中的本地绝对路径 `file:///Users/hunkwu/Desktop/ai/book/` 全部优化为 `./` 相对路径，确保在 GitHub 线上展示时链接的正确性。

### 🐞 遇到问题与解决方案
- **问题 4：大文件推送至 GitHub 时发生 HTTP 408/SSL 握手超时错误**
  - **症状**：推送大文件（编译生成的中英文 PDF 电子书，大小各十余MB）时，因网络连接不稳定导致 `RPC failed; HTTP 408 curl 18 transfer closed with outstanding read data remaining` 及 `LibreSSL SSL_read: SSL_ERROR_SYSCALL` 错误，多次推送均失败。
  - **解决方案**：将 Git 本地 http post 缓冲区大小提升至 500MB，以支持大文件稳定上传：
    ```bash
    git config http.postBuffer 524288000
    ```

---

## 📅 2026年5月25日
### 🚀 项目更新
- **智能体规约优化**：深度优化了 [templates/](file:///Users/hunkwu/Desktop/ai/book/templates) 目录下的 6 套 `AGENTS-*.md` 智能体协作规约，新增了 **AI 循环防范机制 (Anti-Loop Safeguards)** 与 **沙盒/环境边界保护**，强化了技术栈编码规范与安全红线。
- **去 AI 化文字打磨**：对全书中文章节进行了文本润色，使用直角引号 `「」`，去除机器腔和口水话；将 Slack 等通信工具替换为更符合国内实战场景的「飞书」。
- **模型代号升级**：将全书中关于 `o3`/`o-series` 等过渡期推理模型的表述统一升级为对下一代大模型的统称（如 `GPT-5.5`），以保持内容的前瞻性。
- **书籍更名与封面**：正式将书籍名称更改为《Codex 蓝皮书》，并更新了中英文封面，重新构建生成了最新的 PDF 电子书。

### 🐞 遇到问题与解决方案
- **问题 1：CI 环境编译 PDF 时中文字体缺失导致乱码**
  - **症状**：GitHub Actions 工作流生成的 `codex_blue_book_zh.pdf` 中文部分显示为方块（豆腐块）。
  - **解决方案**：在 [compile-pdf.yml](file:///Users/hunkwu/Desktop/ai/book/.github/workflows/compile-pdf.yml) 中增加了 CJK 字体包的自动安装步骤：`sudo apt-get install -y fonts-noto-cjk fonts-wqy-zenhei`。期间曾因拼错文泉驿包名（写成 `wqy-zenhei`）导致构建报错，后修正为 `fonts-wqy-zenhei` 解决。

---

## 📅 2026年5月24日
### 🚀 项目更新
- **新增多套开发模板**：在 [templates/](file:///Users/hunkwu/Desktop/ai/book/templates) 中新增了 `Spring Boot`、`FastAPI` 和 `Vue 3 + Vite` 的智能体规约模板，并对所有模板实现了中英双语支持。
- **Watchdog 命令行工具重构**：对配套辅助工具 [scripts/codex-watchdog](file:///Users/hunkwu/Desktop/ai/book/scripts/codex-watchdog/README.md) 进行了重构，使其成为完全自包含的 CLI。实现了本地与云端沙盒的双重穿透网关，并集成了 Ngrok 与 SSH 反向隧道。

### 🐞 遇到问题与解决方案
- **问题 2：Puppeteer 在 GitHub Actions 容器中启动挂起**
  - **症状**：`md-to-pdf` 编译器底层依赖的 Puppeteer 在 Linux CI 无头环境运行编译时卡死挂起。
  - **解决方案**：在 [compile_pdf.js](file:///Users/hunkwu/Desktop/ai/book/scripts/compile_pdf.js) 启动参数中增加了 Chrome 沙盒禁用选项：
    ```javascript
    launch_options: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
    ```
- **问题 3：GitHub Action 自动构建 PDF 后无权限推送至仓库**
  - **症状**：工作流编译 PDF 成功后推送到仓库时提示 `Permission to ... denied to github-actions[bot]`。
  - **解决方案**：在 [compile-pdf.yml](file:///Users/hunkwu/Desktop/ai/book/.github/workflows/compile-pdf.yml) 中明确配置写权限：
    ```yaml
    permissions:
      contents: write
    ```

---

## 📅 2026年5月23日
### 🚀 项目更新
- **项目初始化**：基于 Apache-2.0 协议创建并开源《Codex 蓝皮书》书籍框架，发布中文 Ch.01 至 Ch.12 全部章节。
- **双语与电子书构建**：完成了 Ch.01-12 英文版的翻译与校验，将项目 [README.md](file:///Users/hunkwu/Desktop/ai/book/README.md)、[AGENTS.md](file:///Users/hunkwu/Desktop/ai/book/AGENTS.md) 及 [CONTRIBUTING.md](file:///Users/hunkwu/Desktop/ai/book/CONTRIBUTING.md) 合并为中英双语页面，并首次发布了编译好的 PDF 电子书。

---
---

## <a name="english-version"></a> 📝 English Version

This document records the recent updates, technical issues, and solutions for the *Codex Blue Book* project.

---

## 📅 August 12, 2026
### 🚀 Project Updates
- **Ch.11 Companion Project Shipped**: Added [examples/ch11-expo-mobile](file:///Users/hunkwu/Desktop/ai/book/examples/ch11-expo-mobile) — an Expo SDK 57 project scaffolded with `create-expo-app`, configured per the chapter specs with Expo Router (`src/app` file-based routing), NativeWind (full tailwind.config / metro / babel / global.css directive setup), and a three-tier `eas.json` build profile. The home screen includes a NativeWind `className` rendering demo. Ships a CAP-protocol `AGENTS.md`. Chapter files (bilingual) now link to the source.
- **Validation**: `npx expo lint` passed with zero errors; `npx expo-doctor` passed 20/20 checks.
- **New Examples CI Anti-Rot Pipeline**: [examples-ci.yml](file:///Users/hunkwu/Desktop/ai/book/.github/workflows/examples-ci.yml) re-runs both validation suites on any `examples/**` change — Ch.10 (prisma validate/generate + next build) and Ch.11 (expo lint + expo-doctor) — keeping the companion projects from rotting as templates evolve. First run passed in 53 seconds.
- **3 New Stack Templates Added**: [templates/](file:///Users/hunkwu/Desktop/ai/book/templates) gained bilingual `AGENTS-*.md` specs for Go (Gin/Fiber), Rust (Axum), and Svelte (SvelteKit), following the Anti-Loop Safeguards and sandbox-boundary format (covering stack-specific loops such as borrow-checker cascades, hydration loops, and data races). The catalog grew from 6 to 9 templates. README bilingual template lists synced.

### 🐞 Issues & Solutions
- **Issue 7: `create-expo-app` hung on an interactive prompt inside an existing Git repo**
  - **Symptom**: The scaffold asked whether to skip `git init` and stalled in a non-interactive terminal.
  - **Solution**: Re-ran with `CI=1 npx create-expo-app` for non-interactive scaffolding.
- **Issue 8: Template's `use-color-scheme.web.ts` triggered a React Compiler lint error**
  - **Symptom**: `npx expo lint` reported `set-state-in-effect` (synchronous setState inside an effect).
  - **Solution**: Refactored to `useSyncExternalStore` (server snapshot false / client snapshot true); lint is now clean.

---

## 📅 August 11, 2026
### 🚀 Project Updates
- **New Chapter Ch.13 Frontier Watch**: Based on the official OpenAI Changelog and content from codexguide.ai, added [Ch.13 Frontier Watch: The 2026 Codex Ecosystem Overhaul](file:///Users/hunkwu/Desktop/ai/book/en/ch13_2026_frontier.md) (bilingual), covering four structural shifts:
  1. **Desktop merger**: the standalone Codex App retired; capabilities moved into the ChatGPT desktop client as Code Mode, including Sites, Annotations, and multi-repo review.
  2. **Model transition**: `GPT-5.4`/`GPT-5.4 mini` retire on 2026-08-31 in favor of `gpt-5.6-terra` and `gpt-5.6-luna`, with `config.toml` migration examples.
  3. **CLI 0.14x breaking changes**: `--full-auto` removed (use `--sandbox workspace-write`), hooks engine stable, Agent Plugins and marketplaces, parallel subagents, Guardian auto-approval (`--approve-for-me`), and the MCP 2026-07-28 protocol.
  4. **Security as a product line**: the Daybreak Blue/Red access tiers and the Codex Security plugin/CLI.
- **TOC & Build Sync**: Updated the bilingual TOCs in [README.md](file:///Users/hunkwu/Desktop/ai/book/README.md) (new Part 5), the chapter list in [compile_collection.py](file:///Users/hunkwu/Desktop/ai/book/scripts/compile_collection.py), and rebuilt the merged manuscripts and PDF ebooks.
- **Ch.10 Companion Project Shipped**: Added [examples/ch10-saas-mvp](file:///Users/hunkwu/Desktop/ai/book/examples/ch10-saas-mvp) — a fully runnable subscription AI translation SaaS (TransFlow) matching the chapter stack exactly (Next.js 15.5 + Prisma + Supabase Auth + Stripe webhook signature verification + OpenAI), with its own CAP `AGENTS.md` and `.env.example`. Verified via `npx prisma validate`, `prisma generate`, and `next build` (9 routes, zero errors). Chapter files (bilingual) now link to the source.

### 🐞 Issues & Solutions
- **Issue 5: Next.js 15.3.0 security vulnerability (CVE-2025-66478)**
  - **Symptom**: `npm install` warned that the pinned version carries a known vulnerability.
  - **Solution**: Upgraded `next` to 15.5.23 (latest patched 15.x), reinstalled, and rebuilt successfully.
- **Issue 6: `npx prisma validate` failed with P1012 (missing DATABASE_URL)**
  - **Symptom**: Prisma validation failed without an `.env` file.
  - **Solution**: Created a build-only placeholder `.env` (listed in `.gitignore`, never committed); validation and client generation passed.

---

## 📅 May 27, 2026
### 🚀 Project Updates
- **Bilingual Sync**: Completed English translation of newly added Chinese contents and synchronized all chapters. Validated all chapters in the [en/](file:///Users/hunkwu/Desktop/ai/book/en) directory to ensure full alignment between Chinese and English text.
- **Feishu Image Links Fix**: Repaired broken Feishu image links in Markdown files by replacing them with local cover image links [images/cover.jpg](file:///Users/hunkwu/Desktop/ai/book/images/cover.jpg) and [images/cover_en.jpg](file:///Users/hunkwu/Desktop/ai/book/images/cover_en.jpg). Recompiled and published the latest PDF ebooks successfully.
- **README Path Optimization**: Optimized all local absolute paths (`file:///Users/hunkwu/Desktop/ai/book/`) in [README.md](file:///Users/hunkwu/Desktop/ai/book/README.md) to relative `./` paths to ensure all links render correctly on GitHub.

### 🐞 Issues & Solutions
- **Issue 4: Git push failed with HTTP 408 / SSL Syscall error on large PDF uploads**
  - **Symptom**: Pushing large compiled PDFs to GitHub failed repeatedly with `RPC failed; HTTP 408 curl 18 transfer closed` and `LibreSSL SSL_read: SSL_ERROR_SYSCALL` due to network instability.
  - **Solution**: Configured the local Git HTTP post buffer size to 500MB (524288000 bytes) to support stable upload of larger binary assets:
    ```bash
    git config http.postBuffer 524288000
    ```

---

## 📅 May 25, 2026
### 🚀 Project Updates
- **Agent Protocols Optimization**: Deeply optimized the 6 sets of `AGENTS-*.md` templates in [templates/](file:///Users/hunkwu/Desktop/ai/book/templates) by adding **AI loop prevention (Anti-Loop Safeguards)** and sandbox environment boundaries, while hardening stack-specific coding rules.
- **De-AI Writing Tone Refinement**: Refined Chinese text across all chapters using straight quotes `「」` and eliminating generic AI filler words. Replaced references to Slack with "Feishu" to align better with local practical workflows.
- **Model References Upgrade**: Unified transitional reasoning model names (e.g. `o3`/`o-series`) to `GPT-5.5` to maintain the forward-looking aspect of the book.
- **Book Rename & Cover**: Formally renamed the book to *Codex Blue Book*, updated covers, and compiled updated PDFs.

### 🐞 Issues & Solutions
- **Issue 1: Missing Chinese Fonts in Linux CI runner causing PDF tofu characters**
  - **Symptom**: Chinese text in the compiled `codex_blue_book_zh.pdf` rendered as square boxes in the GitHub Actions runner.
  - **Solution**: Added Chinese CJK font installation steps to [compile-pdf.yml](file:///Users/hunkwu/Desktop/ai/book/.github/workflows/compile-pdf.yml): `sudo apt-get install -y fonts-noto-cjk fonts-wqy-zenhei`. Fixed a typo in the WenQuanYi package name from `wqy-zenhei` to `fonts-wqy-zenhei` to prevent workflow build failures.

---

## 📅 May 24, 2026
### 🚀 Project Updates
- **New Stack Templates**: Added template guidelines for `Spring Boot`, `FastAPI`, and `Vue 3 + Vite` inside [templates/](file:///Users/hunkwu/Desktop/ai/book/templates). All templates are now bilingual.
- **Watchdog CLI Tool Refactoring**: Refactored the helper utility [scripts/codex-watchdog](file:///Users/hunkwu/Desktop/ai/book/scripts/codex-watchdog/README.md) into a self-contained CLI tool. It supports sandbox reverse tunneling via Ngrok or SSH.

### 🐞 Issues & Solutions
- **Issue 2: Puppeteer hanging inside GitHub Actions container**
  - **Symptom**: Puppeteer launched by `md-to-pdf` hung indefinitely in headless mode during CI run.
  - **Solution**: Added sandbox bypass flags inside [compile_pdf.js](file:///Users/hunkwu/Desktop/ai/book/scripts/compile_pdf.js) launch options:
    ```javascript
    launch_options: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
    ```
- **Issue 3: Write permissions denied for GITHUB_TOKEN on auto-push**
  - **Symptom**: Push failed with access permission error when pushing compiled PDFs to the repository.
  - **Solution**: Added explicit write permission to the GITHUB_TOKEN inside [compile-pdf.yml](file:///Users/hunkwu/Desktop/ai/book/.github/workflows/compile-pdf.yml):
    ```yaml
    permissions:
      contents: write
    ```

---

## 📅 May 23, 2026
### 🚀 Project Updates
- **Initial Scaffold**: Published *Codex Blue Book* under Apache-2.0 license, uploading Chinese chapters 01 to 12.
- **Bilingual & PDF Compilation**: Completed translation of Ch.01-12 into English. Consolidated the main [README.md](file:///Users/hunkwu/Desktop/ai/book/README.md), [AGENTS.md](file:///Users/hunkwu/Desktop/ai/book/AGENTS.md), and [CONTRIBUTING.md](file:///Users/hunkwu/Desktop/ai/book/CONTRIBUTING.md) into bilingual documents. Published the first PDF compilation version of the books.
