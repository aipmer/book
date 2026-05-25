# 🤖 React Native (Expo) App 专属智能体协作规约 (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: React Native, Expo SDK 51+, Expo Router, TypeScript.
- **Styling**: NativeWind (Tailwind CSS for React Native).
- **Build Tooling**: EAS CLI (Expo Application Services).

## 💻 Developer Commands
- **Install JS Dependencies**: `npm install`
- **Install Native SDK dependencies**: `npx expo install <package-name>` (严禁使用 npm install 直接安装带原生 CocoaPods / Android Gradle 依赖的包)
- **Start Metro Bundler**: `npx expo start`
- **Start iOS Simulator**: `npx expo start --ios`
- **Start Android Emulator**: `npx expo start --android`
- **Lint Code**: `npm run lint`
- **EAS Local Build**: `eas build --local`
- **EAS Cloud Build**: `eas build --platform all --non-interactive`
- **Kill Stale Metro**: `lsof -ti :8081 | xargs kill -9` (清除残留 Metro 进程)

## 🎨 Styles & Architecture Patterns
- **目录分配规范**：
  - **基于文件的路由**：全量采用 Expo Router，页面逻辑和路由配置结构固定放置于 `app/` 目录下。
  - **组件拆分**：通用无状态 UI 组件存放在 `components/` 目录下。
  - **状态管理**：复杂的全局状态推荐使用 `Zustand`，且持久化存储必须使用加密的系统安全存储（如 `expo-secure-store`）。
- **编码与平台兼容规范**：
  - 在涉及设备底层能力（如相机、通知、定位）时，智能体编写的代码**必须在执行前判断平台权限状态**（通过 `requestPermissionAsync`），并合理处理用户拒绝授权的降级 UI 场景。
  - 涉及到平台差异化的 UI，必须使用 `Platform.OS === 'ios'` 进行适配，或采用 `.ios.tsx` / `.android.tsx` 物理后缀文件进行解耦。
- **核心配置文件保护**：
  - `eas.json` 和 `app.json`（或 `app.config.js`）属于受保护配置。智能体在任何情况下不得自行修改这两个文件中的构建配置、包名、版本号字段。如需变更，必须生成差异说明并交由人工确认后执行。
  - 修改 `app.json` 中的 `plugins` 数组时，需同步验证对应的 `npx expo install` 是否已安装该插件的原生模块。
- **Metro 端口冲突处理**：
  - 启动 Metro Bundler 前，必须先检查 `8081` 端口占用状态。若端口被占用，执行 `lsof -ti :8081 | xargs kill -9` 清除残留进程后再启动。
  - 禁止修改 Metro 默认端口来绕过冲突。端口冲突的根本原因必须被定位和解决。
- **文件操作 API 规范**：
  - 所有本地文件读写操作必须使用 Expo FileSystem API（`expo-file-system`）。严禁在 React Native 代码中引入 Node.js 原生 `fs` 模块，该模块在移动端运行时不可用。
  - 文件路径必须使用 `FileSystem.documentDirectory` 或 `FileSystem.cacheDirectory` 作为基础路径，禁止硬编码绝对路径。

## 🔄 AI 循环防范 (Anti-Loop Safeguards)
- **依赖安装失败**：
  - `npx expo install` 执行失败时，最多重试 2 次。第一次重试前执行 `npx expo install --fix` 修复版本对齐问题；第二次重试前清除缓存 `npm cache clean --force`。两次均失败则停止，向人工提供完整错误日志和当前 Expo SDK 版本号。
  - 禁止通过降级 Expo SDK 版本来绕过依赖兼容性问题。
- **原生构建错误回滚**：
  - CocoaPods 安装失败（`pod install` 报错）或 Android Gradle Sync 失败时，立即回滚本次安装的包（`git checkout package.json package-lock.json`），然后通过 `npx expo install` 重新安装以保证版本对齐。
  - 禁止手动修改 `Podfile` 或 `build.gradle` 来修复版本冲突。此类问题必须交由人工处理。
- **Metro Bundler 重启循环**：
  - Metro Bundler 连续崩溃超过 2 次时，立即停止重启。执行以下诊断步骤：(1) `lsof -ti :8081 | xargs kill -9` 清除所有残留进程；(2) `npx expo start --clear` 清除缓存启动；(3) 检查是否存在循环依赖（`madge --circular ./app`）。
  - 若诊断后仍无法启动，停止操作并向人工报告 Metro 崩溃日志。

## 🏗️ 沙盒与环境边界 (Sandbox & Environment Boundaries)
- **Metro 端口隔离**：
  - Metro Bundler 固定使用 `8081` 端口。在容器或远程开发环境中，通过端口映射 `-p 8081:8081` 暴露。
  - 多个 Expo 项目同时开发时，禁止修改 Metro 端口。只允许同时运行一个 Metro 实例，切换项目前必须先终止当前实例。
