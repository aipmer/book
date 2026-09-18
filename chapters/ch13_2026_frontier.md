[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.12) ](./ch12_commercialization.md) | [ 🌐 English ](../en/ch13_2026_frontier.md)

# Ch.13 前沿瞭望：2026 Codex 生态全景升级

> 🎯 **具体工程麻烦**：工具迭代极快，旧命令作废（Codex 桌面端退役并入 ChatGPT 代码模式）、模型换代（GPT-5.6）、CLI 变更不知所措。  
> 💡 **可运行实战代码与落地收益**：2026 迁移命令作战清单（winget/brew 安装、CLI 0.14x 变更配置、Plugins 插件系统对接）；版本兼容检查脚本。  
> ⚡ **社交传播 / 截图金句**：“工具每三个月换一轮血，心智才是护城河。这里没有空洞新闻，只有告诉你哪条命令已作废的作战地图。”

前面十二章建立的，是一套不依赖具体版本的编排方法论。但方法论要落地，就必须踩在真实的工具地面上。2026 年的 Codex 生态发生了四次结构性地震：**桌面端大合并、模型大换代、插件生态成型、安全能力独立成军**。本章逐条拆解这些变化，并给出具体的迁移命令与配置。

---

## 🎯 生活化直觉隐喻：超音速客机的新一代航电换装

不要对频繁的版本迭代感到恐慌。用飞行员的视角来理解这次升级：

```Plaintext
【驾驶心智】 ──> 你的飞行手册没有变：依然是目标驱动（起飞与降落目标）、边界约束（航线与安全高度）。
【动力引擎】 ──> 动力系统换装为前沿旗舰「GPT-6 Astra」（具备超视距雷达与全自主航电控制的顶级核心）、
                 日常主力发动机「GPT-5.6 Terra」以及高频巡航/Guardian 自动审批发动机「GPT-5.6 Luna」。
【驾驶舱屏】 ──> 原先外挂的副屏（独立 Codex App）正式集成到主驾驶台（ChatGPT 桌面端代码模式），
                 并新增 Sites 原位实景雷达与 Annotations 触控批注。
【自动副驾】 ──> 过去的简单定速巡航（--full-auto）升级为具备安全航线自检的「智能副驾」（--sandbox + Guardian）。
```

只要心智在握，新工具只会让你飞得更快、更稳。

---

## 🚀 新手极速上手 3 步走（无痛起步）

用 3 步完成你的 2026 工具链体检与迁移：

1. **步骤一：一键全面排查过时的旧模型代号**  
   在项目根目录运行 grep 扫描：
   ```bash
   grep -rn "gpt-5.4" ~/.codex/config.toml .
   ```
2. **步骤二：全局升级至 CLI 0.147.0+ 稳定版**  
   运行 npm 全局更新命令：
   ```bash
   npm install -g @openai/codex@latest
   codex --version
   ```
3. **步骤三：淘汰旧的 `--full-auto` 废弃指令**  
   在所有本地别名（aliases）与 CI 脚本中，将 `--full-auto` 替换为：
   ```bash
   codex exec --sandbox workspace-write "<task>"
   ```

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

1. **账号 vs API Key**：使用 ChatGPT 账号登录可获得完整能力（云端任务、跨端同步、Sites 托管、Computer Use）；使用 API Key 登录仅有本地基础编码能力。
2. **独立组件不受影响**：Codex CLI、VS Code 插件、Codex Cloud 均为独立产品，继续正常演进。本书 Ch.02 的多端矩阵依然成立，只是「桌面 App」这一格换成了 ChatGPT 客户端。

**新增能力速览：**
- 内置浏览器升级：地址栏直接搜索浏览历史，Chrome 扩展可引用当前打开的标签页。
- **多仓库审查（Multi-repo Review）**：多文件夹项目可在一个视图中查看所有仓库的变更行数并逐一审查 Diff，不再需要来回切换。
- **Sites**：在客户端内直接创建、部署、管理托管 Web 项目，配合 Annotations 实现「指哪改哪」的原位编辑。

---

