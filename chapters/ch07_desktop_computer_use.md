[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.06) ](./ch06_reasoning_steer.md) | [ ➡️ 下一章 (Ch.08) ](./ch08_mobile_workflow.md) | [ 🌐 English ](../en/ch07_desktop_computer_use.md)

# Ch.07 视觉闭环：Desktop Computer Use 自动巡检与设计还原

在传统的 UI 还原度走查中，最耗费产品经理和前端时间的是“像素眼”校对：
“这个按钮好像往左偏了 4 像素。”
“这个弹窗在 iPad 尺寸下会变形遮挡。”

在 OpenAI Codex 生态中，通过 **Computer Use (计算机操作能力)**，智能体不仅能编写代码，还能“动用眼和手”直接操作你的 macOS/Windows 桌面，打开浏览器、操作开发者工具，进行视觉效果校对。

本章教你如何配置并操纵 Codex Desktop 进行 UI 的自动化视觉还原。

---

## 7.1 安全第一：沙盒边界与屏幕操作框限制

让 AI 操作你的屏幕是一件具有安全风险的事情。为了防止 Codex 因为误判乱点你的本地微信或删除系统文件，你必须设置**屏幕操作边界 (Bounding Box)**。

### 1. 配置文件定义边界
在项目根目录的配置中，限制 Codex 仅能访问特定虚拟屏幕或窗口区域：

```json
{
  "computer_use": {
    "allowed_applications": ["Google Chrome", "Simulator"],
    "viewport_restriction": {
      "width": 1280,
      "height": 800,
      "allow_system_settings": false
    }
  }
}
```

### 2. 坐标定位机制解析
Codex 主要是通过“截屏 -> OCR/视觉分析 -> 返回目标 x, y 坐标 -> 执行点击”的闭环在操作你的电脑。

```text
[屏幕截图 (Screenshot)] ──> [视觉模型识别] ──> [获取元素像素坐标 (x:450, y:230)] ──> [点击/拖拽]
```

---

## 7.2 视觉驱动的 UI 走查实战：Figma 还原对比

这是一个非常典型且实用的“实战产品说”工作流：**让 Codex 自主对比 Figma 设计图截图与浏览器渲染出的页面，并自动修改 CSS 进行还原。**

### 🎯 目标 (Goal)
让 Codex 对比本地网页 `/auth/login` 与设计师给的 `figma_login_mockup.png`，自动调平页面中登录卡片的边距和字体大小。

### 🛑 约束 (Constraints)
- 只能通过修改 `src/app/login/page.tsx` 的 Tailwind Class 来修正样式。
- 禁止修改 DOM 结构。

### 🧪 验证与自动化执行 Specs

```markdown
# 🎯 Goal
Compare and align browser rendering with figma_login_mockup.png.

# 🛑 Constraints
- Only use Tailwind utility classes in src/app/login/page.tsx.

# 🚀 Codex Execution Steps
1. Launch Google Chrome in headless or bounded window mode.
2. Navigate to http://localhost:3000/auth/login.
3. Take a screenshot of the login card region.
4. Perform pixel-diff and layout alignment checks against /assets/figma_login_mockup.png.
5. Identify spacing discrepancy (Figma shows 32px padding-top, current implementation has 16px).
6. Edit CSS, reload and verify.
```

---

## 7.3 Codex 自动走查控制台日志实录

当你执行上述任务时，Codex 的 Computer Use 模块会产生如下日志：

```bash
$ codex run-task compare-ui.task
[Task Started] Running visual review for /auth/login
[Step 1] Opening Google Chrome on http://localhost:3000/auth/login...
[Step 2] Taking screenshot. Saved to /tmp/screenshot_v1.png
[Step 3] Calling Vision Model (GPT-4o/GPT-5.5) for image comparison.
    - Analysis: "Login card header text 'Welcome Back' font size is too small (approx 16px), should be 24px (text-2xl) based on figma mockup. Card padding-top is insufficient."
[Step 4] Modifying src/app/login/page.tsx:
    - Target: Replace `className="text-base pt-4"` with `className="text-2xl pt-8"`
[Step 5] Refreshing Chrome...
[Step 6] Taking validation screenshot. Saved to /tmp/screenshot_v2.png
[Step 7] Vision model checks: "Layout matches mockup. Visual diff is within 1.5% tolerance."
[Task Completed Successfully]
```

---

## 7.4 最佳实践：响应式多终端巡检

除了单一尺寸的对比，你还可以让 Codex 快速切分屏幕尺寸进行“断点走查”：

```markdown
# 📱 Mobile Viewport Inspection
1. Open DevTools in Chrome.
2. Simulate mobile viewport (iPhone 15 Pro: 393 x 852).
3. Verify that the login card does not overflow horizontally.
4. If the submit button falls below the screen fold, adjust padding-bottom to keep it visible.
```

通过这一闭环，独立开发者再也不用在修改 CSS 后，手动缩放浏览器、拿手机真机反复刷新了。Codex 能够自主完成 90% 的页面微调和跨端兼容测试，释放你的全部视觉精力。

---

[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.06) ](./ch06_reasoning_steer.md) | [ ➡️ 下一章 (Ch.08) ](./ch08_mobile_workflow.md) | [ 🌐 English ](../en/ch07_desktop_computer_use.md)
