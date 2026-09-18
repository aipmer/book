[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.01) ](./ch01_mindset.md) | [ ➡️ 下一章 (Ch.03) ](./ch03_sandbox.md) | [ 🌐 English ](../en/ch02_setup.md)

# Ch.02 跨端掌控：Codex 多端生产力矩阵搭建

> 🎯 **具体工程麻烦**：新手急着和 AI 对话写代码，本地 Node 依赖错乱、权限没开对、客户端版本过旧，导致终端疯狂报错、白白烧掉几万 Token。  
> 💡 **可运行实战代码与落地收益**：提供基于 CLI 0.14x 的极速安装方案，ChatGPT 桌面端代码模式（Code Mode）与 Computer Use 权限核验命令，多端联调 checklist。  
> ⚡ **社交传播 / 截图金句**：“AI 编程第一步，先配稳你的指挥舱。别让本地依赖报错吃光你的宝贵 Token。”

工欲善其事，必先利其器。在“实战产品说”中，我常强调一个原则：**AI Native 开发的第一步，是把你的“指挥舱”配置得足够稳定。** 很多新手急着去跟 AI 聊天写代码，结果因为本地环境不匹配、权限没开对，导致 AI 在终端疯狂报错、浪费 Token。

本章将带你一步步配置 Codex 的多端生产力矩阵，包括 CLI 0.14x 客户端、ChatGPT 桌面端代码模式以及 ChatGPT 移动端的联动桥接。

---

## 🎯 生活化直觉隐喻：打造你的“三端作战指挥舱”

不要把各个端当成孤立的软件。想象你正在指挥一支太空探险队：

```Plaintext
【Codex CLI】           ──> 主机舱的「动力引擎」：挂载在终端底层，负责高并发、纯代码批处理、跑测试与 CI 构建。
【ChatGPT 桌面端代码模式】──> 舰桥的「全景战术大屏」：多仓库 Diff 审查、Sites 页面原位预览、Computer Use 视觉走查。
【手机 ChatGPT App】    ──> 舰长的「随身呼机」：离开工位时监控构建状态，高危操作手机一键批准（Guardian 自动分流）。
```

三端各司其职，你就不必死守在工位前按键盘，实现全天候随时随地编排交付。

---

## 🚀 新手极速上手 3 步走（无痛起步）

如果你是第一天上手，不需要做复杂的网络穿透或高级脚本配置，按以下 3 步即可 5 分钟跑通首个任务：

1. **步骤一：安装 CLI 并完成账号鉴权**  
   确保本地已安装 Node.js 20+，在终端运行：
   ```bash
   npm install -g @openai/codex@latest
   codex
   ```
   浏览器将自动弹出 ChatGPT 登录窗口，登录你的账号完成快速绑定。
2. **步骤二：写入极简防爆配置文件**  
   在终端执行以下命令，创建 `~/.codex/config.toml`，绑定 GPT-5.6 Terra 主力模型并防止上下文膨胀：
   ```bash
   mkdir -p ~/.codex
   cat << 'EOF' > ~/.codex/config.toml
   model = "gpt-5.6-terra"
   tool_output_token_limit = 12000
   model_auto_compact_token_limit = 64000

   # 前沿高阶架构与多端视觉走查可切换至最新旗舰
   # model = "gpt-6-astra"

   [profiles.guardian]
   model = "gpt-5.6-luna"
   EOF
   ```
3. **步骤三：用安全沙盒模式跑通第一个任务**  
   进入你的项目根目录，运行：
   ```bash
   codex exec --sandbox workspace-write "检查当前目录代码规范并输出修复建议"
   ```

---

## 2.1 CLI 客户端（0.14x 时代）安装与避坑

Codex CLI 核心由高效的 Rust 编写（codex-rs），但 OpenAI 通过 npm 提供了官方封装分发，**作为用户你完全不需要安装 Rust 工具链**，只需满足 Node.js 20+ 环境。

### 1. 基础环境检查与安装

在终端运行：

```bash
# 1. 检查 Node.js 版本（要求 20+）
node --version

# 2. 全局安装最新稳定版 CLI (0.147.0+)
npm install -g @openai/codex@latest

# 或使用官方一键脚本（macOS / Linux）
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

Windows 用户可通过 PowerShell 安装：

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"
```

安装完成后验证版本：

```bash
codex --version
```

### 2. 认证方式选择：ChatGPT 账号 vs API Key

Codex CLI 提供两种认证方式，**官方默认推荐 ChatGPT 账号登录**：

- **方式 A（推荐 / 默认）**：直接在终端运行 `codex`，浏览器会自动弹出 ChatGPT 登录页面。**ChatGPT Plus（$20/月）、Pro、Team、Business、Edu、Enterprise 套餐都已经包含 Codex 用量额度**，对独立开发者是性价比最高的选择。
- **方式 B（按量计费 / CI 场景）**：使用 OpenAI API Key。适合 CI/CD 自动化流水线或没有浏览器交互的服务器。

```bash
# 在你的 ~/.zshrc 或 ~/.bashrc 中写入
export OPENAI_API_KEY="sk-proj-xxxxxx..."
```

### 3. 账单熔断防爆配置

很多新手最担心的就是 AI 暴走刷爆信用卡。Codex 在 0.14x 中提供了多道保险防线：

