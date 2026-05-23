[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.10) ](./ch10_saas_mvp.md) | [ ➡️ Next (Ch.12) ](./ch12_commercialization.md)

# Ch.11 Mobile Extension: Expo Cross-Platform App Development and Cloud Packaging

Build iOS and Android apps without configuring Xcode or Android Studio locally.

---

## 11.1 Expo Router Setup
Ask Codex to initialize the React Native project structure:

```markdown
# 🎯 Goal
Bootstrap a React Native project using Expo Router and NativeWind (Tailwind CSS).
```

---

## 11.2 Native Dependency Conflict Resolution
If Cocoapods auto-linking fails in the sandbox, instruct Codex to align packages using Expo SDK CLI:

```bash
codex refine "Reinstall the package using 'npx expo install' to match SDK versions."
```

---

## 11.3 EAS Cloud Builds
Trigger cloud compilation remotely without local environment headaches:

```bash
eas build --platform ios --profile production --non-interactive
```

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.10) ](./ch10_saas_mvp.md) | [ ➡️ Next (Ch.12) ](./ch12_commercialization.md)