## 13.2 模型大换代：GPT-6 Astra 领衔与 2026 模型全景演进

2026 年下半年，OpenAI 的模型版图迎来了结构性质变：告别了过往单模型修修补补的策略，一方面正式推出了定位前沿自主智能体的最新旗舰 **GPT-6 Astra**，另一方面将 **GPT-5.6 家族** 固化为清晰的持久化三层阶梯体系（Sol / Terra / Luna）。

### 1. 新一代前沿旗舰登场：GPT-6 Astra（2026年9月3日发布）

OpenAI 于 2026 年 9 月 3 日正式发布最新一代旗舰模型 **GPT-6 Astra**（API 代号：`gpt-6-astra`）。这是 OpenAI 历史上智能化程度与对齐水准最高的模型，核心参数与特性包括：

*   **超长上下文与超大输出**：原生支持 **105 万 (1.05M) Token 上下文窗口** 与 **128,000 输出 Token**，彻底打破超大型单体仓库与多应用全量代码注入的上下文天花板。
*   **原生计算机操作员（Native Computer Operator）**：专为 **Computer Use** 设计，模型不再仅是文本生成器，而是具备像人类程序员一样直接识别屏幕像素、定位交互控件、跨多个桌面软件端到端执行研发与视觉校对的强大能力。
*   **顶尖基准突破**：在 SWE-bench 软件工程基准与 FrontierMath 数学推理评测中刷新业界最高纪录。
*   **安全分级认证**：在 OpenAI 预备框架（Preparedness Framework）中被评定为具备“关键（Critical）”级别的网络安全攻防与逆向推理能力。

### 2. 2026 在役主流模型矩阵决策表

面对多款在役模型，工程选型切忌“凡事盲目上最贵”，要按需分流：

| 模型代号 | 官方命名 | 定位与核心场景 | 优势与选型建议 |
| :--- | :--- | :--- | :--- |
| `gpt-6-astra` | **GPT-6 Astra** | 前沿自主智能体 / Computer Use 计算机操作员 | 跨多个桌面软件联动、超长全栈架构设计、高保真视觉走查与像素自愈 |
| `gpt-5.6-sol` / `gpt-5.6` | **GPT-5.6 Sol** | 顶级推理与架构旗舰 (Daybreak Blue) | 大规模遗留系统重构、高难度算法攻坚、系统安全防御 |
| `gpt-5.6-terra` | **GPT-5.6 Terra** | 均衡型日常研发主力工作母机 | 团队日常主力编码，兼顾深度推理思考与响应速度，性价比极高 |
| `gpt-5.6-luna` | **GPT-5.6 Luna** | 轻量极速低延迟与自动化守卫 | 高并发轻量改动、测试路由分发、Guardian (`--approve-for-me`) 自动化审批 |

### 3. 2026 OpenAI 模型上新与退役下架路线图（Deprecation & Sunset Schedule）

随着新模型迭代，OpenAI 在 2026 年执行了密集严谨的清理与换代计划。开发者必须定期排查自己的依赖配置，避免生产突发中断：

| 时间节点 | 动作类型 | 涉及模型 / 服务 | 影响与官方替代方案 |
| :--- | :--- | :--- | :--- |
| **2026年3月26日** | 彻底关闭 (Shutdown) | `gpt-4-0314`, `gpt-4-1106-preview`, `gpt-4-0125-preview` | 早期 GPT-4 快照停服，全面迁移至 `gpt-5.6-terra` |
| **2026年5月12日** | API 下架 (Shutdown) | DALL-E 2 / DALL-E 3 | 图像 API 下架，迁移至 `gpt-image-1` / `gpt-image-2` |
| **2026年6月** | 界面退役 (Retired) | `o3`, `gpt-4.5`, 早期 `gpt-5` 测试快照 | 从 ChatGPT 界面移除，全面收敛至 GPT-5.6 / 6 体系 |
| **2026年8月26日** | 协议下线 (Shutdown) | 老版 Assistants API | 废弃旧架构，全面过渡为 Responses API 与原生 Agent 范式 |
| **2026年8月31日** | 正式退役 (Retired) | `gpt-5.4`, `gpt-5.4-mini` | 从 Codex 登录态移除，全面由 `gpt-5.6-terra` 与 `luna` 接管 |
| **2026年9月3日** | 正式发布 (Launch) | **GPT-6 Astra (`gpt-6-astra`)** | 全新前沿旗舰上线，支持 105 万上下文与原生 Computer Use |
| **2026年10月23日** | 批量关闭 (Scheduled) | 残存各版本 Preview 快照模型 | 官方统一清理预览版，强制要求锁定长期稳定模型 ID |
| **2026年12月1日** | 图像整合 (Scheduled) | `gpt-image-1-mini`, `gpt-image-1.5`, `chatgpt-image-latest` | 图像能力统一整合收敛至 `gpt-image-2` |

