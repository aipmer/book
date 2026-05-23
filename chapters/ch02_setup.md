[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.01) ](./ch01_mindset.md) | [ ➡️ 下一章 (Ch.03) ](./ch03_sandbox.md)

# Ch.02 跨端掌控：Codex 多端生产力矩阵搭建

工欲善其事，必先利其器。在“实战产品说”中，我常强调一个原则：**AI Native 开发的第一步，是把你的“指挥舱”配置得足够稳定。** 很多新手急着去跟 AI 聊天写代码，结果因为本地环境不匹配、权限没开对，导致 AI 在终端疯狂报错、浪费 Token。

本章将带你一步步配置 Codex 的多端生产力矩阵，包括 CLI 客户端、Desktop App 以及 ChatGPT 移动端的联动桥接。

---

## 2.1 CLI 客户端（Rust 核心）安装与避坑

Codex CLI 的核心是用 Rust 编写的，执行效率极高。在 macOS/Linux 下，我们通过以下步骤完成初始化：

### 1. 基础环境检查与安装
确保你的系统已安装 Rust 构建工具包。在终端运行：

```bash
# 检查 Rust 编译器是否可用
rustc --version

# 使用官方脚本一键安装/更新 Codex CLI
curl -fsSL https://codex-agent.download/install.sh | sh
```

### 2. 注入 API 密钥与账单熔断防爆配置
AI 暴走可能会在几小时内刷爆你的卡。我们需要在环境变量中注入 Key 的同时，配置本地和云端的双重账单熔断（Hard Caps）。

在你的 `~/.zshrc` 或 `~/.bashrc` 中写入：

```bash
# 注入 OpenAI API 密钥
export OPENAI_API_KEY="sk-proj-xxxxxx..."

# 设置 Codex 单次任务的最大预算（单位：美元）
export CODEX_MAX_BUDGET_PER_TASK=2.0

# 限制 Codex 每分钟最大请求次数，避免被 API 速率限制（Rate Limit）惩罚
export CODEX_MAX_RPM=50
```

> 💡 **主理人避坑小贴士**：强烈建议在 OpenAI 后台将该 API Key 的月度额度（Usage Limit）硬限制设置为 50 美元，即使 AI 发生无限循环，也能保证你的资金绝对安全。

---

## 2.2 桌面端（Desktop App）与 Computer Use 权限配置

为了让 Codex 能够自主操作你的屏幕进行测试，你需要安装 Codex Desktop，并授予其操作系统底层权限。

### 1. 下载与权限申请
安装完成后启动 Desktop App，系统会自动弹出权限申请弹窗。你必须在 **macOS “系统设置” -> “隐私与安全性”** 中完成以下三项授权：
*   **辅助功能 (Accessibility)**：允许 Codex 模拟鼠标点击和键盘输入。
*   **屏幕录制 (Screen Recording)**：允许 Codex 截取屏幕图像输入给 Vision 模型进行识别。
*   **终端控制 (Full Disk Access / Automation)**：允许 Codex 向你本地的 IDE 和终端发送操作流。

```
[macOS 系统设置] -> [隐私与安全性]
  ├─ 辅助功能 (Accessibility)  ──> 勾选 [Codex Desktop] (启用模拟鼠标/键盘)
  ├─ 屏幕录制 (Screen Recording) ──> 勾选 [Codex Desktop] (允许 Vision 分析)
  └─ 完全磁盘访问权限 (Full Disk Access) ──> 勾选 [Codex Desktop] (允许文件同步)
```

---

## 2.3 手机端（ChatGPT App）监控桥接

人在户外时，我们可以利用 Pusher 或第三方免费的 Webhook 转发服务（如 Keepa/Make），将 Codex 的执行状态推送到你的手机。

### 1. 配置本地配置文件 (`.codex/config.json`)
在你的家目录或项目根目录下创建 `.codex/config.json`，配置你的移动端端推送网关：

```json
{
  "telemetry": {
    "enabled": true,
    "webhook_url": "https://api.pmer.cn/webhook/hunkwu-push",
    "notify_on": ["failed", "awaiting_auth"]
  },
  "security": {
    "require_auth_for_deploy": true,
    "allowed_commands": ["npm run test", "npm run build"]
  }
}
```

### 2. 手机端一键授权
当你在咖啡馆喝咖啡时，本地的 Codex 运行到了部署步骤，你的手机 ChatGPT App 或自定义 Webhook 就会收到卡片推送。你只需要在微信或 Slack 群中回复 `1`，中转网关便会向本地 Codex 进程写入信号（如 Ch.08 所述），继续执行发布。


---

---

[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.01) ](./ch01_mindset.md) | [ ➡️ 下一章 (Ch.03) ](./ch03_sandbox.md)
