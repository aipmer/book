[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.10) ](./ch10_saas_mvp.md) | [ ➡️ Next (Ch.12) ](./ch12_commercialization.md)

# Ch.11 Mobile Extension: Expo Cross-Platform App Development and Cloud Packaging

After completing a web-based SaaS, many independent developers hope to extend their reach to mobile. However, in traditional mobile development (React Native or Flutter), the most time-consuming part is often the complex local environment setup: iOS certificate management, Android Gradle errors, Cocoapods version conflicts. This local environment hell often deters developers.

In "Real-World Product Talk", I firmly believe: **"Cloud compilation and packaging (EAS) is the only viable path for independent developers to build native mobile apps."** Combined with Codex's automated compilation error diagnostics, you can entirely skip the tedious configurations of local Xcode/Android Studio and directly package a native App ready for submission.

This chapter teaches you how to direct Codex to handle all of this autonomously.

---

## 11.1 Rapid Expo Project Initialization

To use EAS (Expo Application Services) for configuration-free cloud packaging, we first need to establish a connection between the sandbox and the local environment.

### 1. Writing App Initialization Specs
Issue the following specs command to Codex to generate a standard Expo TypeScript project:

```markdown
# 🎯 Goal
Initialize a React Native Expo project using TypeScript.

# 🛑 Constraints
- Use Expo Router v3 to implement file-system-based routing.
- Integrate the Tailwind CSS styled library NativeWind.

# 🧪 Validation Specs
- Running `npx expo lint` must return zero errors.
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

The most feared scenario in React Native development is upgrading or introducing a third-party library that contains native modules (such as Camera or File System access). This frequently leads to build failures in iOS Podfile or Android build.gradle.

Under Vibe Coding, when Codex installs dependencies and encounters native errors, we should guide it to follow the troubleshooting strategy below.

### Practice: Guiding Codex to Troubleshoot Podfile Failures
If Codex fails to compile iOS native modules inside the sandbox, its CoT logs will display a warning similar to:
`[Error] [Cocoapods] Auto-linking failed for react-native-reanimated.`

At this point, use the `refine` command in the CLI to add specific constraints:

```bash
codex refine "Reinstall the package using 'npx expo install' to match SDK versions. Never use standard 'npm install' to install third-party packages containing native mobile code."
```

> 💡 **Founder's Advice**: The greatest strength of Expo SDK is its built-in dependency alignment mechanism (`npx expo install`). Whenever a native package throws an error, force Codex to use Expo's native package command to install dependencies, which automatically resolves 90% of version conflicts.

---

## 11.3 EAS Build Cloud Packaging and Certificate Automation

In traditional App packaging pipelines, applying for Apple developer certificates and generating Provisioning Profiles can stall beginners for days. Now, using EAS, we only need to provide developer credentials to Codex, and it handles the entire setup on the cloud automatically.

### 1. Configuring `eas.json` (EAS Cloud Build Config)
Have Codex generate the cloud build environment configurations for production and testing.

`eas.json` configuration file:

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
Trigger the EAS build task from the local terminal:

```bash
# Start EAS iOS build task and pipe logs to Codex
eas build --platform ios --profile production --non-interactive | codex watch-eas
```

During the cloud compilation process, if a Provisioning Profile mismatch or certificate expiration occurs, Codex will analyze the cloud build logs in its CoT thinking chain in real-time, reconnect to sync the developer console certificate state, and auto-correct.

Ultimately, it will output a QR code. You only need to scan it with your phone to download and install the preview App.

**Native mobile development no longer requires a bulky IDE setup. Move packaging to the cloud with Expo + EAS, and let Codex act as your safety net.**

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.10) ](./ch10_saas_mvp.md) | [ ➡️ Next (Ch.12) ](./ch12_commercialization.md)
