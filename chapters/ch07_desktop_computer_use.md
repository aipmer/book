[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.06) ](./ch06_reasoning_steer.md) | [ ➡️ 下一章 (Ch.08) ](./ch08_mobile_workflow.md) | [ 🌐 English ](../en/ch07_desktop_computer_use.md)

# Ch.07 视觉闭环：Desktop Computer Use 自动巡检与设计还原

> 🎯 **具体工程麻烦**：传统前端 UI 还原依赖肉眼查像素，响应式漏看弹窗遮挡；纯命令行测试无法覆盖真实浏览器渲染与点击。  
> 💡 **可运行实战代码与落地收益**：ChatGPT 桌面端代码模式操作框配置；Figma 设计稿与本地网页自动截图比对走查流程；UI 视觉巡检真实录屏复现。  
> ⚡ **社交传播 / 截图金句**：“写完前端还在肉眼查像素？让 AI 自己打开浏览器量尺寸、点按钮，截图标注哪里不合规。”

在传统的 UI 还原度走查中，最耗费产品经理和前端时间的是“像素眼”校对：

“这个按钮好像往左偏了 4 像素。”  
“这个弹窗在移动端尺寸下会被软键盘遮挡。”

在 2026 年的 Codex 生态中，通过 **ChatGPT 桌面客户端（Codex 代码模式）** 与最新前沿模型 **GPT-6 Astra**（OpenAI 专为 Computer Use 打造的原生计算机操作员模型）的结合，智能体不仅能编写代码，还能“动用眼和手”直接操作你的 macOS 桌面，打开浏览器、切换开发者工具分辨率并进行高保真视觉校对。

本章教你如何操纵 Computer Use 自动化完成前端 UI 的设计还原。

---

## 🎯 生活化直觉隐喻：24 小时不知疲倦的“像素质检员”

把 Computer Use 想象成你工位旁雇佣的专职体验质检员：

```Plaintext
【传统人工走查】 ──> 你一手拿 Figma 设计稿，一手拿手机或切换 Chrome 标签页，
                     肉眼眯着看字体大小对不对，手动缩放窗口查断点，改完代码再手动刷一次页面（低效枯燥）。
【Computer Use】 ──> 你给质检员下发任务卡：“对照设计稿，走查 /auth/login”。
                     质检员戴上防蓝光眼镜（截屏分析），右手握住鼠标（模拟点击），
                     量出距离相差 16px，直接在编辑器改好 Tailwind 类名，重新刷页面截屏交差。
```

你不必再当肉眼人肉比对机，把精力完全释放到业务逻辑交互设计上。

---

## 🚀 新手极速上手 3 步走（无痛起步）

用 3 步跑通你的首次 AI 视觉走查：

1. **步骤一：确认 ChatGPT 桌面端权限已授予**  
   在 macOS「系统设置 → 隐私与安全性」中，确认已勾选 **ChatGPT** 的「辅助功能」与「屏幕录制」权限。
2. **步骤二：在本地启动待测前端服务**  
   在终端启动项目开发服务器（确保能在浏览器打开）：
   ```bash
   npm run dev
   # 确认 http://localhost:3000 可访问
   ```
3. **步骤三：在代码模式中唤起 `@Chrome` 发送走查任务**  
   在 ChatGPT 桌面端 Codex 模式下输入：
   ```markdown
   @Chrome 请打开 http://localhost:3000 登录页，截取主卡片区域，检查是否有超出视口的横向溢出，并调整 padding。
   ```

---

## 7.1 安全第一：沙盒边界与屏幕操作白名单

让 AI 操作你的物理屏幕必须建立严密的安全围栏。为防止 AI 因误识别误点个人隐私聊天软件或改动系统文件，必须建立**应用层面的白名单控制**。

### 1. GUI 权限白名单

在 ChatGPT 桌面客户端中：
- 首次使用 Computer Use 操作某个特定应用（如 Google Chrome）时，会触发系统弹窗询问；
- 可选择 **“Just this once”**（仅本次允许）或 **“Always allow”**（永久放行）；
- 严禁将非必要应用（如微信、邮件、终端本身）加入白名单；
- **出厂硬限制**：Codex 无法自动操作终端、客户端自身或系统级管理员提权密码弹窗（`sudo`），这是操作系统级的硬隔离。

### 2. 坐标定位与视觉识别机制

Computer Use 遵循高可靠的感知闭环：

```Plain Text
[全屏/视口截屏] ──> [GPT-5.6 视觉模型识别] ──> [计算目标元素像素坐标 (x:450, y:230)] ──> [执行鼠标点击/滚动]
```

结合 2026 年新增的 **Appshots** 能力（快捷双击），可瞬间将前台焦点窗口的视觉截图与文本上下文直接压入当前会话，免去人工截图粘贴。

