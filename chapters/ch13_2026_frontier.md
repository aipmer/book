# Ch.13 前沿瞭望：2026 Codex 生态全景升级

> 🚀 **「工具每三个月换一轮血，心智模型才是你唯一的护城河。本章不是新闻汇总，而是一份『迁移作战地图』：告诉你哪些旧命令已经作废、哪些新能力必须立刻接管你的工作流。」**

前面十二章建立的，是一套不依赖具体版本的编排方法论。但方法论要落地，就必须踩在真实的工具地面上。2026 年的 Codex 生态发生了四次结构性地震：**桌面端大合并、模型大换代、插件生态成型、安全能力独立成军**。本章逐条拆解这些变化，并给出具体的迁移命令与配置。

---

## 13.1 桌面端大合并：Codex App 并入 ChatGPT 客户端

2026 年 7 月，独立的 Codex 桌面应用正式退役，全部能力并入 **ChatGPT 桌面客户端**，以「Codex 代码模式（Code Mode）」的形态存在。免费、Plus 与企业版用户均可使用。

**迁移动作：**

```bash
# macOS：直接下载 ChatGPT.dmg，拖入 Applications
# Windows：使用 winget 安装
winget install OpenAI.ChatGPT
```

登录后点击左侧边栏的 **Codex** 标签页即可进入代码模式。需要特别注意的两点：

1. **账号 vs API Key**：使用 ChatGPT 账号登录可获得完整能力（云端任务、跨端同步、Computer Use）；使用 API Key 登录仅有本地基础编码能力。
2. **独立组件不受影响**：Codex CLI、VS Code 插件、Codex Cloud 均为独立产品，继续正常演进。本书 Ch.02 的多端矩阵依然成立，只是「桌面 App」这一格换成了 ChatGPT 客户端。

**新增能力速览：**
- 内置浏览器升级：地址栏直接搜索浏览历史，Chrome 扩展可引用当前打开的标签页。
- **多仓库审查（Multi-repo Review）**：多文件夹项目可在一个视图中查看所有仓库的变更行数并逐一审查 Diff，不再需要来回切换。
- **Sites**：在客户端内直接创建、部署、管理托管 Web 项目，配合 Annotations 实现「指哪改哪」的原位编辑。

---

## 13.2 模型大换代：GPT-5.6 Terra 与 Luna 接管

2026 年 8 月 31 日起，`GPT-5.4` 与 `GPT-5.4 mini` 在 Codex（ChatGPT 登录态）中正式退役。官方指定的替代关系：

| 退役模型 | 继任模型 | 定位 |
| --- | --- | --- |
| `gpt-5.4` | `gpt-5.6-terra` (GPT-5.6 Terra) | 主力深度推理模型 |
| `gpt-5.4-mini` | `gpt-5.6-luna` (GPT-5.6 Luna) | 轻量快速模型（Guardian 审批等场景） |

**迁移检查清单：**

```bash
# 1. 检查你的配置文件中是否硬编码了旧模型
grep -rn "gpt-5.4" ~/.codex/config.toml .

# 2. 在 config.toml 中显式升级默认模型
```

```toml
# ~/.codex/config.toml
model = "gpt-5.6-terra"
# 轻量后台任务（如自动审查）可单独指定
[profiles.guardian]
model = "gpt-5.6-luna"
```

> ⚠️ **注意**：使用 API Key 认证的会话仍可继续调用 GPT-5.4 系列，但 ChatGPT 登录态必须切换。所有定时任务（Automations）、工作区默认配置、自定义 Agent 都要逐一排查。

---

## 13.3 CLI 0.14x：必须知道的决定性变更

Codex CLI 已进入 `0.14x` 时代（截至 2026 年 8 月最新稳定版 `0.147.0`）。以下变更直接影响本书前文的所有命令示例：

```bash
npm install -g @openai/codex@latest
```

### 1. `--full-auto` 正式移除

```bash
# ❌ 旧写法（已报错）
codex exec --full-auto "修复所有 lint 错误"

# ✅ 新写法：用沙盒模式表达自治级别
codex exec --sandbox workspace-write "修复所有 lint 错误"
```

### 2. Hooks 引擎转正（Stable）

Ch.05 中提到的「拦截层」现在是一等公民。可在 `config.toml` 中直接配置 `SessionStart` / `Stop` 钩子，并能观测 MCP 工具调用、`apply_patch` 与长时间运行的 Bash 会话：

```toml
# ~/.codex/config.toml
[hooks]
session_start = "bash scripts/bootstrap-env.sh"
stop = "npm run lint --silent"
```

### 3. Agent Plugins 与插件市场

插件体系从实验走向正式，支持本地、个人、工作区与远程四层目录，并可安装面向 Amazon Bedrock、Claude Code 的第三方市场：

