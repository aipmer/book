[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.06) ](./ch06_reasoning_steer.md) | [ ➡️ Next (Ch.08) ](./ch08_mobile_workflow.md)

# Ch.07 Closing the Visual Loop: Automated Auditing and Design Verification with Desktop Computer Use

With **Computer Use**, Codex can view your screen, open Chrome, inspect DevTools, and adjust CSS alignment directly.

---

## 7.1 Safety Bounds & Coordinate Targeting
Restrict screen control to virtual displays or specific apps:

```json
{
  "computer_use": {
    "allowed_applications": ["Google Chrome"],
    "viewport_restriction": { "width": 1280, "height": 800 }
  }
}
```
The agent captures the viewport, runs layout analyses, and targets elements by pixel coordinates (x, y).

---

## 7.2 Visual QA: Figma Mockup Verification

Let's instruct Codex to align our local login page with a design export.

```markdown
# 🎯 Goal
Align local /auth/login layout with figma_login_mockup.png.

# 🚀 Codex Steps
1. Launch Google Chrome on http://localhost:3000/auth/login.
2. Capture screenshot of the render area.
3. Compare layout dimensions with the Figma mockup.
4. Correct CSS discrepancies (e.g. increase top padding from 16px to 32px).
```
The agent modifies the Tailwind classes in `page.tsx`, reloads Chrome, and verifies layout correctness.

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.06) ](./ch06_reasoning_steer.md) | [ ➡️ Next (Ch.08) ](./ch08_mobile_workflow.md)