---

## 7.2 视觉驱动的 UI 走查实战：Figma 还原对比

这是最实用的自动化场景：**让 Codex 自主比对设计图与本地网页渲染，自动微调样式。**

### 🎯 目标 (Goal)
对比本地网页 `/auth/login` 与设计稿截图 `figma_login_mockup.png`，消除视觉间距差异。

### 🛑 约束 (Constraints)
- 仅允许调整 `src/app/login/page.tsx` 的 Tailwind 工具类。
- 禁止改动原有 DOM 树与语义化标签。

### 🧪 自动化执行 Specs

在 ChatGPT 客户端中发送：

```markdown
@Chrome 请按以下步骤完成 UI 视觉走查：

# 🎯 Goal
Compare and align browser rendering with figma_login_mockup.png.

# 🛑 Constraints
- Only use Tailwind utility classes in src/app/login/page.tsx.
- Do not change the DOM structure.

# 🚀 Execution Steps
1. Open Google Chrome and navigate to http://localhost:3000/auth/login.
2. Capture screenshot of the login form container.
3. Compare against assets/figma_login_mockup.png and identify padding discrepancies.
4. Update Tailwind classes in src/app/login/page.tsx to match spacing.
5. Reload page and confirm visual alignment within 2% delta.
```

---

## 7.3 Codex 自动走查的概念流程（示意）

```bash
> Running visual review for /auth/login
> Step 1: Opening Google Chrome on http://localhost:3000/auth/login...
> Step 2: Taking screenshot. Saved to /tmp/screenshot_v1.png
> Step 3: Calling vision model for image comparison.
    Analysis: "Login card padding-top is 16px (pt-4), but mockup requires 32px (pt-8). Font size is text-base, needs text-xl."
> Step 4: Updating src/app/login/page.tsx via apply_patch...
> Step 5: Reloading Chrome tab and taking validation screenshot...
> Step 6: Vision check: "Visual delta is within 1.2% tolerance. Perfectly aligned."
> Task completed successfully.
```

---

## 7.4 进阶：Sites 原位预览与响应式多端巡检

借助 2026 ChatGPT 桌面端内置的 **Sites** 功能与移动端断点走查：

```markdown
@Chrome
# 📱 Mobile Viewport Inspection
1. Open Chrome DevTools.
2. Toggle Device Toolbar and select iPhone 15 Pro (393 x 852).
3. Verify the submit button does not drop below the first screen fold.
4. If obscured, reduce hero section padding to keep the CTA button immediately clickable.
```

独立开发者无需手动来回缩放浏览器窗口，让智能体完成 90% 的样式走查脏活。

---

## 7.5 跨界延伸：从 Web 走查到 3D 软件自主操作（Blender 联动）

随着 2026 年具备原生空间几何直觉的模型 **GPT-6 Astra** 上线（并在 BenchCAD 基准中拿下 95.9% 的 CAD 空间重建成绩），Computer Use 的舞台已经不仅限于浏览器和前端页面。

在桌面环境中，开发者甚至可以让智能体自主打开专业 3D 创作软件 **Blender**：
- **视图操作与视口检查**：智能体通过 Computer Use 自动将 Blender 视口切换至 Shading 材质预览模式或 Rendered 渲染模式；
- **排查模型着色与破损**：智能体直接对 3D 视口进行截图比对，检查材质反射是否合理、法线是否翻转；
- **空间联动工作流**：配合 Ch.13 中详述的 **Tripo3D + Blender + Astra** 3D 自动化管线，实现从提示词生成几何体到桌面级 DCC 软件渲染验证的全自动化。

---

## 🛡️ 翻车自救与避坑速查表

| 常见踩坑现象 | 致命原因 | 极速自救指南 |
| :--- | :--- | :--- |
| `Computer Use is not supported on this platform` | 当前系统非 macOS 或位于未开放区域 | 确认使用 macOS 客户端，或改用 Headless Puppeteer 纯脚本方案作为替代 |
| `Failed to capture window: Permission denied` | macOS 屏幕录制权限未正确勾选或需要刷新 | 打开系统设置，重新开关一次 ChatGPT 的「屏幕录制」权限并彻底重启客户端 |
| **AI 鼠标在屏幕上乱点，点不到目标按钮** | 浏览器缩放比例不是 100% 或多屏幕 DPI 换算异常 | 将 Chrome 缩放比例重置为标准 100%，并将待测窗口放置于主显示器正中 |

---

[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.06) ](./ch06_reasoning_steer.md) | [ ➡️ 下一章 (Ch.08) ](./ch08_mobile_workflow.md) | [ 🌐 English ](../en/ch07_desktop_computer_use.md)
