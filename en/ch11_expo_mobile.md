[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.10) ](./ch10_saas_mvp.md) | [ ➡️ Next (Ch.12) ](./ch12_commercialization.md) | [ 🌐 中文版 ](../chapters/ch11_expo_mobile.md)

# Ch.11 Mobile Extension: Expo Cross-Platform App Development and Cloud Packaging

As an independent founder and product manager, your primary pursuit besides "high efficiency" is "freedom." However, in traditional mobile development (React Native or Flutter), the most time-consuming part is often the complex local environment setup: iOS certificate management, Android Gradle errors, Cocoapods version conflicts. This local environment hell often deters developers.

I firmly believe that **"cloud compilation and packaging (EAS) is the only viable path for independent developers to build native mobile apps."** Combined with Codex's automated compilation error diagnostics, you can entirely skip the tedious configurations of local Xcode/Android Studio and directly package a native App ready for submission.

This chapter teaches you how to direct Codex to handle all of this autonomously.

---

## 11.1 Expo Project Rapid Initialization and Simulator Mapping

To use EAS (Expo Application Services) for configuration-free cloud packaging, we first initialize a standard Expo project.

### 1. Writing App Initialization Specs
Issue the following specs command to Codex to generate a standard Expo TypeScript project:

```markdown
# 🎯 Goal
Initialize a React Native Expo project using TypeScript.

# 🛑 Constraints
- Use the latest stable Expo SDK (currently SDK 56), paired with the latest version of Expo Router to implement file-system-based routing.
- Integrate NativeWind as the Tailwind CSS styling solution.
- Use the `src/` prefix for directory conventions (i.e., `src/app/` as the routing root).

# 🧪 Validation Specs
- Running `npx expo lint` must return zero errors.
- Run `npx expo-doctor` to verify dependency version alignment.
```

Codex will automatically pull the latest Expo template and generate the basic directory structure:

```text
+-- src/
|   +-- app/
|   |   +-- index.tsx         # App Home Page
|   |   +-- _layout.tsx       # Global Routing Navigation Layout
|   +-- components/
|   +-- hooks/
+-- app.json                  # Expo Core Configuration File
+-- package.json
```

---

## 11.2 Resolving Mobile Obstacles: Native Module Conflicts

React Native development most fears upgrading or introducing a third-party library that contains native modules (such as Camera or File System access). This frequently leads to build failures in iOS Podfile or Android build.gradle.

Under Vibe Coding, when Codex installs dependencies and encounters native errors, we should guide it to follow the troubleshooting strategy below.

### Practice: Guiding Codex to Troubleshoot Podfile Failures
If Codex fails to compile iOS native modules inside the sandbox, its reasoning summary will display a warning similar to:
`[Error] [Cocoapods] Auto-linking failed for react-native-reanimated.`

At this point, **directly type and enter the correction instruction in the TUI** (without any special subcommands, as detailed in Ch.06):

```bash
Please use `npx expo install react-native-reanimated` to reinstall this dependency instead. It will automatically adapt to the current Expo SDK version. In this project, using standard `npm install` to install any third-party packages with native code is strictly prohibited. Please append this rule to AGENTS.md.
```

> 💡 **Orchestrator's Advice**: The greatest strength of Expo SDK is its built-in dependency alignment mechanism (`npx expo install`). Whenever a native package throws an error, force Codex to use Expo's native package command to install dependencies, which automatically resolves 90% of version conflicts.

---

## 11.3 EAS Build Cloud Packaging and Certificate Automation

In traditional App packaging pipelines, applying for Apple developer certificates and generating Provisioning Profiles can stall beginners for days. Now, using EAS, we only need to provide developer credentials to Codex, and it handles the entire setup on the cloud automatically.

### 1. Configuring `eas.json` (EAS Cloud Build Config)
Have Codex generate the cloud build environment configurations for production and testing.

`eas\.json` configuration file:

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

### 2. Instructing Codex to Monitor Cloud Build Logs
Trigger the EAS build task from the local terminal and save the logs to a local file for Codex to analyze:

```bash
# Start EAS iOS build task and save the logs to a local file
eas build --platform ios --profile production --non-interactive 2>&1 | tee eas-build.log
```

Once the build finishes (or fails), feed the logs directly to Codex:

```bash
# Feed the build logs to Codex for diagnostics
codex exec "Analyze eas-build.log, locate the failure reason, and provide a fix. If it's a Provisioning Profile mismatch or certificate expiration, tell me exactly what eas credentials commands to run."
```

> ⚠️ **Boundary Clarification**: Codex **will not automatically log into your Apple Developer Portal to regenerate certificates on your behalf**—certificate issuance and rotation are handled between EAS (via `eas credentials`) and Apple. What Codex can do is: read and parse EAS error logs, identify typical issues such as expired certificates or mismatched Provisioning Profiles, guide you to run the correct remediation commands, and automatically generate patch scripts.

Ultimately, EAS will return a QR code. You only need to scan it with your phone to download and install the preview App.

**Native mobile development no longer requires a bulky IDE setup. Move packaging to the cloud with Expo + EAS, and let Codex act as your co-pilot for mobile development.**

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.10) ](./ch10_saas_mvp.md) | [ ➡️ Next (Ch.12) ](./ch12_commercialization.md) | [ 🌐 中文版 ](../chapters/ch11_expo_mobile.md)
