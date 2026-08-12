# 🤖 Codex Collaboration Protocol (CAP) — Ch.11 Expo Mobile

## 📌 Project Signature
- **Project Name**: Ch.11 配套实战工程 — Expo 跨端原生 App
- **Tech Stack**: Expo SDK 57, React Native 0.86, Expo Router (src/app), NativeWind (Tailwind), TypeScript
- **Directory Rule**: 路由页面在 `src/app/`，组件在 `src/components/`，Hooks 在 `src/hooks/`，主题常量在 `src/constants/`

## 🛑 Hard Constraints
- 安装任何带原生代码的第三方包，**必须使用 `npx expo install`**，严禁裸 `npm install`（版本对齐机制见 Ch.11 §11.2）。
- 路由一律使用 Expo Router 文件系统约定，禁止手工堆叠 react-navigation 配置。
- 样式优先使用 NativeWind `className`；仅复杂动效回退 `StyleSheet.create`。
- 证书与 Provisioning Profile 只通过 `eas credentials` 管理，严禁手工改动 iOS/Android 原生目录。

## 🧪 Validation Specs
- 提交前必须通过 `npx expo lint`（零错误）。
- 依赖变更后必须通过 `npx expo-doctor`（版本对齐检查）。
- 云端打包：`eas build --platform ios --profile production --non-interactive 2>&1 | tee eas-build.log`，失败日志交给 Codex 诊断（Ch.11 §11.3）。