**配置升级推荐：**

```toml
# ~/.codex/config.toml

# 默认日常主力研发模型（推荐平衡深度与速度的 Terra）
model = "gpt-5.6-terra"

# 开启前沿自主操作与超长上下文（按需启用最新旗舰 Astra）
# model = "gpt-6-astra"

# 后台自动化审批与审查守卫（极速低成本 Luna）
[profiles.guardian]
model = "gpt-5.6-luna"

# 高阶全栈架构与安全性深度审计（顶级推理 Sol）
[profiles.architect]
model = "gpt-5.6-sol"
```

> ⚠️ **注意**：所有定时任务（Automations）、工作区默认配置、自定义 Agent 都要全面排查更新，禁止在生产中使用已退役的 `gpt-5.4` 或临时 `preview` 模型。

---

## 13.3 CLI 0.14x：必须知道的决定性变更

Codex CLI 已全面进入 `0.14x` 时代（最新稳定版 `0.147.0+`）。

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

在 `config.toml` 中直接配置 `SessionStart` / `Stop` 钩子，并能观测 MCP 工具调用、`apply_patch` 与长时间运行的 Bash 会话：

```toml
# ~/.codex/config.toml
[hooks]
session_start = "bash scripts/bootstrap-env.sh"
stop = "npm run lint --silent"
```

### 3. Agent Plugins 与插件市场

支持本地、工作区与远程三方市场：

```bash
# 插件管理统一入口
codex plugin list
codex plugin marketplace add https://plugins.example.com/catalog.json
codex plugin install security-workbench
```

在对话中通过 `@plugin` 提及即可自动注入插件上下文。

### 4. 子智能体（Subagents）与多智能体编排

CLI 原生支持派生拥有独立上下文窗口的子智能体：

```text
> 派生两个子智能体：一个为 src/api 补充集成测试，
  另一个并行重构 src/hooks 的状态管理，最后汇总 Diff 给我审查。
```

### 5. Guardian 自动审批与 `--approve-for-me`

高危操作不再只有“人肉点确认”一条路。新的 `--approve-for-me` 标志可将审批请求路由给 Guardian 子智能体（由 GPT-5.6 Luna 驱动）自动评审：

```bash
codex --approve-for-me "升级依赖并跑通测试"
```

---

## 13.4 Skills 生态：把重复流程沉淀为资产

如果说 AGENTS.md 是项目的“通用宪法”，**Skills 就是某一类任务的“专项工艺流程”**：

```text
skills/
└── pr-review/
    └── SKILL.md      # 带 YAML frontmatter 的流程说明书
```

---

## 13.5 Codex Security 与 Daybreak：安全能力独立成军

面向企业防御与关键基础设施保障，OpenAI 推出了 **Daybreak** 攻防体系与官方安全插件：

- **Daybreak Blue**：通用工程防御与漏洞自愈，基于高阶推理模型 **GPT-5.6 Sol**，覆盖自动化代码安全补丁生成与配置加固。
- **Daybreak Red / Frontier Eval**：红队攻防与深度渗透评估，基于具备“关键（Critical）”网络安全评级的最新前沿旗舰 **GPT-6 Astra**（通过受控权限与严格安全合规门禁），提供端到端未知漏洞挖掘与自动化逆向分析。

```bash
codex plugin install codex-security
codex-security scan --deep --report sarif > results.sarif
```