```bash
# 插件管理统一入口
codex plugin list
codex plugin marketplace add https://plugins.example.com/catalog.json
codex plugin install security-workbench
```

在对话中通过 `@plugin` 提及即可自动注入插件上下文（MCP / App / Skill）。

### 4. 子智能体（Subagents）与多智能体编排

CLI 原生支持派生拥有独立上下文窗口的子智能体，可将大任务切分为并行流水线：

```text
> 派生两个子智能体：一个为 src/api 补充集成测试，
  另一个并行重构 src/hooks 的状态管理，最后汇总 Diff 给我审查。
```

配合 `git worktree` 隔离，多个智能体可在互不污染的工作区并行作业——这正是 Ch.04「目标驱动」思想的官方实现。

### 5. Guardian 自动审批与 `--approve-for-me`

高危操作不再只有「人肉点确认」一条路。新的 `--approve-for-me` 标志可将审批请求路由给 Guardian 子智能体（由 GPT-5.6 Luna 驱动）自动评审，符合策略的操作自动放行，越界操作拦截并给出理由：

```bash
codex --approve-for-me "升级依赖并跑通测试"
```

这与本书 Ch.08 的「移动端审批网关」互为补充：低风险交给 Guardian，高风险才推到你的手机。

### 6. MCP 2026-07-28 协议

支持分页发现、多轮请求与非阻塞服务器启动。旧的 `.mcp.json` 配置继续兼容，但新写的 MCP Server 建议按 2026-07-28 规范实现。

---

## 13.4 Skills 生态：把重复流程沉淀为资产

如果说 AGENTS.md 是项目的「通用法律」，**Skills 就是某一类任务的「专项流程」**：PR Review、飞书文档整理、PPT 生成、CI 修复、安全扫描……任何会重复三次以上的流程，都值得沉淀为 Skill。

```text
# Skill 的标准目录结构（放在 ~/.codex/skills/ 或插件包内）
skills/
└── pr-review/
    └── SKILL.md      # 带 YAML frontmatter 的流程说明书
```

Skills 可与插件一起发布到市场，供团队统一安装。这实现了 Ch.05 CAP 协议的「跨项目复用」：协议约束行为，Skill 固化流程。

---

## 13.5 Codex Security 与 Daybreak：安全能力独立成军

2026 年 8 月，OpenAI 推出面向防御方的 **Daybreak** 双层访问体系：

- **Daybreak Blue**：通用模型（GPT-5.6 Sol），覆盖漏洞发现、安全代码审查、检测工程、事件响应、恶意软件分析与补丁验证——绝大多数防御性安全工作从这里开始。
- **Daybreak Red**：专用训练模型（GPT-5.6 Cyber），用于经明确授权的漏洞复现、利用验证、渗透测试与红队行动，需单独审批开通。

配合 **Codex Security 插件与 CLI**，安全工作流全面产品化：

```bash
# 在工作台中跑一次深度扫描
codex plugin install codex-security
# 或在 CI 中批量扫描
codex-security scan --deep --report sarif > results.sarif
```

实战红线（与 Ch.05 的沙盒边界一脉相承）：

1. 在**隔离环境**中工作，显式定义授权范围（engagement scope）。
2. 使用最小权限的 Permission Profiles。
3. 为跨越沙盒边界的动作配置 **Auto-review**，让 Guardian 先行评审。

---

## 13.6 本章迁移清单（TL;DR）

```bash
# ① 桌面端：弃用旧 Codex App，改装 ChatGPT 客户端
winget install OpenAI.ChatGPT        # Windows
# macOS 下载 ChatGPT.dmg

# ② CLI 升级到 0.147.0+
npm install -g @openai/codex@latest

# ③ 模型切换到 GPT-5.6 系列（8月31日前必须完成）
grep -rn "gpt-5.4" ~/.codex/ .       # 全面排查

# ④ 替换已移除的 --full-auto
codex exec --sandbox workspace-write "<task>"

# ⑤ 启用 Guardian 自动审批
codex --approve-for-me "<task>"

# ⑥ 安装插件市场与安全插件
codex plugin marketplace add <catalog-url>
codex plugin install codex-security
```

---

## 13.7 终局不变量

工具层面的结论只有一条：**凡是写死在脚本里的版本号、命令行标志、模型代号，都是技术债**。把它们集中到 `config.toml` 与 `AGENTS.md` 中管理，让迁移成本收敛到「改一行配置」。

而穿越所有版本周期仍然成立的，正是本书反复强调的三件事：目标驱动而非步骤驱动、边界先行而非事后追责、人机分工而非人被 AI 牵着走。工具会换血，心智不打折。
