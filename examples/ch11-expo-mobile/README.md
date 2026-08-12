# Ch.11 配套实战工程 — Expo 跨端原生 App

> 《Codex 蓝皮书》Ch.11「触角延伸：Expo 跨端原生 App 开发与云端打包」的完整可运行源码。

基于 **Expo SDK 57 + Expo Router（`src/app` 文件路由）+ NativeWind（Tailwind 风格样式）+ TypeScript**，配套 **EAS 云端打包**配置，跳过本地 Xcode/Android Studio 环境地狱。

## 技术栈与章节映射

| 章节 | 落地点 |
| --- | --- |
| §11.1 初始化与目录约定 | Expo Router + `src/app/` 路由根 + NativeWind（本工程即 Specs 的产物） |
| §11.2 原生依赖冲突排查 | `AGENTS.md` 红线：原生包一律 `npx expo install`；`expo-doctor` 版本对齐 |
| §11.3 EAS 云端打包 | [eas.json](./eas.json)（development / preview / production 三档 profile） |

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（扫码用 Expo Go 预览，或按 w 开 Web）
npm start

# 3. 章节验证 Specs
npx expo lint        # ✅ 已验证：零错误
npx expo-doctor      # ✅ 已验证：20/20 checks passed
```

## EAS 云端打包（Ch.11 §11.3）

```bash
# 安装并登录 EAS CLI
npm install -g eas-cli
eas login

# 触发 iOS 生产构建，日志落盘供 Codex 诊断
eas build --platform ios --profile production --non-interactive 2>&1 | tee eas-build.log

# 构建失败时，把日志喂给 Codex
codex exec "分析 eas-build.log，定位失败原因，并给出修复方案。如果是 Provisioning Profile 不匹配或证书失效，告诉我具体要运行哪些 eas credentials 命令。"
```

## NativeWind 演示

首页（`src/app/index.tsx`）底部的蓝色横幅完全由 Tailwind `className` 渲染，无任何 `StyleSheet` 代码：

```tsx
<View className="self-stretch rounded-2xl bg-sky-500/10 border border-sky-500/40 px-4 py-3">
  <Text className="text-sky-600 dark:text-sky-300 text-sm font-semibold text-center">
    NativeWind 已就绪
  </Text>
</View>
```

## 智能体协作

本工程自带 [AGENTS.md](./AGENTS.md)（CAP 协议），在本目录启动 `codex` 即可体验书中的移动端编排工作流。
