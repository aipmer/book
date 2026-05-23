[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.06) ](./ch06_reasoning_steer.md) | [ ➡️ Next (Ch.08) ](./ch08_mobile_workflow.md) | [ 🌐 中文版 ](../chapters/ch07_desktop_computer_use.md)

# Ch.07 Closing the Visual Loop: Automated Auditing and Design Verification with Desktop Computer Use

In traditional UI fidelity reviews, the most time-consuming task for product managers and front-end developers is "pixel-eye" alignment verification:
“This button seems shifted 4 pixels to the left.”
“This modal breaks and covers key text on iPad dimensions.”

In the OpenAI Codex ecosystem, using **Computer Use** capabilities, the agent can not only write code but also "use eyes and hands" to directly operate your macOS/Windows desktop, launch a browser, interact with DevTools, and run visual audits.

This chapter teaches you how to configure and utilize Codex Desktop for automated UI visual verification.

---

## 7.1 Safety First: Sandbox Boundaries and Operation Bounding Boxes

Allowing an AI to operate your screen poses security risks. To prevent Codex from accidentally clicking your messaging apps or deleting system files due to misinterpretations, you must configure a **bounding box** restriction.

### 1. Defining Boundaries in Configuration
In the project root configuration, restrict Codex to access only a designated virtual display or window region:

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

### 2. Coordinate Targeting Mechanism
Codex operates your computer in a closed loop: "screenshot -> OCR/visual analysis -> return target x, y coordinates -> execute click/drag."

```text
[Screenshot] ──> [Vision Model Analysis] ──> [Fetch Element Coordinates (x:450, y:230)] ──> [Click/Drag]
```

---

## 7.2 Visual-Driven UI Review in Practice: Figma Mockup Alignment

This is a classic and highly practical "Real-World Product Talk" workflow: **let Codex autonomously compare a Figma mockup screenshot with the rendered page in the browser, and automatically modify CSS to restore the design.**

### 🎯 Goal
Instruct Codex to compare the local webpage `/auth/login` with the designer's mockup `figma_login_mockup.png`, and automatically adjust the margins and font sizes of the login card on the page.

### 🛑 Constraints
- Only style adjustments through modifying the Tailwind classes in `src/app/login/page.tsx` are allowed.
- Modifying the DOM structure is prohibited.

### 🧪 Execution and Validation Specs

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

## 7.3 Codex Automated Auditing Console Logs

When you run this task, Codex's Computer Use module generates logs similar to the following:

```bash
$ codex run-task compare-ui.task
[Task Started] Running visual review for /auth/login
[Step 1] Opening Google Chrome on http://localhost:3000/auth/login...
[Step 2] Taking screenshot. Saved to /tmp/screenshot_v1.png
[Step 3] Calling Vision Model (GPT-4o/o3) for image comparison.
    - Analysis: "Login card header text 'Welcome Back' font size is too small (approx 16px), should be 24px (text-2xl) based on figma mockup. Card padding-top is insufficient."
[Step 4] Modifying src/app/login/page.tsx:
    - Target: Replace `className="text-base pt-4"` with `className="text-2xl pt-8"`
[Step 5] Refreshing Chrome...
[Step 6] Taking validation screenshot. Saved to /tmp/screenshot_v2.png
[Step 7] Vision model checks: "Layout matches mockup. Visual diff is within 1.5% tolerance."
[Task Completed Successfully]
```

---

## 7.4 Best Practice: Responsive Multi-Device Inspection

Beyond single-resolution comparisons, you can command Codex to resize viewports for breakpoint audits:

```markdown
# 📱 Mobile Viewport Inspection
1. Open DevTools in Chrome.
2. Simulate mobile viewport (iPhone 15 Pro: 393 x 852).
3. Verify that the login card does not overflow horizontally.
4. If the submit button falls below the screen fold, adjust padding-bottom to keep it visible.
```

Through this closed-loop process, solo developers no longer need to resize browsers manually or refresh mobile devices repeatedly after modifying CSS. Codex can handle 90% of page alignment adjustments and cross-device compatibility testing, freeing up your visual energy.

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.06) ](./ch06_reasoning_steer.md) | [ ➡️ Next (Ch.08) ](./ch08_mobile_workflow.md) | [ 🌐 中文版 ](../chapters/ch07_desktop_computer_use.md)