---

## 13.6 空间智能与 3D 跨界狂飙：GPT-6 Astra 联动 Blender 与 Tripo3D 实战

随着大语言模型从传统的纯文本与前后端代码，进化到具备物理世界空间理解能力的具身智能，2026 年下半年掀起了一场席卷 3D 建模、空间计算与游戏开发的**跨界狂飙**。

### 1. 行业突围：从“二维代码”到“空间具身几何”

2026 年 9 月，OpenAI 官方在 X 平台发布实机演示（[tweet #2100679992720142459](https://x.com/openai/status/2100679992720142459?s=46)）并公布了全新的 **BenchCAD** 评测基准——GPT-6 Astra 在“多视角视图逆向重构 CAD 几何代码”任务中拿下了惊人的 **95.9% 体素交并比 (mean voxel IoU)**。这意味着大模型长期为人诟病的“缺乏三维空间几何直觉”的短板被彻底攻破。

全球头部 3D 生成独角兽 **Tripo3D** 随后迅速官宣深度集成，上线了专有的 **[GPT-6 Astra 专属 3D 提示词工程模型中心](https://www.tripo3d.ai/zh/3d-prompts/models/gpt-6-astra)**。独立开发者如今可以用一套极简管线，完成过去需要数周的 3D 资产建模、灯光材质烘焙与端到端渲染。

### 2. “双引擎”协同体系心智模型

独立开发者必须破除一个常见误区：“指望大语言模型单凭文字直接生造出包含数万个多边形的复杂 3D 网格是不切实际的”。当前最高效的工业级实战范式，是 **GPT-6 Astra 与专业 3D 生成引擎（Tripo3D）及 DCC 软件（Blender）的优势互补**：

```Plaintext
[ 创意设想与空间需求 ]
         │
         ▼
[ GPT-6 Astra (3D 架构与技术美术总监) ] ──> 结构化提示词扩写 (拓扑/PBR材质/比例约束)
         │
         ▼
[ Tripo3D (原生 3D 几何与纹理生成引擎) ] ──> 极速生成连续网格 (Quad 拓扑, PBR, UV) 导出 .glb
         │
         ▼
[ Blender + bpy / Blender MCP (Astra 自动化接管) ] ──> 自动重设原点、Studio三点布光、多角度巡检渲染
         │
         ▼
[ 前端 Web / 游戏引擎 (Three.js / React Three Fiber) ] ──> 零成本在线交互分发
```

*   **Tripo3D（原生几何与材质引擎）**：拥有海量优质 3D 结构训练数据，负责从单张参考图或文本生成拓扑规整（Quad-dominant）、自带法线与高光贴图的基底资产。
*   **GPT-6 Astra（技术总监与自动化流水线中枢）**：充当资深 3D 技术美术（TA）。它负责提炼 3D 专属 Prompt，并通过 Python 脚本（`bpy`）或 **Blender MCP** 自动化接管 Blender，完成模型居中、地面吸附、影棚布光、摄像机运镜并基于视觉能力自主走查修复。

### 3. 四步端到端落地操作演练

#### 步骤一：使用 GPT-6 Astra 结构化提纯 3D 提示词
在 Codex 终端或桌面端中向 GPT-6 Astra 发送需求，要求其以 3D 技术总监角色输出适合 Tripo3D 的提示词：

```text
你现在是资深 3D 技术美术总监。我要在 Web 项目中嵌入一个“赛博朋克风格的全息贩卖机”。
请输出一份专为 Tripo3D 优化的专业结构化 3D 生成提示词。

要求：
1. 突出主体轮廓（Silhouette）与几何对称性；
2. 强制指定拓扑质量标签（Clean quad topology, game-ready, low-poly）；
3. 声明 PBR 材质映射规范（Matte painted metal, glowing neon emissive panels）。
```

Astra 将输出可直接复制至 Tripo3D 控制台的标准 Prompt：

```text
Cyberpunk holographic vending machine, freestanding rectangular kiosk with chamfered edges.
Center features transparent acrylic dispenser bay with internal glowing LED strip.
Materials: Brushed matte dark gray titanium alloy (roughness: 0.35, metallic: 0.85),
glowing cyan neon emissive trim lines (emission strength: 5.0), scratched hazard decals on base.
Topology tags: clean quad-dominant topology, watertight mesh, manifold geometry, PBR 4K textures, game-ready asset.
```

#### 步骤二：Tripo3D 快速生成并导出标准化 GLB
在 [Tripo3D 官网平台](https://www.tripo3d.ai/zh/3d-prompts/models/gpt-6-astra) 输入提纯后的提示词，平台将在数十秒内完成高精度网格构建与 UV 烘焙。点击导出为标准 **`vending_machine.glb`** 文件，存放于项目的 `public/models/` 目录中。

#### 步骤三：GPT-6 Astra 编写 Blender 自动化管线脚本（`pipeline.py`）
无需人工打开 Blender 费时调整，让 Astra 编写并运行完全无头的 Python 自动化脚本：

```python
import bpy
import math

# 1. 初始化纯净环境（清空默认立方体与杂乱灯光）
bpy.ops.wm.read_factory_settings(use_empty=True)

# 2. 自动导入 Tripo3D 生成的 GLB 资产
asset_path = "./public/models/vending_machine.glb"
bpy.ops.import_scene.gltf(filepath=asset_path)

# 3. 选中导入网格，自动计算边界盒并吸附至地面 (Z=0)
imported_objs = [obj for obj in bpy.context.selected_objects if obj.type == 'MESH']
if imported_objs:
    bpy.ops.object.select_all(action='DESELECT')
    for obj in imported_objs:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = imported_objs[0]
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
    
    # 获取世界坐标系下的最低点并补偿对齐
    min_z = min([v[2] for obj in imported_objs for v in [obj.matrix_world @ v.co for v in obj.data.vertices]])
    for obj in imported_objs:
        obj.location.z -= min_z

# 4. 自动化标准影棚三点布光 (Studio 3-Point Lighting)
# 主光 (Key Light)
key_light_data = bpy.data.lights.new(name="Key_Light", type='AREA')
key_light_data.energy = 500
key_light_data.size = 2.0
key_light = bpy.data.objects.new(name="Key_Light", object_data=key_light_data)
key_light.location = (3.0, -3.0, 4.0)
bpy.context.collection.objects.link(key_light)

# 辅光 (Fill Light)
fill_light_data = bpy.data.lights.new(name="Fill_Light", type='AREA')
fill_light_data.energy = 200
fill_light_data.size = 3.0
fill_light = bpy.data.objects.new(name="Fill_Light", object_data=fill_light_data)
fill_light.location = (-3.0, -2.0, 2.0)
bpy.context.collection.objects.link(fill_light)

# 轮廓光 (Rim Light)
rim_light_data = bpy.data.lights.new(name="Rim_Light", type='SUN')
rim_light_data.energy = 3.0
rim_light = bpy.data.objects.new(name="Rim_Light", object_data=rim_light_data)
rim_light.location = (0.0, 4.0, 3.0)
rim_light.rotation_euler = (math.radians(-45), 0, math.radians(180))
bpy.context.collection.objects.link(rim_light)

# 5. 设置展示摄像机
cam_data = bpy.data.cameras.new("Product_Camera")
cam_obj = bpy.data.objects.new("Product_Camera", cam_data)
cam_obj.location = (0, -4.5, 2.0)
cam_obj.rotation_euler = (math.radians(72), 0, 0)
bpy.context.collection.objects.link(cam_obj)
bpy.context.scene.camera = cam_obj

# 6. 配置 Eevee 快速无头验证渲染
bpy.context.scene.render.engine = 'BLENDER_EEVEE_NEXT'
bpy.context.scene.render.resolution_x = 1280
bpy.context.scene.render.resolution_y = 720
bpy.context.scene.render.filepath = "./public/renders/validation_preview.png"

bpy.ops.render.render(write_still=True)
print("✅ Blender 自动化巡检渲染完成：./public/renders/validation_preview.png")
```

在终端以无头后台方式运行：
```bash
blender --background --python pipeline.py
```
渲染完成后，GPT-6 Astra 直接读取 `validation_preview.png`，运用 Vision 视觉感知核对有无模型破损、法线反转或光影过曝，自主迭代代码直到测试通过。

#### 步骤四：一键嵌入 Web 端（React Three Fiber 商业化呈现）
最后，将该资产以零成本嵌入你的前端产品（如 Next.js 15 或 Vite 项目）中，供用户实时旋转查看：

```tsx
// components/VendingMachineViewer.tsx
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';

export function VendingMachineViewer() {
  const { scene } = useGLTF('/models/vending_machine.glb');
  return (
    <div className="w-full h-[500px] bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
      <Canvas camera={{ position: [0, 2, 4], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} />
        <primitive object={scene} position={[0, -1, 0]} />
        <Environment preset="city" />
        <OrbitControls autoRotate autoRotateSpeed={2.0} enableZoom={true} />
      </Canvas>
    </div>
  );
}
```

---

## 13.7 成本优化与弹性分流：Codex Switch 多供应商实战

在 2026 年多模型共存的生态下，高水准独立开发者绝不会被单一供应商锁死：

1. **跨级别模型弹性分流**：常规日常编码使用 `gpt-5.6-terra`，轻量审批使用 `gpt-5.6-luna`，只在需要全桌面级视觉走查、3D 空间计算与超长上下文攻坚时才调用 `gpt-6-astra`。
2. **多供应商与灾备切换**：当遇到 OpenAI 官方账号用量限流（Rate Limit）或额度见底时，借助开源利器 **[Codex Switch](https://github.com/aipmer/codex-switch)**，一秒切换至 DeepSeek 或 Kimi Code，其特有的**跨供应商会话续聊机制**能够保持历史会话上下文无损延续，保障全天候研发闭环不间断。

---

## 13.8 本章迁移清单（TL;DR）

```bash
# ① 桌面端：改装 ChatGPT 客户端
winget install OpenAI.ChatGPT        # Windows

# ② CLI 升级到 0.147.0+
npm install -g @openai/codex@latest

# ③ 模型升级到 GPT-6 Astra / GPT-5.6 阶梯
grep -rn "gpt-5.4" ~/.codex/ .       # 全面排查退役模型并替换

# ④ 替换已移除的 --full-auto
codex exec --sandbox workspace-write "<task>"

# ⑤ 启用 Guardian 自动审批
codex --approve-for-me "<task>"

# ⑥ 多供应商无缝切换与防限流
git clone https://github.com/aipmer/codex-switch.git && cd codex-switch && ./install.sh
codex-switch --to deepseek

# ⑦ 安装插件市场与安全插件
codex plugin marketplace add <catalog-url>
codex plugin install codex-security
```

---

## 🛡️ 翻车自救与避坑速查表

| 常见踩坑现象 | 致命原因 | 极速排查与自救指南 |
| :--- | :--- | :--- |
| `Unknown argument: --full-auto` | 0.14x 彻底删除了该参数，脚本报错中断 | 替换为 `--sandbox workspace-write` |
| `API Error: Model 'gpt-5.4' is deprecated` | 8月31日后模型已正式下线 | 编辑 `~/.codex/config.toml`，将模型修改为 `gpt-5.6-terra` |
| `Failed to install plugin: catalog not found` | 插件市场源 URL 无法访问或网络被阻断 | 检查网络连通性，或使用本地路径安装插件：`codex plugin install ./my-plugin` |

---

## 13.7 终局不变量

工具层面的结论只有一条：**凡是写死在脚本里的版本号、命令行标志、模型代号，都是技术债**。把它们集中到 `config.toml` 与 `AGENTS.md` 中管理，让迁移成本收敛到「改一行配置」。

而穿越所有版本周期仍然成立的，正是本书反复强调的三件事：目标驱动而非步骤驱动、边界先行而非事后追责、人机分工而非人被 AI 牵着走。工具会换血，心智不打折。

---

[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.12) ](./ch12_commercialization.md) | [ 🌐 English ](../en/ch13_2026_frontier.md)
