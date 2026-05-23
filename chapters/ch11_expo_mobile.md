# Ch.11 触角延伸：Expo 跨端原生 App 开发与云端打包

做完网页版 SaaS 后，很多独立开发者希望能将触角延伸到移动端。但在传统的移动端开发（React Native / Flutter）中，最耗费时间的往往是复杂的本地开发环境配置：iOS 证书管理、Android Gradle 报错、Cocoapods 冲突，这些环境地狱常常让人望而却步。

在“实战产品说”中，我坚信 **“云端开发与打包（EAS）是独立开发者做原生 App 的唯一解”**。结合 Codex 的智能编译报错排查，你可以完全跳过本地 Xcode/Android Studio 的繁琐配置，直接打包出可以上架的原生 App。

本章教你如何让 Codex 自主搞定这一切。

---

## 11.1 Expo 项目极速初始化与模拟器映射

为了能使用 EAS（Expo Application Services）进行云端免配置打包，我们首先需要在沙盒和本地建立连接。

### 1. 编写 App 初始化 Specs
给 Codex 下达 Specs 指令，生成标准的 Expo TS 项目：

```markdown
# 🎯 Goal
初始化一个使用 TypeScript 的 React Native Expo 项目。

# 🛑 Constraints
- 必须使用 Expo Router v3 实现基于文件系统的路由。
- 引入 Tailwind-React-Native 样式库 NativeWind。

# 🧪 Validation Specs
- 运行 `npx expo lint` 无错误。
```

Codex 会自动拉取最新的 Expo 模板并生成基础目录结构：

```
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

## 11.2 解决移动端顽疾：原生依赖冲突 (Native Module Conflicts)

React Native 开发最怕升级或引入带 Native 模块的第三方库（例如相机、文件系统访问）。这常常导致 iOS Podfile 或 Android build.gradle 报错崩溃。

在 Vibe Coding 模式下，当 Codex 执行自动化依赖安装时，如果遇到此类原生报错，我们应引导它采用下述排查策略。

### 实战：如何让 Codex 自主排查 Podfile 报错
如果 Codex 在沙盒中编译 iOS 原生模块失败，它的 CoT 日志会产生类似提示：
`[Error] [Cocoapods] Auto-linking failed for react-native-reanimated.`

此时在命令行使用 `refine` 进行针对性约束：

```bash
codex refine "使用 npx expo install 重新安装该依赖，它会自动适配当前的 Expo SDK 版本，严禁使用普通的 npm install 安装带原生代码的第三方包。"
```

> 💡 **主理人心法**：Expo SDK 最强的地方就在于其自带的版本对齐机制（`npx expo install`）。任何时候只要原生包报错，逼着 Codex 使用 expo 内置指令覆盖安装，90% 的版本冲突都会被自动抹平。

---

## 11.3 EAS Build 云端打包与证书自动化

在传统的 App 打包流程中，申请苹果开发者证书、生成 Provisioning Profile 往往会卡住新手几天。现在，通过 EAS，我们只需要给 Codex 提供开发者账号，让其在云端全自动解决。

### 1. 配置 `eas.json` (EAS 云端打包配置文件)
让 Codex 生成生产与测试的云端打包环境配置：

```json
// File: eas.json
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
在本地终端触发 EAS 构建任务：

```bash
# 启动 EAS iOS 打包任务，并将日志输出给 Codex
eas build --platform ios --profile production --non-interactive | codex watch-eas
```

在云端编译过程中，如果遇到 Provisioning Profile 不匹配或者证书失效，Codex 会在思维链中实时解析云端的错误日志，并通过 SSH/API 重新同步你开发者后台的证书状态进行自我纠错。

最终，它会返回一个二维码，你只需用手机扫码即可直接安装测试版 App。

**原生开发不再需要笨重的 IDE。用 Expo + EAS 让打包上云，让 Codex 成为你移动开发的安全保障。**

---

📖 **下一章**：[Ch.12 终局思考：独立开发者如何打造自动化商业飞轮](file:///Users/hunkwu/Desktop/ai/book/chapters/ch12_commercialization.md)