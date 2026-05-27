[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.10) ](./ch10_saas_mvp.md) | [ ➡️ 下一章 (Ch.12) ](./ch12_commercialization.md) | [ 🌐 English ](../en/ch11_expo_mobile.md)

# Ch.11 触角延伸：Expo 跨端原生 App 开发与云端打包

做完网页版 SaaS 后，很多独立开发者希望能将触角延伸到移动端。但在传统的移动端开发（React Native / Flutter）中，最耗费时间的往往是复杂的本地开发环境配置：iOS 证书管理、Android Gradle 报错、Cocoapods 冲突，这些环境地狱常常让人望而却步。



我坚信 **“云端开发与打包（EAS）是独立开发者做原生 App 的唯一解”**。结合 Codex 的智能编译报错排查，你可以完全跳过本地 Xcode/Android Studio 的繁琐配置，直接打包出可以上架的原生 App。



本章教你如何让 Codex 自主搞定这一切。

---

## 11.1 Expo 项目极速初始化与模拟器映射



为了能使用 EAS（Expo Application Services）进行云端免配置打包，我们首先初始化一个标准的 Expo 项目。

### 1. 编写 App 初始化 Specs

给 Codex 下达 Specs 指令，生成标准的 Expo TS 项目：

```Markdown
# 🎯 Goal
初始化一个使用 TypeScript 的 React Native Expo 项目。

# 🛑 Constraints
- 使用最新稳定的 Expo SDK（当前为 SDK 56），随之搭配最新版 Expo Router 实现基于文件系统的路由。
- 引入 NativeWind 作为 Tailwind 风格的样式方案。
- 目录约定使用 src/ 前缀（即 src/app/ 作为路由根）。

# 🧪 Validation Specs
- 运行 `npx expo lint` 无错误。
- 运行 `npx expo-doctor` 检查依赖版本对齐。
```

Codex 会自动拉取最新的 Expo 模板并生成基础目录结构：

```Plain Text
+-- src/
|   +-- app/
|   |   +-- index.tsx         # APP 首页
|   |   +-- _layout.tsx       # 全局路由导航布局
|   +-- components/
|   +-- hooks/
+-- app.json                  # Expo 核心配置文件
+-- package.json
```

---

## 11.2 解决移动端顽疾：原生依赖冲突

React Native 开发最怕升级或引入带 Native 模块的第三方库（例如相机、文件系统访问）。这常常导致 iOS Podfile 或 Android build.gradle 报错崩溃。



在 Vibe Coding 模式下，当 Codex 执行自动化依赖安装时，如果遇到此类原生报错，我们应引导它采用下述排查策略。



### 实战：如何让 Codex 自主排查 Podfile 报错

如果 Codex 在沙盒中编译 iOS 原生模块失败，它会在推理摘要中产生类似提示：

`\[Error\] \[Cocoapods\] Auto\-linking failed for react\-native\-reanimated\.`



此时**直接在 TUI 中继续输入纠偏指令**（无需任何特殊子命令，详见 Ch.06）：

```Bash
请改用 `npx expo install react-native-reanimated` 重新安装该依赖，它会自动适配当前的 Expo SDK 版本。在本项目中，禁止使用普通的 `npm install` 安装任何带原生代码的第三方包。请把这条规则补充到 AGENTS.md。
```



> 💡 **主理人心法**：Expo SDK 最强的地方就在于其自带的版本对齐机制（`npx expo install`）。任何时候只要原生包报错，逼着 Codex 使用 expo 内置指令覆盖安装，90% 的版本冲突都会被自动抹平。
> 
> 

---

## 11.3 EAS Build 云端打包与证书自动化

在传统的 App 打包流程中，申请苹果开发者证书、生成 Provisioning Profile 往往会卡住新手几天。现在，通过 EAS，我们只需要给 Codex 提供开发者账号，让其在云端全自动解决。

### 1. 配置 `eas\.json` (EAS 云端打包配置文件)

让 Codex 生成生产与测试的云端打包环境配置：

`eas\.json` 配置文件：

```JSON
{
  "cli": {
    "version": ">= 9.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "ios": {
        "simulator": false
      }
    }
  }
}
```

### 2. 让 Codex 监考云端构建日志

在本地终端触发 EAS 构建任务，并把日志保留下来供 Codex 分析：

```Bash
# 启动 EAS iOS 打包任务，把日志写到本地文件
eas build --platform ios --profile production --non-interactive 2>&1 | tee eas-build.log
```

构建结束（或失败）后，直接把日志喂给 Codex：

```Bash
# 把构建日志交给 Codex 做诊断
codex exec "分析 eas-build.log，定位失败原因，并给出修复方案。如果是 Provisioning Profile 不匹配或证书失效，告诉我具体要运行哪些 eas credentials 命令。"
```

> ⚠️ **澄清边界**：Codex **不会自动登录你的 Apple Developer 后台帮你重发证书**——证书签发与轮换是 EAS（通过 `eas credentials`）和 Apple 之间的事。Codex 能做的是：读懂 EAS 的报错日志、识别证书过期 / Provisioning Profile 不匹配等典型问题、指引你运行正确的修复命令、自动生成补丁脚本。

最终 EAS 会返回一个安装二维码，你只需用手机扫码即可直接安装测试版 App。

**原生开发不再需要笨重的 IDE。用 Expo + EAS 让打包上云，让 Codex 成为你移动开发的副驾驶。**

---

[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.10) ](./ch10_saas_mvp.md) | [ ➡️ 下一章 (Ch.12) ](./ch12_commercialization.md) | [ 🌐 English ](../en/ch11_expo_mobile.md)
