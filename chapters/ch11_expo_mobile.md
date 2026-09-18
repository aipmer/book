[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.10) ](./ch10_saas_mvp.md) | [ ➡️ 下一章 (Ch.12) ](./ch12_commercialization.md) | [ 🌐 English ](../en/ch11_expo_mobile.md)

# Ch.11 触角延伸：Expo 跨端原生 App 开发与云端打包

> 🎯 **具体工程麻烦**：做完 Web 想做 App，但 Xcode 证书、Android Gradle、Cocoapods 依赖地狱让人崩溃，环境配三天打不出包。  
> 💡 **可运行实战代码与落地收益**：完整可运行代码库 `examples/ch11-expo-mobile`（Expo SDK 57 + Expo Router + NativeWind）；零本地配置云端打包 `eas build`。  
> ⚡ **社交传播 / 截图金句**：“不用配本地 Xcode 和 Android Studio，借助云端打包与 AI 报错自愈，一个人也能轻松交付双端原生应用。”

做完网页版 SaaS 后，很多独立开发者希望能将触角延伸到移动端。但在传统的原生开发（React Native / Flutter）中，最耗费时间的往往是复杂的本地开发环境配置：iOS 证书管理、Android Gradle 报错、Cocoapods 冲突，这些环境地狱常常让人望而却步。

我坚信 **“云端开发与打包（EAS）是独立开发者做原生 App 的唯一解”**。结合 Codex 的智能编译报错排查，你可以完全跳过本地 Xcode/Android Studio 的繁琐配置，直接打包出可以上架的原生 App。

> 📦 **配套实战源码**：[examples/ch11-expo-mobile](https://github.com/aipmer/book/tree/main/examples/ch11-expo-mobile) —— 完整可运行的 Expo SDK 57 工程（Expo Router `src/app` 路由 + NativeWind + EAS 三档打包配置），自带 CAP 协议 `AGENTS.md`，已通过 `npx expo lint`（零错误）与 `npx expo-doctor`（20/20）验证。

---

## 🎯 生活化直觉隐喻：写好剧本，让“云端工坊”为你定制戏服

跨端开发不需要把你的电脑变成重型加工厂：

```Plaintext
【传统原生开发】 ──> 你在家里自己买炼钢炉（装几十 G 的 Xcode 和 Android Studio）、
                     买织布机（配各种 Gradle/Cocoapods 运行环境），动不动断电报错，三天造不出一只鞋。
【Expo + EAS 模式】──> ✅ 你只负责写剧本（写 React Native / TypeScript 核心代码）：
                     - 剧本写好后，一键发给「云端特种裁缝工坊」（EAS Build）；
                     - 云端自动为你剪裁出 iOS 的 IPA 和 Android 的 APK 安装包；
                     - 手机直接扫码就能把做好的衣服套在身上跑！
```

Codex 就是你在工坊里的剧本精修助理，负责在你写漏了依赖或样式语法时，自动对齐版本。

---

## 🚀 新手极速上手 3 步走（无痛起步）

用 3 步在手机真机上看到你的第一个跨端 App：

1. **步骤一：手机下载安装 Expo Go 客户端**  
   在 App Store 或各大安卓应用商店搜索并安装「Expo Go」。
2. **步骤二：在项目终端启动本地开发服务器**  
   进入项目目录，运行开发命令：
   ```bash
   npx expo start
   # 终端将打出巨大的二维码矩阵
   ```
3. **步骤三：用手机相机扫码即可秒开实时热更新**  
   手机扫码后，App 瞬间加载完成。无论你在本地或让 Codex 调整任何页面代码，手机屏幕都会瞬间热重载呈现！

---

## 11.1 Expo 项目极速初始化与规范设定

为了能使用 EAS 进行云端免配置打包，我们首先初始化一个标准的 Expo 项目。

### 1. 编写 App 初始化 Specs

给 Codex 下达 Specs 指令：

```markdown
# 🎯 Goal
初始化一个使用 TypeScript 的 React Native Expo 项目。

# 🛑 Constraints
- 使用最新稳定的 Expo SDK 57，搭配 Expo Router 实现基于文件系统的路由。
- 引入 NativeWind 作为 Tailwind 风格的样式方案。
- 目录约定使用 src/ 前缀（即 src/app/ 作为路由根）。

# 🧪 Validation Specs
- 运行 `npx expo lint` 无错误。
- 运行 `npx expo-doctor` 检查依赖版本对齐（必须 20/20 通过）。
```

目录结构规范：

```Plaintext
src/
├── app/
│   ├── index.tsx         # APP 首页
│   └── _layout.tsx       # 全局路由导航布局
├── components/
└── hooks/
app.json                  # Expo 核心配置文件
package.json
```

---

## 11.2 解决移动端顽疾：原生依赖冲突

React Native 开发最忌讳使用普通 `npm install` 安装带底层原生代码的第三方包（如相机、传感器、手势库）。

### 铁律：使用 `npx expo install` 对齐版本

如果依赖版本不匹配，在 TUI 中输入纠偏指令：

```bash
请改用 `npx expo install react-native-reanimated` 重新安装该依赖，它会自动适配当前的 Expo SDK 版本。在本项目中，严禁使用普通的 `npm install` 安装任何原生依赖包。请将该铁律写入 AGENTS.md。
```

> 💡 **主理人心法**：`npx expo install` 是官方认证的版本锁。任何时候只要原生模块报错，强制使用该命令覆盖安装，90% 的依赖地狱都会被自动抹平。

---

## 11.3 EAS Build 云端打包与证书自动化

在传统流程中，申请苹果开发者证书往往会卡住新手几天。现在通过 EAS，全流程可以在云端自动化解决。

### 1. 配置 `eas.json`

```json
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

```bash
# 启动 EAS iOS 打包任务，把日志写入本地
eas build --platform ios --profile production --non-interactive 2>&1 | tee eas-build.log
```

如果打包遭遇异常，直接将日志转交给 Codex 分析：

```bash
codex exec --sandbox read-only "分析 eas-build.log，定位失败原因并给出修复命令"
```

最终 EAS 会返回一个安装二维码，你只需用手机扫码即可直接安装测试版 App。

---

## 🛡️ 翻车自救与避坑速查表

| 常见踩坑现象 | 致命原因 | 极速排查与自救指南 |
| :--- | :--- | :--- |
| **手机扫码显示“Could not connect to development server”** | 手机与电脑不在同一个 Wi-Fi 局域网，或电脑开启了路由器防火墙 | 运行 `npx expo start --tunnel`，强制使用公网穿透隧道模式，零网络门槛 |
| `Invariant Violation: "main" has not been registered` | 入口路由文件丢失或 `app.json` 中配置的 entry 路径错误 | 检查 `package.json` 中的 `"main": "expo-router/entry"` 是否被意外篡改 |
| **安装新组件后终端直接报红红屏** | 误用了 `npm install` 安装了不兼容当前 SDK 版本的包 | 运行 `npx expo install <package-name>`，或运行 `npx expo-doctor` 诊断修复 |

---

[ 🏠 主目录 ](/) | [ ⬅️ 上一章 (Ch.10) ](./ch10_saas_mvp.md) | [ ➡️ 下一章 (Ch.12) ](./ch12_commercialization.md) | [ 🌐 English ](../en/ch11_expo_mobile.md)
