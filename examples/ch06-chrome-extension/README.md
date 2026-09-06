# 🧩 Codex Web Copilot (Chrome 扩展沙盒样例)

这是《Codex 蓝皮书》配套的官方开源实战样例之一。

它展示了如何使用 Codex 遵循 **CAP 协作规范** 与 **Anti-Loop 安全护栏**，从零开发一个基于 Manifest V3 的轻量浏览器智能伴侣扩展。

---

## ⚡ 1 分钟开箱体验

本工程不依赖任何臃肿的打包工具（Webpack/Vite/Rollup），纯原生编写，零构建黑盒。

1. 打开 Google Chrome 或基于 Chromium 的浏览器（Edge / Arc / Brave）。
2. 在地址栏输入并打开：`chrome://extensions/`。
3. 开启右上角的 **「开发者模式」 (Developer mode)**。
4. 点击左上角的 **「加载已解压的扩展程序」 (Load unpacked)**。
5. 选择当前工程目录：`examples/ch06-chrome-extension`。
6. 点击浏览器工具栏的拼图图标，将 **Codex Web Copilot** 固定到工具栏。
7. 在任意常规网页中点击图标即可体验划词提炼与 Markdown 引用复制！

---

## 🏗️ 架构与技术要点

| 文件 | 角色 | 关键规约 |
| :--- | :--- | :--- |
| `manifest.json` | 扩展清单 | 严格遵循 Manifest V3，仅申请必要权限 (`activeTab`, `storage`, `contextMenus`) |
| `popup.html` / `popup.js` | 弹出面板 | 严格符合 CSP 策略，杜绝内联脚本与 `eval()` |
| `content.js` | 页面内容脚本 | 负责与宿主网页 DOM 交互，提供划词选区与结构化摘要提取 |
| `service-worker.js` | 后台服务 | 短暂生命周期，状态持久化写入 `chrome.storage.local`，提供右键划词菜单 |
| `AGENTS.md` | 协作协议规约 | 声明项目指纹、MV3 CSP 禁令、防死锁机制与验证规范 |

---

## 🧪 自动化测试验证

在本项目根目录下运行：

```bash
npm test
```

将全自动执行：
- `manifest.json` V3 结构与属性检查；
- `popup.html` CSP 严格性检查（确保零内联 `<script>`）；
- 所有脚本的 Node.js 严格语法检测 (`node --check`)。
