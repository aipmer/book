[ 🏠 Index ](/en/) | [ ⬅️ Prev (Ch.10) ](./ch10_saas_mvp.md) | [ ➡️ Next (Ch.12) ](./ch12_commercialization.md) | [ 🌐 中文版 ](../chapters/ch11_expo_mobile.md)

# Ch.11 Mobile Extension: Expo Cross-Platform App Development and Cloud Packaging

> 🎯 **The Real Problem**: Web developers stuck in Xcode certificate signing, Android Gradle builds, and CocoaPods dependency hell when trying to ship mobile apps.  
> 💡 **Tangible Output & Takeaway**: Complete companion project `examples/ch11-expo-mobile` (Expo SDK 57 + Expo Router + NativeWind); zero-local-setup `eas build` cloud packaging pipelines.  
> ⚡ **Viral Screenshot Quote**: *"Skip local Xcode and Android Studio configuration hell. Build and publish dual-platform native apps autonomously with cloud pipelines and AI error self-healing."*

After shipping a web SaaS, many independent developers want to extend their reach to mobile. However, in traditional mobile development (React Native or Flutter), the most grueling friction is local environment setup: iOS certificates, Android Gradle build failures, and CocoaPods version conflicts.

I firmly believe that **"cloud compilation and packaging (EAS) is the only viable path for independent developers to build native apps."** Combined with Codex's automated diagnostic assistance, you can bypass local Xcode/Android Studio configuration entirely and ship production-ready native apps directly to app stores.

> 📦 **Companion Source Code**: [examples/ch11-expo-mobile](https://github.com/aipmer/book/tree/main/examples/ch11-expo-mobile) — a fully runnable Expo SDK 57 project (Expo Router `src/app` routing + NativeWind + three-tier EAS build profiles) with its own CAP `AGENTS.md`. Verified with `npx expo lint` (zero errors) and `npx expo-doctor` (20/20 checks passed).

---

## 🎯 Intuitive Metaphor: Writing the Script and Letting the "Cloud Atelier" Tailor the Costumes

Cross-platform development shouldn't require turning your personal laptop into a heavy manufacturing plant:

```Plaintext
[Traditional Native Dev] ──> Buying your own smelting furnace (installing 50GB+ Xcode and Android Studio),
                             configuring loom machinery (fiddling with Gradle and CocoaPods runtimes),
                             frequently tripping circuit breakers and stalling for days without a working build.
[Expo + EAS Mode]        ──> ✅ You only focus on the script (writing React Native / TypeScript code):
                             - Once the script is ready, send it to the "Cloud Custom Atelier" (EAS Build);
                             - The cloud automatically tailors iOS IPAs and Android APKs;
                             - Scan the QR code on your phone to slip into the customized outfit instantly!
```

Codex serves as your script editor in the atelier, automatically aligning versions whenever you miss a dependency or styling quirk.

---

## 🚀 Beginner Quickstart (3 Easy Steps)

See your cross-platform app running on a physical phone in 3 simple steps:

1. **Step 1: Install Expo Go on Your Mobile Device**  
   Search for and install "Expo Go" from the App Store or Google Play.
2. **Step 2: Start the Local Development Server**  
   Navigate to the project directory and run:
   ```bash
   npx expo start
   # The terminal will display a large QR code matrix
   ```
3. **Step 3: Scan the QR Code with Your Phone Camera**  
   Scan the code to load the app immediately. Whenever you or Codex modify page code, the phone screen hot-reloads instantly!

---

## 11.1 Expo Project Rapid Initialization and Standards Setup

To use EAS for zero-configuration cloud packaging, initialize a standard Expo project:

### 1. Writing App Initialization Specs

Issue the following specs to Codex:

```markdown
# 🎯 Goal
Initialize a React Native Expo project using TypeScript.

# 🛑 Constraints
- Use the latest stable Expo SDK 57, paired with Expo Router for file-system-based routing.
- Integrate NativeWind as the Tailwind-style CSS styling solution.
- Use the src/ prefix convention (i.e., src/app/ as the routing root).

# 🧪 Validation Specs
- Running `npx expo lint` must return zero errors.
- Run `npx expo-doctor` to verify dependency version alignment (must pass 20/20).
```

Directory structure layout:

```Plaintext
src/
├── app/
│   ├── index.tsx         # App Home Page
│   └── _layout.tsx       # Global Routing Navigation Layout
├── components/
└── hooks/
app.json                  # Expo Core Configuration File
package.json
```

---

## 11.2 Resolving Mobile Obstacles: Native Module Conflicts

React Native development must avoid using standard `npm install` for third-party packages containing underlying native code (such as cameras, sensors, or gesture handlers).

### Golden Rule: Use `npx expo install` for Version Alignment

If dependency versions drift, type this correction directly in the TUI:

```bash
Please use `npx expo install react-native-reanimated` to reinstall this dependency instead. It will automatically adapt to the current Expo SDK version. In this project, using standard `npm install` to install any native package is strictly prohibited. Please append this rule to AGENTS.md.
```

> 💡 **Founder's Mantra**: `npx expo install` is the official certified version lock. Whenever native modules fail, force reinstalling with this command automatically wipes out 90% of dependency issues.

---

## 11.3 EAS Build Cloud Packaging and Certificate Automation

In traditional app delivery, obtaining Apple developer certificates can stall newcomers for days. With EAS, this entire process is handled in the cloud.

### 1. Configuring `eas.json`

```json
{
  "cli": {
    "version": ">= 9.0.0"
{{ ... }}
  }
}
```

### 2. Instructing Codex to Monitor Cloud Build Logs

```bash
# Start EAS iOS build task and stream logs to a local file
eas build --platform ios --profile production --non-interactive 2>&1 | tee eas-build.log
```

If the build hits an error, hand the logs directly to Codex for analysis:

```bash
codex exec --sandbox read-only "Analyze eas-build.log, locate failure cause, and provide remediation commands"
```

Ultimately, EAS returns an installation QR code that you can scan to install the preview app directly on your phone.

---

## 🛡️ Troubleshooting & Pitfall Cheat Sheet

| Common Pitfall | Root Cause | Rapid Diagnosis & Fix Guide |
| :--- | :--- | :--- |
| **Phone scans QR code and shows "Could not connect to development server"** | Phone and computer are not on the same Wi-Fi LAN, or router firewall blocks local traffic | Run `npx expo start --tunnel` to force public tunnel mode with zero network barriers |
| `Invariant Violation: "main" has not been registered` | Entry routing file missing or incorrect entry path in `app.json` | Verify `"main": "expo-router/entry"` in `package.json` was not accidentally modified |
| **Terminal throws red screen error immediately after installing a new package** | Accidental use of `npm install` introducing an incompatible SDK version | Run `npx expo install <package-name>`, or execute `npx expo-doctor` to diagnose and align |

---

[ 🏠 Index ](/en/) | [ ⬅️ Prev (Ch.10) ](./ch10_saas_mvp.md) | [ ➡️ Next (Ch.12) ](./ch12_commercialization.md) | [ 🌐 中文版 ](../chapters/ch11_expo_mobile.md)