- **连接拒绝排查流程**（最多 3 步）：
  1. 检查 Metro 端口监听状态：`lsof -i :8081`
  2. 检查 Expo 进程是否存活：`ps aux | grep expo`
  3. 检查模拟器/真机网络连通性：iOS 模拟器共享宿主网络，Android 模拟器需通过 `10.0.2.2` 访问宿主机的 `localhost`
  - 3 步内未定位问题，停止排查并附带输出结果交由人工处理。
- **EAS 构建环境边界**：
  - `eas build --local` 在本地执行时，构建产物输出到项目根目录。禁止将构建产物（`.ipa`、`.apk`、`.aab`）提交到 Git 仓库。
  - `eas build` 云端构建时，禁止在构建脚本中访问本地文件系统或本地数据库。所有构建时配置必须通过 EAS Secrets 或 `eas.json` 的 `env` 字段注入。
- **iOS Simulator / Android Emulator 网络规则**：
  - iOS Simulator 与宿主机共享网络栈，可直接通过 `localhost` 访问本地服务。
  - Android Emulator 使用隔离网络，访问宿主机服务必须使用 `10.0.2.2` 替代 `localhost`。在代码中通过 `Platform.OS` 条件判断来动态设置 API Base URL。
- **分支安全**：
  - 禁止在 `main`、`master`、`production` 分支上执行 `git push --force`、`git reset --hard`、或批量删除文件等破坏性命令。

## 🛑 Agent Boundary & Hard Rules (安全红线)
- **只读核心配置文件**：
  - 严禁擅自修改 `app.json`（或 `app.config.js`）中的 App 包名（Bundle Identifier / Package Name）以及版本号（Version / Build Number）。
  - 严禁在无人工授权情况下改动 `eas.json` 中的构建配置文件。
- **依赖安装红线**：
  - 当智能体安装任何第三方包导致 `CocoaPods` 或 `Android Gradle` 原生构建报错时，必须立即回滚代码，并强制通过 `npx expo install` 指令重新覆盖安装，以保证与当前 Expo SDK 版本号完全对齐。
- **密钥安全**：
  - 严禁将 Expo 发布凭证、iOS 开发证书私钥或安卓签名密钥文件（`.keystore`）提交到代码仓库。
- **EAS/App 配置保护强制**：
  - 智能体对 `eas.json` 和 `app.json` 的任何写入操作，必须先生成变更差异（diff），由人工审批后方可执行。未经审批的写入操作视为违规，必须立即撤销。
- **Metro 端口管理强制**：
  - 启动 Metro 前必须执行端口检查。若发现残留进程，必须先清除再启动。禁止同时运行多个 Metro 实例。
- **Expo FileSystem 强制**：
  - 代码评审阶段，若发现 `import fs from 'fs'`、`require('fs')`、或 `import * as fs from 'node:fs'` 等 Node.js 原生文件系统引用，必须阻断提交并要求替换为 `expo-file-system` API。
  - 此规则适用于所有 `app/`、`components/`、`hooks/`、`utils/` 目录下的 TypeScript/JavaScript 文件。

---

## 🌐 English Version

# 🤖 React Native (Expo) Agent Collaboration Protocol (AGENTS.md)

## 📌 Project Signature
- **Tech Stack**: React Native, Expo SDK 51+, Expo Router, TypeScript.
- **Styling**: NativeWind (Tailwind CSS for React Native).
- **Build Tooling**: EAS CLI (Expo Application Services).

## 💻 Developer Commands
- **Install JS Dependencies**: `npm install`
- **Install Native SDK dependencies**: `npx expo install <package-name>` (Never use npm install to add packages with native CocoaPods / Android Gradle dependencies directly)
- **Start Metro Bundler**: `npx expo start`
- **Start iOS Simulator**: `npx expo start --ios`
- **Start Android Emulator**: `npx expo start --android`
- **Lint Code**: `npm run lint`
- **EAS Local Build**: `eas build --local`
- **EAS Cloud Build**: `eas build --platform all --non-interactive`
- **Kill Stale Metro**: `lsof -ti :8081 | xargs kill -9` (clear lingering Metro processes)

## 🎨 Styles & Architecture Patterns
- **Directory Structure Conventions**:
  - **File-based Routing**: Centralized under Expo Router rules. Views and routes must reside in the `app/` folder.
  - **Component Extraction**: Stateless UI or helper components go under `components/`.
  - **State Management**: Zustand is recommended for global states. Confidential client-side storage must leverage secure hardware encryption (such as `expo-secure-store`).
- **Cross-Platform Compatibility**:
  - Before utilizing native hardware APIs (e.g. camera, location, notifications), the agent **must check permissions first** (via `requestPermissionAsync`) and handle gracefully when permissions are rejected.
  - Target UI discrepancies by asserting `Platform.OS === 'ios'` or isolate complex discrepancies by writing decoupled `.ios.tsx` and `.android.tsx` files.
- **Core Config File Protection**:
  - `eas.json` and `app.json` (or `app.config.js`) are protected configuration files. The agent must not modify build configs, bundle identifiers, or version fields in these files under any circumstance. Changes require generating a diff and obtaining human approval before execution.
  - When modifying the `plugins` array in `app.json`, verify that the corresponding native module has been installed via `npx expo install`.
