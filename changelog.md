# 📝 更新日志 (Changelog)

[ 🌐 English Version ](#english-version)

本文档记录了《Codex 蓝皮书》项目近期的更新、遇到的技术问题及其解决方案。

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
