[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.06) ](./ch06_reasoning_steer.md) | [ ➡️ 下一章 (Ch.08) ](./ch08_mobile_workflow.md) | [ 🌐 English ](../en/ch07_desktop_computer_use.md)

# Ch.07 视觉闭环：Desktop Computer Use 自动巡检与设计还原

在传统的 UI 还原度走查中，最耗费产品经理和前端时间的是“像素眼”校对：

“这个按钮好像往左偏了 4 像素。”

“这个弹窗在 iPad 尺寸下会变形遮挡。”



在 OpenAI Codex 生态中，通过 **Computer Use (计算机操作能力)**，智能体不仅能编写代码，还能“动用眼和手”直接操作你的 macOS桌面，打开浏览器、操作开发者工具，进行视觉效果校对。



本章教你如何配置并操纵 Codex Desktop 进行 UI 的自动化视觉还原。



---

## 7.1 安全第一：沙盒边界与屏幕操作框限制

让 AI 操作你的屏幕是一件具有安全风险的事情。为了防止 Codex 因为误判乱点你的本地微信或删除系统文件，必须设置**应用层面的访问白名单。**

### 1. 通过 GUI 设定应用边界（重要）

Codex 的 Computer Use 边界**不是通过 JSON 配置文件**控制的，而是通过 Codex App 内的 GUI：

- 首次使用 Computer Use 操作某个 App（如 Google Chrome）时，Codex 会弹窗请求授权；

- 在弹窗中可以选择 **“Just this once”**（仅本次） 或 **“Always allow”**（每次都允许）；

- 已授权列表可以在 **「Codex Settings → Computer Use → Allowed Apps」** 中随时撤销。

> 💡 **建议**：UI 走查任务中，把白名单收紧到只勾选 **Google Chrome**、**iOS Simulator** 等开发相关 App，避免 Codex 跑去操作你的微信、邮件等隐私应用。

### 2. 坐标定位机制解析

Codex 主要是通过“截屏 -> OCR/视觉分析 -> 返回目标 x, y 坐标 -> 执行点击”的闭环在操作你的电脑。

```Plain Text
[屏幕截图 (Screenshot)] ──> [视觉模型识别] ──> [获取元素像素坐标 (x:450, y:230)] ──> [点击/拖拽]
```

由于截屏和点击是**真实的系统级操作**，所以 Codex 无法操作终端、Codex 自身或系统级管理员授权弹窗——这是出厂硬限制。

---

## 7.2 视觉驱动的 UI 走查实战：Figma 还原对比

这是一个非常典型且实用的工作流：**让 Codex 自主对比 Figma 设计图截图与浏览器渲染出的页面，并自动修改 CSS 进行还原。**

### 🎯 目标 (Goal)

让 Codex 对比本地网页 `/auth/login` 与设计师给的 `figma\_login\_mockup\.png`，自动调平页面中登录卡片的边距和字体大小。

### 🛑 约束 (Constraints)

- 只能通过修改 `src/app/login/page\.tsx` 的 Tailwind Class 来修正样式。

- 禁止修改 DOM 结构。

### 🧪 验证与自动化执行 Specs

把以下 Specs 直接粘贴到 Codex TUI 中作为 prompt，并在 prompt 里 `@Computer` 或 `@Chrome` 唤起 Computer Use：

```Markdown
@Chrome 请按以下步骤完成 UI 还原走查：

# 🎯 Goal
Compare and align browser rendering with figma_login_mockup.png.

# 🛑 Constraints
- Only use Tailwind utility classes in src/app/login/page.tsx.
- Do not change the DOM structure.

# 🚀 Execution Steps
1. Open Google Chrome and navigate to http://localhost:3000/auth/login.
2. Take a screenshot of the login card region.
3. Compare against /assets/figma_login_mockup.png and report layout differences.
4. Identify spacing discrepancy (Figma shows 32px padding-top, current implementation has 16px).
5. Edit Tailwind classes in src/app/login/page.tsx, reload and verify.
```

> 💡 **进阶用法**：Codex 最近新增的 **Appshots** 功能（双击 Command 键），可以一键把前台窗口的截图 + 文本上下文发送给 Codex 线程，省去手动截图粘贴的步骤。

---

## 7.3 Codex 自动走查的概念流程（示意）

当你执行上述任务时，Codex 的 Computer Use 模块会在 TUI 中展示类似下方的执行流程（**以下为概念示意，非真实日志格式**，实际你看到的是 Codex 的推理摘要 + 工具调用记录）：

```Bash
> Running visual review for /auth/login
> Step 1: Opening Google Chrome on http://localhost:3000/auth/login...
> Step 2: Taking screenshot. Saved to /tmp/screenshot_v1.png
> Step 3: Calling vision model for image comparison.
    Analysis: "Login card header text 'Welcome Back' font size is too small (approx 16px),
               should be 24px (text-2xl) based on figma mockup. Card padding-top is insufficient."
> Step 4: Modifying src/app/login/page.tsx:
    Target: Replace `className="text-base pt-4"` with `className="text-2xl pt-8"`
> Step 5: Refreshing Chrome...
> Step 6: Taking validation screenshot. Saved to /tmp/screenshot_v2.png
> Step 7: Vision check: "Layout matches mockup. Visual diff is within 1.5% tolerance."
> Task completed successfully.
```

---

## 7.4 最佳实践：响应式多终端巡检

除了单一尺寸的对比，你还可以让 Codex 快速切分屏幕尺寸进行“断点走查”：

```Markdown
@Chrome
# 📱 Mobile Viewport Inspection
1. Open DevTools in Chrome.
2. Simulate mobile viewport (iPhone 15 Pro: 393 x 852).
3. Verify that the login card does not overflow horizontally.
4. If the submit button falls below the screen fold, adjust padding-bottom to keep it visible.
```

通过这一闭环，独立开发者再也不用在修改 CSS 后，手动缩放浏览器、拿手机真机反复刷新了。Codex 能够自主完成 90% 的页面微调和跨端兼容测试，释放你的全部视觉精力。

---

[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.06) ](./ch06_reasoning_steer.md) | [ ➡️ 下一章 (Ch.08) ](./ch08_mobile_workflow.md) | [ 🌐 English ](../en/ch07_desktop_computer_use.md)