- **Metro Port Conflict Handling**:
  - Before starting Metro Bundler, always check whether port `8081` is occupied. If occupied, run `lsof -ti :8081 | xargs kill -9` to clear stale processes before starting.
  - Do not change Metro's default port to work around conflicts. The root cause of the port conflict must be identified and resolved.
- **File Operations API Standard**:
  - All local file read/write operations must use the Expo FileSystem API (`expo-file-system`). Importing Node.js native `fs` module in React Native code is strictly forbidden as it is unavailable on mobile runtimes.
  - File paths must use `FileSystem.documentDirectory` or `FileSystem.cacheDirectory` as the base path. Hardcoding absolute paths is prohibited.

## 🔄 Anti-Loop Safeguards
- **Dependency Install Failure**:
  - Max 2 retries when `npx expo install` fails. Before the first retry, run `npx expo install --fix` to resolve version alignment. Before the second retry, clear cache with `npm cache clean --force`. If both fail, halt and report the full error log along with the current Expo SDK version to the human.
  - Do not downgrade the Expo SDK version to bypass dependency compatibility issues.
- **Native Build Error Rollback**:
  - When CocoaPods install (`pod install`) or Android Gradle Sync fails, immediately roll back the newly installed package (`git checkout package.json package-lock.json`), then reinstall via `npx expo install` to ensure version alignment.
  - Do not manually edit `Podfile` or `build.gradle` to fix version conflicts. These issues must be escalated to the human.
- **Metro Bundler Restart Loop**:
  - If Metro Bundler crashes more than 2 consecutive times, stop restarting immediately. Run these diagnostics: (1) `lsof -ti :8081 | xargs kill -9` to clear all lingering processes; (2) `npx expo start --clear` to start with a clean cache; (3) check for circular dependencies using `madge --circular ./app`.
  - If Metro still fails after diagnostics, stop all operations and report the crash log to the human.

## 🏗️ Sandbox & Environment Boundaries
- **Metro Port Isolation**:
  - Metro Bundler is fixed to port `8081`. In container or remote development environments, expose via port mapping `-p 8081:8081`.
  - When working on multiple Expo projects simultaneously, do not change the Metro port. Only one Metro instance may run at a time; terminate the current instance before switching projects.
- **Connection Refused Troubleshooting** (max 3 steps):
  1. Check Metro port listening status: `lsof -i :8081`
  2. Check if the Expo process is alive: `ps aux | grep expo`
  3. Check simulator/device network connectivity: iOS Simulator shares host network; Android Emulator must use `10.0.2.2` to reach host `localhost`
  - If the issue is not identified within these 3 steps, stop and hand the outputs to the human.
- **EAS Build Environment Boundaries**:
  - `eas build --local` outputs build artifacts to the project root. Build artifacts (`.ipa`, `.apk`, `.aab`) must never be committed to Git.
  - During `eas build` cloud builds, build scripts must not access the local filesystem or local databases. All build-time configuration must be injected via EAS Secrets or the `env` field in `eas.json`.
- **iOS Simulator / Android Emulator Network Rules**:
  - iOS Simulator shares the host network stack and can access local services via `localhost` directly.
  - Android Emulator uses an isolated network. To reach host services, use `10.0.2.2` instead of `localhost`. Use `Platform.OS` conditionals in code to dynamically set the API Base URL.
- **Branch Safety**:
  - `git push --force`, `git reset --hard`, and bulk file deletions are forbidden on `main`, `master`, and `production` branches.

## 🛑 Agent Boundary & Hard Rules
- **Read-Only / Protected Files**:
  - Do not modify App configuration options like Bundle Identifiers, Package Names, or Build Versions inside `app.json` or `app.config.js`.
  - Do not change build profiles in `eas.json` without explicit approval.
- **Native Dependency Constraints**:
  - If any third-party installation triggers CocoaPods or Android Gradle build issues, immediately roll back. Always install using `npx expo install` to guarantee packages match the target Expo SDK version.
- **Secret & Key Safety**:
  - Never upload Expo deployment credentials, iOS certificates/provisioning profiles, or Android signing key files (`.keystore`) to the code repository.
- **EAS/App Config Protection Enforcement**:
  - Any write operation to `eas.json` or `app.json` by the agent must first produce a change diff for human approval. Unapproved writes are violations and must be reverted immediately.
- **Metro Port Management Enforcement**:
  - A port check is mandatory before starting Metro. If stale processes are found, they must be cleared before launch. Running multiple Metro instances simultaneously is forbidden.
- **Expo FileSystem Enforcement**:
  - During code review, any occurrence of `import fs from 'fs'`, `require('fs')`, or `import * as fs from 'node:fs'` must block the commit and require replacement with the `expo-file-system` API.
  - This rule applies to all TypeScript/JavaScript files under the `app/`, `components/`, `hooks/`, and `utils/` directories.
