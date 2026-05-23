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

## 🎨 Styles & Architecture Patterns
- **目录分配规范**：
  - **基于文件的路由**：全量采用 Expo Router，页面逻辑和路由配置结构固定放置于 `app/` 目录下。
  - **组件拆分**：通用无状态 UI 组件存放在 `components/` 目录下。
  - **状态管理**：复杂的全局状态推荐使用 `Zustand`，且持久化存储必须使用加密的系统安全存储（如 `expo-secure-store`）。
- **编码与平台兼容规范**：
  - 在涉及设备底层能力（如相机、通知、定位）时，智能体编写的代码**必须在执行前判断平台权限状态**（通过 `requestPermissionAsync`），并合理处理用户拒绝授权的降级 UI 场景。
  - 涉及到平台差异化的 UI，必须使用 `Platform.OS === 'ios'` 进行适配，或采用 `.ios.tsx` / `.android.tsx` 物理后缀文件进行解耦。

## 🛑 Agent Boundary & Hard Rules (安全红线)
- **只读核心配置文件**：
  - 严禁擅自修改 `app.json` (或 `app.config.js`) 中的 App 包名（Bundle Identifier / Package Name）以及版本号（Version / Build Number）。
  - 严禁在无人工授权情况下改动 `eas.json` 中的构建配置文件。
- **依赖安装红线**：
  - 当智能体安装任何第三方包导致 `CocoaPods` 或 `Android Gradle` 原生构建报错时，必须立即回滚代码，并强制通过 `npx expo install` 指令重新覆盖安装，以保证与当前 Expo SDK 版本号完全对齐。
- **密钥安全**：
  - 严禁将 Expo 发布凭证、iOS 开发证书私钥或安卓签名密钥文件（`.keystore`）提交到代码仓库。
