[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.01) ](./ch01_mindset.md) | [ ➡️ 下一章 (Ch.03) ](./ch03_sandbox.md) | [ 🌐 English ](../en/ch02_setup.md)

# Ch.02 跨端掌控：Codex 多端生产力矩阵搭建

工欲善其事，必先利其器。在“实战产品说”中，我常强调一个原则：**AI Native 开发的第一步，是把你的“指挥舱”配置得足够稳定。** 很多新手急着去跟 AI 聊天写代码，结果因为本地环境不匹配、权限没开对，导致 AI 在终端疯狂报错、浪费 Token。



本章将带你一步步配置 Codex 的多端生产力矩阵，包括 CLI 客户端、Desktop App 以及 ChatGPT 移动端的联动桥接。

---

## 2.1 CLI 客户端（Rust 核心）安装与避坑



Codex CLI 的核心是用 Rust 编写的（codex-rs），运行效率极高；但 OpenAI 通过 npm 提供了官方分发包，**作为用户你不需要安装 Rust 工具链**，只需要 Node.js 18+（推荐 20+）。

### 1. 基础环境检查与安装

在终端运行：

```Bash
# 检查 Node.js（要求 18+，推荐 20+）
node --version

# 方式 A：官方一键脚本（macOS / Linux）
curl -fsSL https://chatgpt.com/codex/install.sh | sh

# 方式 B：npm 全局安装
npm install -g @openai/codex

# 方式 C：Homebrew
brew install --cask codex
```

Windows 用户可以通过 PowerShell 安装：

```Bash
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"
```

安装完成后，验证：

```Bash
codex --version
```

### 2. 认证方式选择：ChatGPT 账号 vs API Key

Codex CLI 提供两种认证方式，**官方默认推荐 ChatGPT 账号登录**：

- **方式 A（推荐 / 默认）**：直接在终端运行 `codex`，浏览器会自动弹出 ChatGPT 登录页面。**ChatGPT Plus（$20/月）、Pro、Team、Business、Edu、Enterprise 套餐都已经包含 Codex 用量额度**，对独立开发者是性价比最高的选择。

- **方式 B（按量计费 / CI 场景）**：使用 OpenAI API Key。适合 CI/CD 自动化场景，或订阅额度跑满后兜底。

```Bash
# 在你的 ~/.zshrc 或 ~/.bashrc 中写入
export OPENAI_API_KEY="sk-proj-xxxxxx..."
```

### 3. 账单熔断防爆配置

AI 暴走可能会在几小时内刷爆你的卡。**Codex CLI 本身没有 “每任务预算” 或 “每分钟请求数” 这类环境变量**，真正的防爆控制路径有三条：

1. **OpenAI 后台硬上限（最重要）**：在 OpenAI 平台后台为该 API Key 设置月度 Usage Limit 硬限制（建议初学者设为 $50）。即使 AI 发生无限循环，也能保证你的资金绝对安全。

2. **`config\.toml`**** 中的 Token 控制**：在 `\~/\.codex/config\.toml` 写入：

```Plaintext
# 每次工具输出的 token 上限，防止误读超大文件
tool_output_token_limit = 12000

# 主动压缩历史的阈值，避免上下文无限膨胀
model_auto_compact_token_limit = 64000
```

3. **沙盒与审批策略**：通过 `sandbox\_mode`、`approval\_policy` 限制 Codex 的危险动作（详见 Ch.05）。

> 💡 **主理人避坑小贴士**：如果你用的是 API Key 模式，**务必去 OpenAI 后台把月度额度（Usage Limit）写死**——这是最后一道保险，比任何环境变量都靠谱。

---

## 2.2 桌面端（Desktop App）与 Computer Use 权限配置

> **前置说明**：Codex 的 Computer Use（让 AI 操作你的桌面应用）**目前仅支持 macOS**，欧洲经济区（EEA）、英国和瑞士因合规暂未开放。Windows / Linux 用户暂不可用。
> 
> 



为了让 Codex 能够自主操作你的屏幕进行测试，你需要安装 Codex Desktop，并授予其操作系统底层权限。

### 1. 下载与插件安装

1. 从 [openai.com/codex](https://openai.com/codex) 下载并安装 Codex Desktop App(macOS)。

2. 启动 App，在 **「Settings → Computer Use」** 中点击 **Install** 安装 Computer Use **插件**（这是个单独的 plugin，默认未启用）。

### 2. 系统权限授权

在 macOS **「系统设置 → 隐私与安全性」** 中，授予 Codex 两项权限：

- **辅助功能 (Accessibility)**：允许 Codex 模拟鼠标点击和键盘输入。

- **屏幕录制 (Screen Recording)**：允许 Codex 截取屏幕图像输入给视觉模型进行识别。

```Plaintext
[macOS 系统设置] -> [隐私与安全性]
  ├─ 辅助功能 (Accessibility)  ──> 勾选 [Codex] (启用模拟鼠标/键盘)
  └─ 屏幕录制 (Screen Recording) ──> 勾选 [Codex] (允许 Vision 分析)
```

---

### 3. 能力边界（重要）

Computer Use 的安全边界由 macOS 系统层 + Codex App 内的 GUI 白名单共同决定：

- 你需要在 Codex App 设置中**显式批准每一个 Computer Use 可以操作的应用**（首次使用某 App 时会弹窗询问，可勾选 “Always allow”）。

- 出于安全原因，Codex **无法用 Computer Use 自动操作终端、Codex 自身、或系统级管理员授权弹窗**。

---

## 2.3 手机端（ChatGPT App）监控桥接



2.3 手机端（ChatGPT App）监控桥接

人在户外时，希望本地或云端的 Codex 任务能把状态推送到手机。**注意：Codex 本身没有内置 “任务失败时自动推送到微信/飞书” 的字段**——本节展示的是用 **GitHub Actions + Webhook 网关 + 飞书/企微机器人** 自行拼装的方案。

### 1. 整体思路

```Plaintext
[Codex 任务 (本地/云端)] → [GitHub Actions 或自定义脚本] → [Webhook 网关] → [飞书/企微/Telegram 机器人]
                                                                  ↓
                                                          [手机端收到推送]
```

具体的 GitHub Actions 配置与 Webhook 中转脚本见 Ch.08。

### 2. 手机端 ChatGPT App 中查看 Codex 任务

如果你用 **ChatGPT 账号登录** Codex，你的云端 Codex 任务会自动同步到手机 ChatGPT App，可以随时查看进度、发送追加指令。这是 OpenAI 官方提供的能力，不需要额外配置。

### 3. 双向交互（自定义实现）

当你在咖啡馆喝咖啡时，本地的 Codex 运行到了部署步骤，通过 Ch.08 展示的网关脚本，飞书或企微机器人会收到卡片推送。你只需要在群中回复 `1`，中转网关解析后向本地 Codex 进程发送批准信号（通过文件信号、HTTP 回调或 Codex 的 hooks 机制），继续执行发布。

---

[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.01) ](./ch01_mindset.md) | [ ➡️ 下一章 (Ch.03) ](./ch03_sandbox.md) | [ 🌐 English ](../en/ch02_setup.md)
