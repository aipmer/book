---
title: AGENTS.md 交互式规约生成器
description: 30 秒为你的项目生成专属 AI 防御规约
---

# AGENTS.md 交互式规约生成器

> 防止 AI 破坏既有架构、胡乱安装依赖、陷入死循环盲猜或虚构假代码。根据技术栈一键生成专属 AGENTS.md 防御规约，直接复制至项目根目录即刻生效。

<ClientOnly>
<div class="generator-app">
  <div class="form-grid">
    <div class="form-group">
      <label class="label">1. 选择你的项目技术栈（对号入座，锁定技术规范）：</label>
      <select v-model="selectedStack" class="select-input">
        <option value="nextjs">Next.js 14/15 (React 全栈)</option>
        <option value="vue3">Vue 3 + Vite + TypeScript</option>
        <option value="fastapi">FastAPI (Python 现代微服务)</option>
        <option value="django">Django (Python 经典后端)</option>
        <option value="spring">Spring Boot (Java 3.x)</option>
        <option value="expo">React Native (Expo 移动端)</option>
        <option value="go">Go (Gin / Fiber)</option>
        <option value="rust">Rust (Axum / Tokio)</option>
        <option value="svelte">SvelteKit (Svelte 5)</option>
        <option value="chrome">Chrome 扩展 (Manifest V3)</option>
      </select>
    </div>

    <div class="form-group">
      <label class="label">2. 项目名称：</label>
      <input type="text" v-model="projectName" class="text-input" placeholder="例如: my-awesome-saas" />
    </div>

    <div class="form-group">
      <label class="label">3. 运行环境与权限边界（防危险操作与数据泄漏）：</label>
      <select v-model="sandboxLevel" class="select-input">
        <option value="standard">标准开发防御（允许安装依赖、跑测试与编译构建；禁止越权访问生产凭证与外网密钥）</option>
        <option value="strict">严格只读保护（AI 仅分析代码与输出修改方案，禁止私自执行终端命令，全部变更必须走人工 PR 审查）</option>
        <option value="tunnel">本地联调模式（允许打通本地端口访问 Docker 数据库与外部 API，配合飞书助理远程审批高危操作）</option>
      </select>
    </div>

    <div class="form-group">
      <label class="label">4. 激活核心安全护栏（防御常见工程失控事故）：</label>
      <div class="checkbox-group">
        <label class="checkbox-item">
          <input type="checkbox" v-model="rules.antiLoop" />
          <span>🛑 防自旋死循环：同一编译或测试报错连续修复 2 次不通过立即暂停，输出排错思考链，严禁无脑烧 Token 乱试</span>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" v-model="rules.noPlaceholder" />
          <span>🚫 防虚假伪造：严禁提交含有 // TODO、假 mock 数据或未实现的空函数，所有交付代码必须真实可编译</span>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" v-model="rules.noExternalDeps" />
          <span>📦 防滥装依赖：常规逻辑优先使用原生标准库与内置 API，严禁未经确认私自安装体积庞大的非必要外部包</span>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" v-model="rules.enforceValidation" />
          <span>✅ 交付必带测试：阶段性修改完成后必须由智能体自动跑通测试与生产构建，退出码为 0 才算完成交付</span>
        </label>
      </div>
    </div>
  </div>

  <div class="output-section">
    <div class="output-header">
      <span class="output-title">📄 生成的 AGENTS.md 实时预览：</span>
      <button class="btn-copy" @click="copyContent">
        {{ copied ? '✅ 已复制到剪贴板' : '📋 一键复制规约' }}
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

