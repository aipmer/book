---
title: AGENTS.md Interactive Generator
description: Generate tailored AI defense rules for your project in 30 seconds
---

# AGENTS.md Interactive Generator

> Prevent AI from breaking established architectures, installing unvetted packages, hallucinating fake code, or spinning in infinite error loops. Generate custom AGENTS.md defense rules tailored to your tech stack in 30 seconds.

<ClientOnly>
<div class="generator-app">
  <div class="form-grid">
    <div class="form-group">
      <label class="label">1. Select Stack / Framework:</label>
      <select v-model="selectedStack" class="select-input">
        <option value="nextjs">Next.js 14/15 (Full-stack React)</option>
        <option value="vue3">Vue 3 + Vite + TypeScript</option>
        <option value="fastapi">FastAPI (Python Microservices)</option>
        <option value="django">Django (Python Backend)</option>
        <option value="spring">Spring Boot (Java 3.x)</option>
        <option value="expo">React Native (Expo Mobile)</option>
        <option value="go">Go (Gin / Fiber)</option>
        <option value="rust">Rust (Axum / Tokio)</option>
        <option value="svelte">SvelteKit (Svelte 5)</option>
        <option value="chrome">Chrome Extension (Manifest V3)</option>
      </select>
    </div>

    <div class="form-group">
      <label class="label">2. Project Name:</label>
      <input type="text" v-model="projectName" class="text-input" placeholder="e.g.: my-awesome-saas" />
    </div>

    <div class="form-group">
      <label class="label">3. Execution Environment & Permissions (Defense Boundaries):</label>
      <select v-model="sandboxLevel" class="select-input">
        <option value="standard">Standard Development Defense (Install, test, build allowed; no credential leakage)</option>
        <option value="strict">Strict Read-Only Protection (AI only proposes diffs, terminal execution banned, changes via PR)</option>
        <option value="tunnel">Local Debugging Mode (Bridge local Docker DB and APIs, with Feishu Assistant remote approvals)</option>
      </select>
    </div>

    <div class="form-group">
      <label class="label">4. Core Safety Guardrails (Defense Scenarios):</label>
      <div class="checkbox-group">
        <label class="checkbox-item">
          <input type="checkbox" v-model="rules.antiLoop" />
          <span>🛑 Stop Infinite Loops (Prevent Loop): Abort on 2 consecutive test/build failures and emit CoT logs, preventing endless spinning</span>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" v-model="rules.noPlaceholder" />
          <span>🚫 Ban Fake Stubs (No Placeholders): Strictly forbid TODOs, mock stubs, or empty functions; all delivered code must be runnable</span>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" v-model="rules.noExternalDeps" />
          <span>📦 Dependency Guard: Prefer standard libraries and built-in APIs; forbid unapproved heavy third-party packages</span>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" v-model="rules.enforceValidation" />
          <span>✅ Deliver with Tests (Verification Specs): Must run automated test suites and production build checks with exit code 0 before delivery</span>
        </label>
      </div>
    </div>
  </div>

  <div class="output-section">
    <div class="output-header">
      <span class="output-title">📄 Real-time AGENTS.md Preview:</span>
      <button class="btn-copy" @click="copyContent">
        {{ copied ? '✅ Copied to Clipboard' : '📋 Copy Protocol' }}
      </button>
    </div>
    <pre class="code-preview"><code>{{ generatedContent }}</code></pre>
  </div>
</div>
</ClientOnly>

<script setup lang="ts">
import { ref, computed } from 'vue'

const selectedStack = ref('nextjs')
const projectName = ref('my-saas-mvp')
const sandboxLevel = ref('standard')
const copied = ref(false)

const rules = ref({
  antiLoop: true,
  noPlaceholder: true,
  noExternalDeps: true,
  enforceValidation: true
})

