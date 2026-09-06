# 🤖 Codex 协作规约 (CAP) - Chrome 扩展规范

## 📌 项目指纹
- **项目名称**：Codex Web Copilot
- **架构规范**：Chrome Extension Manifest V3 (MV3)
- **技术栈**：Vanilla JavaScript / Native Web APIs / Chrome Extensions API
- **核心目标**：提供轻量、安全、零编译黑盒的浏览器伴侣插件沙盒样例。

---

## 🛑 安全红线与 Anti-Loop 护栏

1. **严格遵循 MV3 内容安全策略 (CSP)**：
   - 严禁使用 `eval()`、`new Function()` 或外部远程代码（Remote Code）。
   - 严禁在 HTML 中编写内联脚本（Inline `<script>`），所有交互逻辑必须抽离为独立 `.js` 文件。
2. **最小权限原则 (Least Privilege)**：
   - 严禁申请全站 Host 权限（`<all_urls>` 仅用于必要的内容读取，默认优先使用 `activeTab`）。
   - 不得申请高危权限（如 `cookies`、`webRequestBlocking`），保障用户隐私安全。
3. **防止 Service Worker 内存泄漏**：
   - Background 脚本在 MV3 中为无状态 Service Worker，随时可能休眠。
   - 严禁在全局变量中保存业务状态，必须通过 `chrome.storage.local` 进行状态持久化。
4. **消息通信防死锁机制**：
   - 在 `chrome.runtime.onMessage` 异步回复时，必须显式返回 `return true;`，否则将导致通信管道提前关闭。

---

## 🧪 验证标准 (Validation Specs)

在每次使用 Codex 进行功能迭代后，必须执行以下验证：
1. **Manifest 校验**：`node -e 'JSON.parse(require("fs").readFileSync("manifest.json"))'` 返回合法 JSON。
2. **语法检查**：所有 JS 文件通过 `node --check` 语法检查。
3. **加载验证**：Chrome 开发者模式下无红字错误与 Warning。