1. **OpenAI 后台硬上限（最关键）**：在 OpenAI 开发者后台为该 API Key 设置月度 Usage Limit 硬限制（新手建议设为 $50）。即使 AI 陷入异常死循环，也能确保你的资金万无一失。
2. **`config.toml` 中的 Token 控制**：在 `~/.codex/config.toml` 写入输出上限与主动压缩阈值（如前述配置）。
3. **沙盒自治与 Guardian 自动审批**：废弃旧版 `--full-auto`，全面改用 `--sandbox workspace-write` 与 `--approve-for-me`（由 GPT-5.6 Luna 在后台基于策略自动审查，阻断高危系统操作）。

### 4. 多供应商无缝切换：突破单模型配额与限流（推荐开源项目 Codex Switch）

独立开发者在日常高强度全栈开发中，极易撞上 OpenAI 账号的 3 小时用量限额或 API Rate Limit 报错。频繁手动改环境变量或切换工作区不仅打断心流，更致命的是**会导致正在进行中的长会话上下文直接丢失**。

针对这一高频刚需，推荐使用配套开源利器 **[Codex Switch](https://github.com/aipmer/codex-switch)**（由本书主理人打造）：

*   **秒级多供应商一键切换**：在 macOS 上一键平滑切换 OpenAI 官方、DeepSeek、Kimi Code 等主流模型供应商，突破单一平台的速率瓶颈。
*   **跨供应商无缝续聊**：攻克了第三方模型推理字段差异、本地加密校验与 `thread_history.sqlite` 数据库字节偏移等复杂校验机制，切换模型供应商后仍能**无缝继承当前历史会话上下文**，无需从零重新交代项目背景。
*   **开箱即用快速上手**：
    ```bash
    # 克隆并安装 Codex Switch
    git clone https://github.com/aipmer/codex-switch.git
    cd codex-switch && ./install.sh

    # 一键切换当前供应商至 DeepSeek
    codex-switch --to deepseek

    # 查看当前绑定的供应商状态
    codex-switch --status
    ```

---

## 2.2 桌面端：ChatGPT 桌面客户端「Codex 代码模式」

> ⚠️ **重要生态演进**：2026 年下半年，原独立的 Codex 桌面应用正式退役，所有桌面端能力已完全并入 **ChatGPT 桌面客户端**。

### 1. 安装与进入代码模式

```bash
# macOS：直接下载 ChatGPT.dmg，拖入 Applications
# Windows：使用 winget 一键安装
winget install OpenAI.ChatGPT
```

启动 ChatGPT 客户端并登录后，点击左侧边栏的 **Codex** 标签页，即进入「Codex 代码模式（Code Mode）」。

**新增核心生产力特性：**
- **Sites 原位托管**：在客户端内一键创建、部署和预览 Web 项目，配合 Annotations 批注实现“指着界面改代码”。
- **多仓库审查（Multi-repo Review）**：大型微服务或多包工程可在单一视图下统一审查 Diff。
- **内置浏览器升级**：直接检索浏览历史，并可引用当前 Chrome 打开的标签页进行上下文分析。

### 2. Computer Use 视觉测试权限配置

让 AI 自主操作桌面屏幕（Computer Use）**目前主要支持 macOS**，需在 macOS「系统设置 → 隐私与安全性」中授予 ChatGPT 两项核心权限：

```Plaintext
[macOS 系统设置] -> [隐私与安全性]
  ├─ 辅助功能 (Accessibility)  ──> 勾选 [ChatGPT] (允许模拟鼠标点击/按键)
  └─ 屏幕录制 (Screen Recording) ──> 勾选 [ChatGPT] (允许截屏并由 Vision 模型分析)
```

**安全边界控制**：
- 首次操作某个第三方应用（如 Google Chrome）时，会弹窗询问你是否授权该应用。
- ChatGPT 无法自动操作终端本身、自身界面或系统级管理员授权弹窗（例如 `sudo` 提权输入密码）。

---

## 2.3 手机端（ChatGPT App）全天候看护桥接

人在户外或离岗时，无需死守工位：

1. **官方原生任务同步**：当你使用 ChatGPT 账号登录 Codex 时，终端与云端的任务都会实时同步到手机 ChatGPT App 中。你可以掏出手机查看长任务的执行进度、随时发送补充指令。
2. **Guardian 审批与 Webhook 提醒**：结合 Ch.08 的移动看护网关，当遇到需要人工确认的临界高危操作（如线上部署、数据库变更）时，通知将精准推送到飞书或微信，手机端回复数字即可一键放行或驳回。

---

## 🛡️ 翻车自救与避坑速查表

| 常见报错 / 翻车现象 | 核心原因 | 极速自救指南 |
| :--- | :--- | :--- |
| `error: unknown option '--full-auto'` | CLI 升级到 0.14x 后废弃了旧参数 | 替换为新沙盒参数：`--sandbox workspace-write` |
| `SyntaxError: Unexpected token ...` (Node 报错) | 本地 Node.js 版本低于 20 | 运行 `node -v` 检查，使用 `nvm use 20` 或 `nvm install 20` 升级 Node |
| `Permission denied: Screen Recording` | macOS 未开启屏幕录制权限 | 打开「系统设置 → 隐私与安全性 → 屏幕录制」，将 ChatGPT / Terminal 勾选开启并重启客户端 |
| `Model not found: gpt-5.4` | 旧模型已正式退役下线 | 检查 `~/.codex/config.toml`，将 `model` 升级为 `gpt-5.6-terra` |

---

[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.01) ](./ch01_mindset.md) | [ ➡️ 下一章 (Ch.03) ](./ch03_sandbox.md) | [ 🌐 English ](../en/ch02_setup.md)
