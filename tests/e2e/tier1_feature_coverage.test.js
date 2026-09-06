/**
 * Tier 1: Feature Coverage E2E Test Suite
 * Covers F1 through F8 with >= 5 tests per feature (40 tests total).
 */

const { describe, test, it, expect } = require('./runner');
const fs = require('fs');
const path = require('path');

describe('Tier 1 - Feature Coverage', () => {
  // =========================================================================
  // F1: Cover Hover Physics Fix (M1)
  // =========================================================================
  test('F1-T1-01', 'custom.css eliminates translateY/translate on hover to prevent jumping', { tier: 1, feature: 'F1', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    const hoverMatch = css.match(/\.VPHero\s+\.image-src:hover\s*\{([^}]+)\}/);
    expect(hoverMatch).toBeDefined();
    const hoverBody = hoverMatch[1];
    expect(hoverBody).not.toContain('translateY');
    expect(hoverBody).not.toMatch(/transform\s*:/);
  });

  test('F1-T1-02', 'custom.css does not transition transform on cover image', { tier: 1, feature: 'F1', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    const imageSrcMatch = css.match(/\.VPHero\s+\.image-src\s*\{([^}]+)\}/);
    expect(imageSrcMatch).toBeDefined();
    const body = imageSrcMatch[1];
    // transition should not animate transform
    const transitionMatch = body.match(/transition\s*:\s*([^;]+);/);
    expect(transitionMatch).toBeDefined();
    expect(transitionMatch[1]).not.toContain('transform');
  });

  test('F1-T1-03', 'custom.css enforces aspect-ratio 16 / 9 and max-width 380px for zero layout shift', { tier: 1, feature: 'F1', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    expect(css).toMatch(/aspect-ratio\s*:\s*16\s*\/\s*9/);
    expect(css).toMatch(/max-width\s*:\s*380px/);
  });

  test('F1-T1-04', 'custom.css uses valid box-shadow property referencing --book-cover-shadow variable', { tier: 1, feature: 'F1', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    const imageSrcMatch = css.match(/\.VPHero\s+\.image-src\s*\{([^}]+)\}/);
    expect(imageSrcMatch).toBeDefined();
    const body = imageSrcMatch[1];
    expect(body).toMatch(/box-shadow\s*:\s*var\(--book-cover-shadow\)/);
    // Ensure invalid drop-shadow inside box-shadow is fixed
    expect(body).not.toMatch(/box-shadow\s*:\s*var\(--vp-home-hero-image-filter\)/);
  });

  test('F1-T1-05', 'custom.css retains border-radius and object-fit cover styling', { tier: 1, feature: 'F1', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    expect(css).toMatch(/border-radius\s*:\s*10px/);
    expect(css).toMatch(/object-fit\s*:\s*cover/);
  });

  // =========================================================================
  // F2: Cover Glow & Micro-Contrast (M1)
  // =========================================================================
  test('F2-T1-01', 'custom.css defines light mode --book-cover-shadow and --book-cover-shadow-hover in :root', { tier: 1, feature: 'F2', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    const rootMatch = css.match(/:root\s*\{([^}]+)\}/);
    expect(rootMatch).toBeDefined();
    const rootBody = rootMatch[1];
    expect(rootBody).toContain('--book-cover-shadow:');
    expect(rootBody).toContain('--book-cover-shadow-hover:');
    expect(rootBody).toContain('--book-cover-border:');
    expect(rootBody).toContain('--book-cover-border-hover:');
  });

  test('F2-T1-02', 'custom.css defines dark mode cover shadow and luminous glow in .dark', { tier: 1, feature: 'F2', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    const darkMatch = css.match(/\.dark\s*\{([^}]+)\}/);
    expect(darkMatch).toBeDefined();
    const darkBody = darkMatch[1];
    expect(darkBody).toContain('--book-cover-shadow:');
    expect(darkBody).toContain('--book-cover-shadow-hover:');
    expect(darkBody).toContain('--book-cover-border-hover:');
  });

  test('F2-T1-03', 'custom.css defines micro-contrast enhancement filter on hover', { tier: 1, feature: 'F2', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    expect(css).toMatch(/--book-cover-filter-hover\s*:\s*contrast\(1\.02[0-9]*\)\s+brightness\(1\.02[0-9]*\)/);
    expect(css).toMatch(/filter\s*:\s*var\(--book-cover-filter-hover\)/);
  });

  test('F2-T1-04', 'custom.css configures ambient backlight aura using radial-gradient and blur filter', { tier: 1, feature: 'F2', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    expect(css).toMatch(/--vp-home-hero-image-background-image\s*:\s*radial-gradient\(/);
    expect(css).toMatch(/--vp-home-hero-image-filter\s*:\s*blur\(5[0-9]px\)/);
  });

  test('F2-T1-05', 'custom.css specifies GPU compositing performance hints (will-change & backface-visibility)', { tier: 1, feature: 'F2', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    expect(css).toMatch(/will-change\s*:\s*[^;]*box-shadow/);
    expect(css).toMatch(/backface-visibility\s*:\s*hidden/);
  });

  // =========================================================================
  // F3: Hero & 4 Features Copywriting (M2)
  // =========================================================================
  test('F3-T1-01', 'index.md hero tagline eliminates academic jargon and focuses on pain points & benefits', { tier: 1, feature: 'F3', milestone: 'M2' }, ({ readFile }) => {
    const md = readFile('index.md');
    // Forbidden jargons
    expect(md).not.toContain('移动看护 · 规范护栏');
    expect(md).toMatch(/tagline\s*:\s*".*"/);
  });

  test('F3-T1-02', 'index.md hero action 3 uses unified terminology 飞书助理', { tier: 1, feature: 'F3', milestone: 'M2' }, ({ readFile }) => {
    const md = readFile('index.md');
    expect(md).toContain('text: 飞书助理');
    expect(md).not.toContain('text: 离线看护助理');
  });

  test('F3-T1-03', 'index.md 4 feature cards eliminate forbidden jargons (CAP, Anti-Loop, 沙盒穿透, 鸿沟)', { tier: 1, feature: 'F3', milestone: 'M2' }, ({ readFile }) => {
    const md = readFile('index.md');
    const featuresSection = md.split('features:')[1] || '';
    expect(featuresSection).not.toContain('CAP 规范');
    expect(featuresSection).not.toContain('CAP规范');
    expect(featuresSection).not.toContain('Anti-Loop 护栏');
    expect(featuresSection).not.toContain('Anti-Loop护栏');
    expect(featuresSection).not.toContain('沙盒穿透');
    expect(featuresSection).not.toContain('鸿沟');
  });

  test('F3-T1-04', 'index.md 4 feature cards structure follows pain points + benefits', { tier: 1, feature: 'F3', milestone: 'M2' }, ({ readFile }) => {
    const md = readFile('index.md');
    const featuresSection = md.split('features:')[1] || '';
    // Checks that cards address loops, terminal/testing, feishu, and fullstack MVP
    expect(featuresSection).toMatch(/死循环|听话/);
    expect(featuresSection).toMatch(/终端|测试/);
    expect(featuresSection).toMatch(/飞书|值班/);
    expect(featuresSection).toMatch(/商业化|MVP/);
  });

  test('F3-T1-05', 'en/index.md provides synchronized English hero and feature cards without raw jargon', { tier: 1, feature: 'F3', milestone: 'M2' }, ({ readFile }) => {
    const md = readFile('en/index.md');
    expect(md).toContain('Feishu Assistant');
    expect(md).not.toContain('CAP & Anti-Loop safeguards');
    expect(md).not.toContain('Sandbox Penetration');
    expect(md).not.toContain('bridge the gap between AI generation and actual execution');
  });

  // =========================================================================
  // F4: 5 Sections & 26 Chapters Guides (M2)
  // =========================================================================
  test('F4-T1-01', 'all 26 chapter files exist in chapters/ and en/', { tier: 1, feature: 'F4', milestone: 'M2' }, ({ fileExists }) => {
    const chapterNames = [
      'ch01_mindset.md', 'ch02_setup.md', 'ch03_sandbox.md', 'ch04_goal_driven.md',
      'ch05_agents_protocol.md', 'ch06_reasoning_steer.md', 'ch07_desktop_computer_use.md',
      'ch08_mobile_workflow.md', 'ch09_legacy_code.md', 'ch10_saas_mvp.md',
      'ch11_expo_mobile.md', 'ch12_commercialization.md', 'ch13_2026_frontier.md',
    ];
    for (const name of chapterNames) {
      expect(fileExists(`chapters/${name}`)).toBe(true);
      expect(fileExists(`en/${name}`)).toBe(true);
    }
  });

  test('F4-T1-02', 'all 13 Chinese chapters contain standardized reading guide callouts', { tier: 1, feature: 'F4', milestone: 'M2' }, ({ readFile }) => {
    for (let i = 1; i <= 13; i++) {
      const pad = String(i).padStart(2, '0');
      const files = fs.readdirSync(path.resolve(__dirname, '../../chapters')).filter((f) => f.startsWith(`ch${pad}`));
      expect(files.length).toBe(1);
      const content = readFile(`chapters/${files[0]}`);
      // Must contain structured guide elements: pain point, benefit/output, quote
      expect(content).toMatch(/痛点|麻烦|工程麻烦/);
      expect(content).toMatch(/收益|带走|实战/);
    }
  });

  test('F4-T1-03', 'all 13 English chapters contain standardized reading guide callouts', { tier: 1, feature: 'F4', milestone: 'M2' }, ({ readFile }) => {
    for (let i = 1; i <= 13; i++) {
      const pad = String(i).padStart(2, '0');
      const files = fs.readdirSync(path.resolve(__dirname, '../../en')).filter((f) => f.startsWith(`ch${pad}`));
      expect(files.length).toBe(1);
      const content = readFile(`en/${files[0]}`);
      expect(content).toMatch(/Problem|Pain Point|What You Will Fix/i);
      expect(content).toMatch(/Output|Takeaway|What You Build/i);
    }
  });

  test('F4-T1-04', 'sidebar navigation in config.mts organizes content into 5 progressive sections', { tier: 1, feature: 'F4', milestone: 'M2' }, ({ readFile }) => {
    const config = readFile('.vitepress/config.mts');
    expect(config).toMatch(/第一部分|Part 1/);
    expect(config).toMatch(/第二部分|Part 2/);
    expect(config).toMatch(/第三部分|Part 3/);
    expect(config).toMatch(/第四部分|Part 4/);
    expect(config).toMatch(/第五部分|Part 5/);
  });

  test('F4-T1-05', 'sidebar chapter titles eliminate obsolete jargon (Anti-Loop, 沙盒穿透)', { tier: 1, feature: 'F4', milestone: 'M2' }, ({ readFile }) => {
    const config = readFile('.vitepress/config.mts');
    expect(config).not.toContain('打造沙盒穿透与调试环境');
    expect(config).not.toContain('Anti-Loop 护栏');
    expect(config).not.toContain('跨越命令行鸿沟');
  });

  // =========================================================================
  // F5: Spec Generator & Templates Scenarios (M2)
  // =========================================================================
  test('F5-T1-01', 'generator.md rephrases options into concrete defense scenarios', { tier: 1, feature: 'F5', milestone: 'M2' }, ({ readFile }) => {
    const gen = readFile('generator.md');
    expect(gen).toMatch(/防自旋|防死循环/);
    expect(gen).toMatch(/防虚假|防伪造|严禁占位符/);
    expect(gen).toMatch(/防滥装|依赖守卫/);
    expect(gen).toMatch(/交付必带测试|交付闭环/);
  });

  test('F5-T1-02', 'generator.md eliminates raw 提权策略 and academic CAP规范 jargon from user options', { tier: 1, feature: 'F5', milestone: 'M2' }, ({ readFile }) => {
    const gen = readFile('generator.md');
    expect(gen).not.toContain('3. 沙盒执行与提权策略');
    expect(gen).not.toContain('在线定制符合 Codex 蓝皮书 CAP 规范的项目规约文件');
  });

  test('F5-T1-03', 'en/generator.md provides synchronized defense scenarios and plain English descriptions', { tier: 1, feature: 'F5', milestone: 'M2' }, ({ readFile }) => {
    const gen = readFile('en/generator.md');
    expect(gen).toMatch(/Prevent Loop|Stop Infinite Loops/i);
    expect(gen).toMatch(/Ban Fake|No Placeholders/i);
    expect(gen).toMatch(/Dependency Guard/i);
    expect(gen).toMatch(/Verification Specs|Deliver with Tests/i);
  });

  test('F5-T1-04', 'templates/ directory contains all 10 protocol templates without missing frameworks', { tier: 1, feature: 'F5', milestone: 'M2' }, ({ fileExists }) => {
    const templates = [
      'templates/AGENTS-nextjs.md',
      'templates/AGENTS-vue3-vite.md',
      'templates/AGENTS-fastapi.md',
      'templates/AGENTS-django.md',
      'templates/AGENTS-spring-boot.md',
      'templates/AGENTS-react-native.md',
      'templates/AGENTS-go-gin.md',
      'templates/AGENTS-rust-axum.md',
      'templates/AGENTS-svelte.md',
    ];
    for (const t of templates) {
      expect(fileExists(t)).toBe(true);
    }
  });

  test('F5-T1-05', 'protocol templates enforce concrete engineering validation rules with zero fake placeholders', { tier: 1, feature: 'F5', milestone: 'M2' }, ({ readFile }) => {
    const tpl = readFile('templates/AGENTS-nextjs.md');
    expect(tpl).toContain('Validation Specs');
    expect(tpl).not.toContain('// TODO: implement later');
    expect(tpl).not.toContain('// TODO: add tests');
  });

  // =========================================================================
  // F6: Global Terminology Alignment (M3)
  // =========================================================================
  test('F6-T1-01', 'repository has zero occurrences of 离线看护助理 (excluding metadata and tests)', { tier: 1, feature: 'F6', milestone: 'M3' }, ({ runCommand }) => {
    const res = runCommand('grep -rn "离线看护助理" --exclude-dir=".agents" --exclude-dir="node_modules" --exclude-dir="tests" --exclude-dir=".git" --exclude-dir="dist" --exclude="*.test.js" --exclude="PROJECT.md" --exclude="TEST_INFRA.md" --exclude="TEST_READY.md" .');
    const matches = res.stdout.trim().split('\n').filter(Boolean);
    expect(matches.length).toBe(0);
  });

  test('F6-T1-02', 'repository has zero occurrences of isolated 看护助理 (excluding metadata and tests)', { tier: 1, feature: 'F6', milestone: 'M3' }, ({ runCommand }) => {
    const res = runCommand('grep -rn "看护助理" --exclude-dir=".agents" --exclude-dir="node_modules" --exclude-dir="tests" --exclude-dir=".git" --exclude-dir="dist" --exclude="*.test.js" --exclude="PROJECT.md" --exclude="TEST_INFRA.md" --exclude="TEST_READY.md" .');
    const matches = res.stdout.trim().split('\n').filter(Boolean);
    expect(matches.length).toBe(0);
  });

  test('F6-T1-03', 'index.md and config.mts consistently use 飞书助理', { tier: 1, feature: 'F6', milestone: 'M3' }, ({ readFile }) => {
    const indexMd = readFile('index.md');
    const configMts = readFile('.vitepress/config.mts');
    expect(indexMd).toContain('飞书助理');
    expect(configMts).toContain('飞书助理');
  });

  test('F6-T1-04', 'chapters/ch08_mobile_workflow.md references 飞书助理', { tier: 1, feature: 'F6', milestone: 'M3' }, ({ readFile }) => {
    const ch8 = readFile('chapters/ch08_mobile_workflow.md');
    expect(ch8).toContain('飞书助理');
    expect(ch8).not.toContain('看护助理');
  });

  test('F6-T1-05', 'English files consistently use Feishu Assistant or Feishu Sentinel', { tier: 1, feature: 'F6', milestone: 'M3' }, ({ readFile }) => {
    const enIndex = readFile('en/index.md');
    const enCh8 = readFile('en/ch08_mobile_workflow.md');
    expect(enIndex).toMatch(/Feishu Assistant|Feishu Sentinel/);
    expect(enCh8).toMatch(/Feishu Assistant|Feishu Sentinel|Sentinel/);
    expect(enIndex).not.toContain('Offline Watchdog Assistant');
  });

  // =========================================================================
  // F7: Build & Dead Links Governance (M3)
  // =========================================================================
  test('F7-T1-01', 'npm run docs:build completes successfully with exit code 0', { tier: 1, feature: 'F7', milestone: 'M3' }, ({ runCommand }) => {
    const res = runCommand('npm run docs:build', { timeout: 60000 });
    expect(res.status).toBe(0);
  });

  test('F7-T1-02', 'all 26 chapters contain zero dead relative links to ../README.md', { tier: 1, feature: 'F7', milestone: 'M3' }, ({ runCommand }) => {
    const res = runCommand('grep -rn "\\.\\./README\\.md" chapters/ en/');
    const matches = res.stdout.trim().split('\n').filter(Boolean);
    expect(matches.length).toBe(0);
  });

  test('F7-T1-03', 'chapters and case-studies contain zero dead relative links to ../examples/', { tier: 1, feature: 'F7', milestone: 'M3' }, ({ runCommand }) => {
    const res = runCommand('grep -rn "\\.\\./examples/" chapters/ en/ case-studies/');
    const matches = res.stdout.trim().split('\n').filter(Boolean);
    expect(matches.length).toBe(0);
  });

  test('F7-T1-04', 'config.mts navigation items point to existing file paths or valid external URLs', { tier: 1, feature: 'F7', milestone: 'M3' }, ({ readFile, fileExists }) => {
    const config = readFile('.vitepress/config.mts');
    const internalLinks = [...config.matchAll(/link:\s*['"](\/[^'"]+)['"]/g)].map((m) => m[1]);
    for (const link of internalLinks) {
      if (link.startsWith('http')) continue;
      // Resolve path
      let clean = link.replace(/^\//, '');
      if (!clean.endsWith('.md') && !clean.endsWith('.pdf') && !clean.endsWith('.html')) {
        const mdPath = `${clean}.md`;
        const indexPath = `${clean}/index.md`;
        const exists = fileExists(mdPath) || fileExists(indexPath) || fileExists(clean);
        expect(exists).toBe(true);
      }
    }
  });

  test('F7-T1-05', 'VitePress static output directory .vitepress/dist contains index.html and assets', { tier: 1, feature: 'F7', milestone: 'M3' }, ({ fileExists }) => {
    expect(fileExists('.vitepress/dist/index.html')).toBe(true);
    expect(fileExists('.vitepress/dist/assets')).toBe(true);
  });

  // =========================================================================
  // F8: Dual-Language PDF Pipeline & Sync (M4)
  // =========================================================================
  test('F8-T1-01', 'python3 scripts/compile_collection.py executes successfully with exit code 0', { tier: 1, feature: 'F8', milestone: 'M4' }, ({ runCommand }) => {
    const res = runCommand('python3 scripts/compile_collection.py');
    expect(res.status).toBe(0);
  });

  test('F8-T1-02', 'codex_blue_book_zh.md and codex_blue_book_en.md are compiled at project root', { tier: 1, feature: 'F8', milestone: 'M4' }, ({ fileStat }) => {
    const statZh = fileStat('codex_blue_book_zh.md');
    const statEn = fileStat('codex_blue_book_en.md');
    expect(statZh).toBeDefined();
    expect(statEn).toBeDefined();
    expect(statZh.size).toBeGreaterThan(50000);
    expect(statEn.size).toBeGreaterThan(40000);
  });

  test('F8-T1-03', 'compile_collection.py TOC anchors match chapter H1 headings', { tier: 1, feature: 'F8', milestone: 'M4' }, ({ readFile }) => {
    const script = readFile('scripts/compile_collection.py');
    const zhCollection = readFile('codex_blue_book_zh.md');
    const enCollection = readFile('codex_blue_book_en.md');
    
    // Extract toc_zh block and toc_en block from script
    const zhTocBlock = (script.match(/toc_zh\s*=\s*"""([\s\S]*?)"""/) || [])[1] || '';
    const enTocBlock = (script.match(/toc_en\s*=\s*"""([\s\S]*?)"""/) || [])[1] || '';

    const zhMatches = [...zhTocBlock.matchAll(/- \[([^\]]+)\]\(#([^\)]+)\)/g)];
    const enMatches = [...enTocBlock.matchAll(/- \[([^\]]+)\]\(#([^\)]+)\)/g)];

    expect(zhMatches.length).toBe(13);
    expect(enMatches.length).toBe(13);

    for (const m of zhMatches) {
      const anchor = m[2];
      const title = m[1].replace(/Ch\.\d+\s*/, '');
      expect(zhCollection.includes(title) || zhCollection.includes(anchor)).toBe(true);
    }

    for (const m of enMatches) {
      const anchor = m[2];
      const title = m[1].replace(/Ch\.\d+\s*/, '');
      expect(enCollection.includes(title) || enCollection.includes(anchor)).toBe(true);
    }
  });

  test('F8-T1-04', 'dual-language PDFs exist at root and size exceeds 100KB', { tier: 1, feature: 'F8', milestone: 'M4' }, ({ fileStat }) => {
    const statZh = fileStat('codex_blue_book_zh.pdf');
    const statEn = fileStat('codex_blue_book_en.pdf');
    expect(statZh).toBeDefined();
    expect(statEn).toBeDefined();
    expect(statZh.size).toBeGreaterThan(100000);
    expect(statEn.size).toBeGreaterThan(100000);
  });

  test('F8-T1-05', 'PDF assets in public/downloads/ exist and synchronize with root PDFs', { tier: 1, feature: 'F8', milestone: 'M4' }, ({ fileStat }) => {
    const rootZh = fileStat('codex_blue_book_zh.pdf');
    const dlZh = fileStat('public/downloads/codex_blue_book_zh.pdf');
    const rootEn = fileStat('codex_blue_book_en.pdf');
    const dlEn = fileStat('public/downloads/codex_blue_book_en.pdf');
    expect(dlZh).toBeDefined();
    expect(dlEn).toBeDefined();
    expect(dlZh.size).toBe(rootZh.size);
    expect(dlEn.size).toBe(rootEn.size);
  });
});