const stackConfigs = {
  nextjs: {
    name: 'Next.js (App Router) + TypeScript',
    buildCmd: 'npm run build',
    testCmd: 'npm run lint && npm test',
    specificRules: [
      '所有组件默认优先为 React Server Component，仅在需要客户端交互时添加 "use client"',
      '样式使用 Tailwind CSS，不得在组件中混入纯内联全局 style',
      '环境变量严格区分 NEXT_PUBLIC_ 前缀，服务端敏感密钥严禁泄漏至客户端'
    ]
  },
  vue3: {
    name: 'Vue 3 + Vite + Pinia',
    buildCmd: 'npm run build',
    testCmd: 'npm run lint && vue-tsc --noEmit',
    specificRules: [
      '一律采用 <script setup lang="ts"> Composition API 编写',
      '状态管理使用 Pinia，禁止使用遗留 Vuex',
      '严格处理响应式解构，使用 storeToRefs 避免响应式丢失'
    ]
  },
  fastapi: {
    name: 'FastAPI + Pydantic v2',
    buildCmd: 'python -m compileall .',
    testCmd: 'pytest -v && ruff check .',
    specificRules: [
      '全面使用 Pydantic v2 模型进行入参校验与序列化',
      '异步函数显式标明 async def，数据库会话必须采用 AsyncSession 依赖注入',
      '所有路由 endpoint 必须附带清晰的 response_model 定义'
    ]
  },
  django: {
    name: 'Django + DRF',
    buildCmd: 'python manage.py check',
    testCmd: 'python manage.py test && flake8',
    specificRules: [
      '涉及数据表修改必须自动生成与执行 makemigrations，禁止手写裸 SQL 迁移',
      '严禁在视图层编写 N+1 查询，显式使用 select_related / prefetch_related'
    ]
  },
  spring: {
    name: 'Spring Boot 3 + Java 21',
    buildCmd: './gradlew build -x test',
    testCmd: './gradlew check',
    specificRules: [
      '统一使用构造器注入 (Constructor Injection)，禁止使用 @Autowired 字段注入',
      '实体类与 DTO 严格解耦，不得将 JPA 实体直接作为 API 返回体'
    ]
  },
  expo: {
    name: 'React Native + Expo (SDK 52+)',
    buildCmd: 'npx expo export --platform web',
    testCmd: 'npx expo lint && npx --yes expo-doctor',
    specificRules: [
      '严禁直接引用未经 Expo 兼容验证的底层 iOS/Android 裸原生模块',
      '优先使用 NativeWind (Tailwind) 进行多端自适应排版',
      '安全区域必须包裹 SafeAreaProvider 与 SafeAreaView'
    ]
  },
  go: {
    name: 'Go 1.22+ (Gin / Fiber)',
    buildCmd: 'go build -v ./...',
    testCmd: 'go test -v ./... && golangci-lint run',
    specificRules: [
      '错误处理遵循 if err != nil 显式包装，严禁直接忽略 error 返回值',
      'Context 必须作为第一个参数透传，禁止跨 Goroutine 共享未同步状态'
    ]
  },
  rust: {
    name: 'Rust (Axum + Tokio)',
    buildCmd: 'cargo check',
    testCmd: 'cargo test && cargo clippy -- -D warnings',
    specificRules: [
      '严禁滥用 unwrap() 或 expect()，生产链路使用 Result 与 thiserror 向上抛出',
      '严格遵循所有权与生命周期机制，避免无意义的 clone()'
    ]
  },
  svelte: {
    name: 'SvelteKit + Svelte 5',
    buildCmd: 'npm run build',
    testCmd: 'npm run check',
    specificRules: [
      '使用 Svelte 5 Runes ($state, $derived, $effect) 替代旧式响应式声明',
      'Server 路由与 Client 组件严格物理隔离'
    ]
  },
  chrome: {
    name: 'Chrome Extension (Manifest V3)',
    buildCmd: 'node scripts/validate.js',
    testCmd: 'npm test',
    specificRules: [
      '严格遵循 MV3 CSP：严禁使用 eval() 与任何 HTML 内联脚本',
      'Service Worker 具备短暂休眠特性，状态持久化必须写入 chrome.storage.local',
      '申请权限遵循最小特权原则，默认优先使用 activeTab'
    ]
  }
}

const sandboxText = {
  standard: '- 标准开发防御：允许在项目内执行依赖安装、测试与代码构建。严禁任何生产部署、外部密钥读写等越权高危行为。',
  strict: '- 严格只读保护：智能体仅具备文件阅读与方案输出权限，禁止私自执行终端命令。所有变更必须由人类在终端显式审查后走 PR 合并。',
  tunnel: '- 本地联调模式：允许打通本地端口访问 Docker 数据库与外部 API，配合飞书助理移动端随时接收告警与审批高危操作。'
}

const generatedContent = computed(() => {
  const stack = stackConfigs[selectedStack.value]
  const pName = projectName.value || 'my-project'
  
  let md = `# 🤖 项目专属 AI 协作防御规约 (AGENTS.md)\n\n`
  md += `## 📌 项目指纹\n`
  md += `- **项目名称**：${pName}\n`
  md += `- **目标架构**：${stack.name}\n`
  md += `- **协作模式**：遵循生产级防自旋死循环、防虚假代码与自动化测试防线\n\n`

  md += `## 🛑 运行环境与权限边界\n`
  md += `${sandboxText[sandboxLevel.value]}\n\n`

  md += `## 🛡️ 核心工程防御护栏 (Anti-Loop)\n`
  if (rules.value.antiLoop) {
    md += `1. **🛑 防自旋死循环 (Anti-Loop)**：如果同一编译或测试错误在修改后重试 2 次仍未解决，必须立即强制暂停，向开发者输出排错思考链 (CoT)，严禁陷入自旋死循环。\n`
  }
  if (rules.value.noPlaceholder) {
    md += `2. **🚫 防虚假伪造 (严禁占位符)**：严禁提交含有 \`// TODO: 实现此逻辑\`、\`pass\`、或虚构假数据的未完成函数，所有代码必须真实可编译。\n`
  }
  if (rules.value.noExternalDeps) {
    md += `3. **📦 防滥装依赖 (依赖守卫)**：常规逻辑优先使用原生标准库与内置 API，严禁未经确认私自安装体积庞大的未知第三方包。\n`
  }
  stack.specificRules.forEach((rule, idx) => {
    md += `${idx + 4}. **技术栈专有防御**：${rule}\n`
  })
  md += `\n`

  md += `## 🧪 验证标准 (Validation Specs)\n`
  md += `智能体在每次阶段性修改完成后，必须按顺序执行以下命令进行自检，确认退出码为 0 后方可交付：\n\n`
  md += `\`\`\`bash\n`
  md += `# 1. 运行静态检查与单元测试\n`
  md += `${stack.testCmd}\n\n`
  md += `# 2. 验证生产构建\n`
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
    alert('复制失败，请手动选中代码框内容复制。')
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