const stackConfigs: Record<string, any> = {
  nextjs: {
    name: 'Next.js (App Router) + TypeScript',
    buildCmd: 'npm run build',
    testCmd: 'npm run lint && npm test',
    specificRules: [
      'Components default to React Server Components; only add "use client" when interaction is required',
      'Use Tailwind CSS; inline arbitrary style objects are prohibited',
      'Strictly separate server envs from client NEXT_PUBLIC_ variables'
    ]
  },
  vue3: {
    name: 'Vue 3 + Vite + Pinia',
    buildCmd: 'npm run build',
    testCmd: 'npm run lint && vue-tsc --noEmit',
    specificRules: [
      'Standardize on <script setup lang="ts"> Composition API',
      'Use Pinia for global state; legacy Vuex is banned',
      'Handle reactive destructuring with storeToRefs to avoid reactivity loss'
    ]
  },
  fastapi: {
    name: 'FastAPI + Pydantic v2',
    buildCmd: 'python -m compileall .',
    testCmd: 'pytest -v && ruff check .',
    specificRules: [
      'Use Pydantic v2 for payload validations and serialization',
      'Explicitly declare async def endpoints with AsyncSession dependency injection',
      'All endpoints must specify an explicit response_model'
    ]
  },
  django: {
    name: 'Django + DRF',
    buildCmd: 'python manage.py check',
    testCmd: 'python manage.py test && flake8',
    specificRules: [
      'Schema changes must run via makemigrations; raw SQL migrations are banned',
      'Avoid N+1 queries by using select_related / prefetch_related'
    ]
  },
  spring: {
    name: 'Spring Boot 3 + Java 21',
    buildCmd: './gradlew build -x test',
    testCmd: './gradlew check',
    specificRules: [
      'Use Constructor Injection; field-level @Autowired is prohibited',
      'Strictly decouple entity models from API transfer DTOs'
    ]
  },
  expo: {
    name: 'React Native + Expo (SDK 52+)',
    buildCmd: 'npx expo export --platform web',
    testCmd: 'npx expo lint && npx --yes expo-doctor',
    specificRules: [
      'Never reference bare iOS/Android native modules without Expo config plugins',
      'Prefer NativeWind (Tailwind) for responsive layouts across mobile screens',
      'Wrap all views within SafeAreaProvider and SafeAreaView'
    ]
  },
  go: {
    name: 'Go 1.22+ (Gin / Fiber)',
    buildCmd: 'go build -v ./...',
    testCmd: 'go test -v ./... && golangci-lint run',
    specificRules: [
      'Wrap errors with context (if err != nil); never swallow errors silently',
      'Context must be passed as the first parameter; avoid un-synchronized Goroutines'
    ]
  },
  rust: {
    name: 'Rust (Axum + Tokio)',
    buildCmd: 'cargo check',
    testCmd: 'cargo test && cargo clippy -- -D warnings',
    specificRules: [
      'Banned usage of unwrap() or expect() in production; bubble errors via Result and thiserror',
      'Strictly honor ownership and lifetimes without superfluous clone() calls'
    ]
  },
  svelte: {
    name: 'SvelteKit + Svelte 5',
    buildCmd: 'npm run build',
    testCmd: 'npm run check',
    specificRules: [
      'Use Svelte 5 Runes ($state, $derived, $effect) instead of legacy reactive declarations',
      'Isolate server endpoints and client component logic'
    ]
  },
  chrome: {
    name: 'Chrome Extension (Manifest V3)',
    buildCmd: 'node scripts/validate.js',
    testCmd: 'npm test',
    specificRules: [
      'Strict MV3 CSP: eval() and inline <script> tags are banned',
      'Service Workers are ephemeral; state must persist in chrome.storage.local',
      'Adhere to least privilege; prefer activeTab over broad host permissions'
    ]
  }
}

const sandboxText: Record<string, string> = {
  standard: '- Standard Development Defense: Package installation, testing, and building are allowed. Production writes and credential leakage are strictly forbidden.',
  strict: '- Strict Read-Only Protection: Agent operates read-only. Terminal commands are forbidden and all changes require human review via Pull Requests.',
  tunnel: '- Local Debugging Mode: Allow port bridging to local Docker databases and APIs, paired with Feishu Assistant for mobile alerts and remote approvals.'
}

const generatedContent = computed(() => {
  const stack = stackConfigs[selectedStack.value]
  const pName = projectName.value || 'my-project'
  
  let md = `# 🤖 Codex Collaboration Protocol (CAP)\n\n`
  md += `## 📌 Project Signature\n`
  md += `- **Project Name**: ${pName}\n`
  md += `- **Target Architecture**: ${stack.name}\n`
  md += `- **Collaboration Framework**: Codex Blue Book CAP Protocol\n\n`

  md += `## 🛑 Defense Scenarios & Sandbox Boundaries\n`
  md += `${sandboxText[sandboxLevel.value]}\n\n`

  md += `## 🛡️ Core Engineering Guardrails (Anti-Loop)\n`
  if (rules.value.antiLoop) {
    md += `1. **🛑 Stop Infinite Loops (Prevent Loop)**: If compilation or test fails twice in a row, halt immediately, log the full error context, and switch to single-module diagnostic mode. Continuous guessing loops are strictly forbidden.\n`
  }
  if (rules.value.noPlaceholder) {
    md += `2. **🚫 Ban Fake Stubs (No Placeholders)**: No stubs like \`// TODO: implement\`, \`pass\`, or fabricated mock data. All code must be runnable.\n`
  }
  if (rules.value.noExternalDeps) {
    md += `3. **📦 Dependency Guard**: Never introduce heavyweight dependencies or third-party wrappers without explicit review. Prefer standard library solutions.\n`
  }
  stack.specificRules.forEach((rule: string, idx: number) => {
    md += `${idx + 4}. **Stack-Specific**: ${rule}\n`
  })
  md += `\n`

  md += `## 🧪 Deliver with Tests (Verification Specs)\n`
  md += `Before marking any task as complete, execute the following commands to ensure a zero exit code:\n\n`
  md += `\`\`\`bash\n`
  md += `# 1. Lint & Unit Tests\n`
  md += `${stack.testCmd}\n\n`
  md += `# 2. Production Build Verification\n`
  md += `${stack.buildCmd}\n`
  md += `\`\`\`\n`

  return md
})

async function copyContent() {
  try {
    await navigator.clipboard.writeText(generatedContent.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2500)
  } catch (err) {
    alert('Failed to copy. Please manually select and copy.')
  }
}
</script>

<style scoped>
.generator-app {
  margin-top: 24px;
}
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--vp-c-bg-soft);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.label {
  font-weight: 600;
  font-size: 14px;
  color: var(--vp-c-text-1);
}
.select-input, .text-input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
}
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;
  color: var(--vp-c-text-2);
}
.checkbox-item:hover {
  color: var(--vp-c-text-1);
}
.output-section {
  margin-top: 24px;
}
.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.output-title {
  font-weight: 600;
  font-size: 14px;
}
.btn-copy {
  background: var(--vp-c-brand);
  color: white;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-copy:hover {
  opacity: 0.9;
}
.code-preview {
  background: var(--vp-c-bg-alt);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.5;
  border: 1px solid var(--vp-c-divider);
}
</style>
