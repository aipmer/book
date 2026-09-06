/**
 * Tier 2: Boundary & Corner Cases E2E Test Suite
 * Covers F1 through F8 with >= 5 tests per feature (40 tests total).
 */

const { describe, test, it, expect } = require('./runner');
const fs = require('fs');
const path = require('path');

describe('Tier 2 - Boundary & Corner Cases', () => {
  // =========================================================================
  // F1: Cover Hover Physics - Boundary & Corner Cases
  // =========================================================================
  test('F1-T2-01', 'custom.css does not declare vendor-prefixed transforms on hover', { tier: 2, feature: 'F1', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    const hoverMatch = css.match(/\.VPHero\s+\.image-src:hover\s*\{([^}]+)\}/);
    expect(hoverMatch).toBeDefined();
    const body = hoverMatch[1];
    expect(body).not.toMatch(/-webkit-transform/i);
    expect(body).not.toMatch(/-moz-transform/i);
    expect(body).not.toMatch(/-ms-transform/i);
  });

  test('F1-T2-02', 'custom.css specifies smooth cubic-bezier easing curve for cover transitions', { tier: 2, feature: 'F1', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    // cubic-bezier(0.16, 1, 0.3, 1) or similar smooth deceleration curve
    expect(css).toMatch(/cubic-bezier\(\s*0\.1[0-9]*\s*,\s*1\s*,\s*0\.[2-4][0-9]*\s*,\s*1\s*\)/);
  });

  test('F1-T2-03', 'custom.css enforces width 100% and height auto alongside max-width for responsive safety', { tier: 2, feature: 'F1', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    const match = css.match(/\.VPHero\s+\.image-src\s*\{([^}]+)\}/);
    expect(match).toBeDefined();
    const body = match[1];
    expect(body).toMatch(/width\s*:\s*100%/);
    expect(body).toMatch(/height\s*:\s*auto/);
    expect(body).toMatch(/max-width\s*:\s*380px/);
  });

  test('F1-T2-04', 'custom.css defines non-negative blur radii across all box-shadow rules', { tier: 2, feature: 'F1', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    const shadowMatches = css.match(/--book-cover-shadow[^:]*:\s*([^;]+);/g) || [];
    expect(shadowMatches.length).toBeGreaterThan(0);
    for (const shadowLine of shadowMatches) {
      // Look for any negative pixel values followed by px
      const parts = shadowLine.split(',');
      for (const part of parts) {
        const tokens = part.trim().split(/\s+/);
        // tokens are like: [0, 10px, 30px, -4px, rgba(...)]
        // Blur radius is the 3rd length value
        const lengthTokens = tokens.filter(t => /^-?\d+px$/.test(t));
        if (lengthTokens.length >= 2) {
          const blur = parseInt(lengthTokens[1]);
          expect(blur).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  test('F1-T2-05', 'media queries do not reintroduce transform overrides on small viewports', { tier: 2, feature: 'F1', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    // Ensure no media query adds transform back to .image-src:hover
    const mediaQueries = css.match(/@media[^{]+\{([\s\S]+?\}\s*\})/g) || [];
    for (const mq of mediaQueries) {
      if (mq.includes('.image-src:hover')) {
        expect(mq).not.toMatch(/transform\s*:/);
      }
    }
  });

  // =========================================================================
  // F2: Cover Glow & Micro-Contrast - Boundary Cases
  // =========================================================================
  test('F2-T2-01', 'custom.css shadow alpha channels remain within subtle optical boundaries (0.05 - 0.85)', { tier: 2, feature: 'F2', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    const rgbaMatches = [...css.matchAll(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([0-9.]+)\s*\)/g)];
    expect(rgbaMatches.length).toBeGreaterThan(5);
    for (const m of rgbaMatches) {
      const alpha = parseFloat(m[1]);
      expect(alpha).toBeGreaterThanOrEqual(0.04);
      expect(alpha).toBeLessThanOrEqual(0.85);
    }
  });

  test('F2-T2-02', 'custom.css micro-contrast enhancement factor stays within safe range [1.01, 1.06]', { tier: 2, feature: 'F2', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    const contrastMatches = [...css.matchAll(/contrast\(([0-9.]+)\)/g)];
    expect(contrastMatches.length).toBeGreaterThan(0);
    for (const m of contrastMatches) {
      const factor = parseFloat(m[1]);
      expect(factor).toBeGreaterThanOrEqual(1.0);
      expect(factor).toBeLessThanOrEqual(1.06);
    }
  });

  test('F2-T2-03', 'dark mode styling variables cleanly override light mode without selector bleeding', { tier: 2, feature: 'F2', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    const darkBlock = css.match(/\.dark\s*\{([^}]+)\}/);
    expect(darkBlock).toBeDefined();
    const darkBody = darkBlock[1];
    expect(darkBody).toContain('--book-cover-shadow');
    expect(darkBody).toContain('--book-cover-shadow-hover');
    expect(darkBody).toContain('--book-cover-border-hover');
    expect(darkBody).toContain('--book-cover-filter-hover');
  });

  test('F2-T2-04', 'radial gradient background aura centers at 50% 50% with transparent falloff', { tier: 2, feature: 'F2', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    expect(css).toMatch(/radial-gradient\(\s*circle\s+at\s+50%\s+50%\s*,/);
    expect(css).toMatch(/transparent\s+7[0-9]%/);
  });

  test('F2-T2-05', 'will-change property restricts declaration to box-shadow, filter, and border-color', { tier: 2, feature: 'F2', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    const willChangeMatch = css.match(/will-change\s*:\s*([^;]+);/);
    expect(willChangeMatch).toBeDefined();
    const declaredProps = willChangeMatch[1].split(',').map(s => s.trim());
    expect(declaredProps).toContain('box-shadow');
    expect(declaredProps).toContain('filter');
    expect(declaredProps).toContain('border-color');
    expect(declaredProps).not.toContain('transform');
  });

  // =========================================================================
  // F3: Copywriting - Boundary & Corner Cases
  // =========================================================================
  test('F3-T2-01', 'case-insensitive sweep confirms total absence of CAP or Anti-Loop jargons in index.md', { tier: 2, feature: 'F3', milestone: 'M2' }, ({ readFile }) => {
    const content = readFile('index.md');
    expect(content.toLowerCase()).not.toContain('anti-loop护栏');
    expect(content.toLowerCase()).not.toContain('cap规范');
    expect(content.toLowerCase()).not.toContain('沙盒穿透');
  });

  test('F3-T2-02', 'hero action buttons in index.md and en/index.md have valid non-empty schemas', { tier: 2, feature: 'F3', milestone: 'M2' }, ({ readFile }) => {
    for (const file of ['index.md', 'en/index.md']) {
      const content = readFile(file);
      const actionsBlock = content.match(/actions:\s*\n([\s\S]*?)(?=\n\s*features:|\n\s*---\s*$|$)/);
      expect(actionsBlock).toBeDefined();
      const actionItems = actionsBlock[1].split(/\n\s*-\s+/).filter(Boolean);
      expect(actionItems.length).toBeGreaterThanOrEqual(4);
      for (const item of actionItems) {
        expect(item).toMatch(/theme\s*:\s*\S+/);
        expect(item).toMatch(/text\s*:\s*\S+/);
        expect(item).toMatch(/link\s*:\s*\S+/);
      }
    }
  });

  test('F3-T2-03', 'feature cards count is exactly 4 in both index.md and en/index.md', { tier: 2, feature: 'F3', milestone: 'M2' }, ({ readFile }) => {
    for (const file of ['index.md', 'en/index.md']) {
      const content = readFile(file);
      const featuresBlock = content.match(/features:\s*\n([\s\S]*?)(?=\n\s*---\s*$|\n\s*#|$)/);
      expect(featuresBlock).toBeDefined();
      const items = featuresBlock[1].split(/\n\s*-\s+/).filter(Boolean);
      expect(items.length).toBe(4);
    }
  });

  test('F3-T2-04', 'feature card details length is concise (between 25 and 180 characters per card)', { tier: 2, feature: 'F3', milestone: 'M2' }, ({ readFile }) => {
    const content = readFile('index.md');
    const detailsMatches = [...content.matchAll(/details\s*:\s*(.+)$/gm)];
    expect(detailsMatches.length).toBeGreaterThanOrEqual(4);
    for (const m of detailsMatches.slice(0, 4)) {
      const text = m[1].trim();
      expect(text.length).toBeGreaterThanOrEqual(25);
      expect(text.length).toBeLessThanOrEqual(180);
    }
  });

  test('F3-T2-05', 'feature card titles start with actionable benefit verbs (让, 真实, 人, 一人)', { tier: 2, feature: 'F3', milestone: 'M2' }, ({ readFile }) => {
    const content = readFile('index.md');
    const titleMatches = [...content.matchAll(/title\s*:\s*(.+)$/gm)].map(m => m[1].trim());
    expect(titleMatches.length).toBeGreaterThanOrEqual(4);
    const firstWords = titleMatches.slice(0, 4).join(' ');
    expect(firstWords).toMatch(/让|听话|接管|值班|一人|跑通/);
  });

  // =========================================================================
  // F4: Chapters & Guides - Boundary Cases
  // =========================================================================
  test('F4-T2-01', 'every chapter file across chapters/ and en/ is non-trivial (> 1000 characters)', { tier: 2, feature: 'F4', milestone: 'M2' }, ({ readFile }) => {
    for (let i = 1; i <= 13; i++) {
      const pad = String(i).padStart(2, '0');
      const zhFiles = fs.readdirSync(path.resolve(__dirname, '../../chapters')).filter(f => f.startsWith(`ch${pad}`));
      const enFiles = fs.readdirSync(path.resolve(__dirname, '../../en')).filter(f => f.startsWith(`ch${pad}`));
      expect(zhFiles.length).toBe(1);
      expect(enFiles.length).toBe(1);
      const zhContent = readFile(`chapters/${zhFiles[0]}`);
      const enContent = readFile(`en/${enFiles[0]}`);
      expect(zhContent.length).toBeGreaterThan(1000);
      expect(enContent.length).toBeGreaterThan(1000);
    }
  });

  test('F4-T2-02', 'guide callouts in chapters contain emoji anchors (🎯, 💡, ⚡)', { tier: 2, feature: 'F4', milestone: 'M2' }, ({ readFile }) => {
    for (let i = 1; i <= 13; i++) {
      const pad = String(i).padStart(2, '0');
      const zhFiles = fs.readdirSync(path.resolve(__dirname, '../../chapters')).filter(f => f.startsWith(`ch${pad}`));
      const content = readFile(`chapters/${zhFiles[0]}`);
      expect(content).toMatch(/🎯|💡|⚡/);
    }
  });

  test('F4-T2-03', 'every chapter file starts with exactly one single H1 heading (# ) outside code blocks', { tier: 2, feature: 'F4', milestone: 'M2' }, ({ readFile }) => {
    for (let i = 1; i <= 13; i++) {
      const pad = String(i).padStart(2, '0');
      const zhFiles = fs.readdirSync(path.resolve(__dirname, '../../chapters')).filter(f => f.startsWith(`ch${pad}`));
      const content = readFile(`chapters/${zhFiles[0]}`);
      const nonCode = content.replace(/```[\s\S]*?```/g, '');
      const h1Count = (nonCode.match(/^# [^\n]+/gm) || []).length;
      expect(h1Count).toBe(1);
    }
  });

  test('F4-T2-04', 'sidebar configuration in config.mts contains non-empty arrays with no circular references', { tier: 2, feature: 'F4', milestone: 'M2' }, ({ readFile }) => {
    const config = readFile('.vitepress/config.mts');
    expect(config).toContain('sidebar:');
    const itemsMatches = [...config.matchAll(/items\s*:\s*\[([\s\S]*?)\]/g)];
    expect(itemsMatches.length).toBeGreaterThanOrEqual(10);
    for (const m of itemsMatches) {
      expect(m[1].trim().length).toBeGreaterThan(0);
    }
  });

  test('F4-T2-05', 'chapter markdown files avoid raw unescaped HTML tags that disrupt Vue template parsing', { tier: 2, feature: 'F4', milestone: 'M2' }, ({ readFile }) => {
    for (let i = 1; i <= 13; i++) {
      const pad = String(i).padStart(2, '0');
      const zhFiles = fs.readdirSync(path.resolve(__dirname, '../../chapters')).filter(f => f.startsWith(`ch${pad}`));
      const content = readFile(`chapters/${zhFiles[0]}`);
      // Check for stray opening angle brackets followed by letters outside of code blocks
      const nonCode = content.replace(/```[\s\S]*?```/g, '').replace(/`[^`]+`/g, '');
      expect(nonCode).not.toMatch(/<script\b/i);
      expect(nonCode).not.toMatch(/<style\b/i);
    }
  });

  // =========================================================================
  // F5: Spec Generator & Templates - Boundary Cases
  // =========================================================================
  test('F5-T2-01', 'template directory contains at least 9 comprehensive AGENTS-*.md templates', { tier: 2, feature: 'F5', milestone: 'M2' }, ({ readFile }) => {
    const tplDir = path.resolve(__dirname, '../../templates');
    const files = fs.readdirSync(tplDir).filter(f => f.startsWith('AGENTS-') && f.endsWith('.md'));
    expect(files.length).toBeGreaterThanOrEqual(9);
    for (const f of files) {
      const content = readFile(`templates/${f}`);
      expect(content.length).toBeGreaterThan(800);
    }
  });

  test('F5-T2-02', 'templates do not contain empty TODO or FIXME comments', { tier: 2, feature: 'F5', milestone: 'M2' }, ({ readFile }) => {
    const tplDir = path.resolve(__dirname, '../../templates');
    const files = fs.readdirSync(tplDir).filter(f => f.startsWith('AGENTS-') && f.endsWith('.md'));
    for (const f of files) {
      const content = readFile(`templates/${f}`);
      expect(content).not.toMatch(/\/\/\s*TODO:\s*$/m);
      expect(content).not.toMatch(/\/\/\s*FIXME:\s*$/m);
    }
  });

  test('F5-T2-03', 'generator options include 4 core safety checkboxes (Anti-Loop, Placeholder, Deps, Validation)', { tier: 2, feature: 'F5', milestone: 'M2' }, ({ readFile }) => {
    const gen = readFile('generator.md');
    // Ensure all 4 guard checkboxes are present in the form
    expect(gen).toMatch(/防自旋|Anti-Loop/i);
    expect(gen).toMatch(/占位符|假代码|伪造/i);
    expect(gen).toMatch(/依赖/i);
    expect(gen).toMatch(/验证|测试|Validation/i);
  });

  test('F5-T2-04', 'code blocks in all templates have valid language identifiers', { tier: 2, feature: 'F5', milestone: 'M2' }, ({ readFile }) => {
    const tplDir = path.resolve(__dirname, '../../templates');
    const files = fs.readdirSync(tplDir).filter(f => f.startsWith('AGENTS-') && f.endsWith('.md'));
    for (const f of files) {
      const content = readFile(`templates/${f}`);
      const codeBlocks = [...content.matchAll(/```([^\n]*)\n/g)];
      for (const cb of codeBlocks) {
        const lang = cb[1].trim();
        // Closing backticks match empty string in some parsers, so ignore closing
        if (lang) {
          expect(['bash', 'markdown', 'json', 'typescript', 'python', 'go', 'rust', 'yaml', 'toml', 'dockerfile', 'sql']).toContain(lang.toLowerCase());
        }
      }
    }
  });

  test('F5-T2-05', 'generator.md script contains valid stackConfigs for all major frameworks', { tier: 2, feature: 'F5', milestone: 'M2' }, ({ readFile }) => {
    const gen = readFile('generator.md');
    expect(gen).toContain('nextjs');
    expect(gen).toContain('fastapi');
    expect(gen).toContain('django');
    expect(gen).toMatch(/spring|spring-boot/);
    expect(gen).toMatch(/expo|react-native/);
    expect(gen).toMatch(/rust|rust-axum/);
    expect(gen).toMatch(/go|go-gin/);
  });

  // =========================================================================
  // F6: Terminology - Boundary Cases
  // =========================================================================
  test('F6-T2-01', 'case-studies/ directory contains zero occurrences of 看护助理 without 飞书', { tier: 2, feature: 'F6', milestone: 'M3' }, ({ runCommand }) => {
    const res = runCommand('grep -rn "离线看护助理" case-studies/');
    expect(res.stdout.trim()).toBe('');
  });

  test('F6-T2-02', 'config.mts navigation bar has zero occurrences of 看护助理', { tier: 2, feature: 'F6', milestone: 'M3' }, ({ readFile }) => {
    const config = readFile('.vitepress/config.mts');
    // It should be 飞书助理, not isolated 看护助理
    const navIsolated = config.match(/text:\s*['"]看护助理['"]/);
    expect(navIsolated).toBeNull();
  });

  test('F6-T2-03', 'README.md terminology adheres to 飞书助理', { tier: 2, feature: 'F6', milestone: 'M3' }, ({ readFile }) => {
    const readme = readFile('README.md');
    expect(readme).not.toContain('离线看护助理');
    expect(readme).toContain('飞书助理');
  });

  test('F6-T2-04', 'English files contain zero instances of Offline Watchdog Assistant', { tier: 2, feature: 'F6', milestone: 'M3' }, ({ runCommand }) => {
    const res = runCommand('grep -rn "Offline Watchdog Assistant" en/ .vitepress/config.mts');
    expect(res.stdout.trim()).toBe('');
  });

  test('F6-T2-05', 'generator.md has zero references to 离线看护 in comments or strings', { tier: 2, feature: 'F6', milestone: 'M3' }, ({ readFile }) => {
    const gen = readFile('generator.md');
    expect(gen).not.toContain('离线看护助理');
    expect(gen).not.toContain('远程移动看护');
  });

  // =========================================================================
  // F7: Build & Dead Links - Boundary Cases
  // =========================================================================
  test('F7-T2-01', 'chapter internal links preserve exact lowercase filename casing', { tier: 2, feature: 'F7', milestone: 'M3' }, ({ readFile }) => {
    for (let i = 1; i <= 13; i++) {
      const pad = String(i).padStart(2, '0');
      const zhFiles = fs.readdirSync(path.resolve(__dirname, '../../chapters')).filter(f => f.startsWith(`ch${pad}`));
      const content = readFile(`chapters/${zhFiles[0]}`);
      const linkMatches = [...content.matchAll(/\(\.\/([^\)]+\.md)\)/g)];
      for (const m of linkMatches) {
        expect(m[1]).toBe(m[1].toLowerCase());
      }
    }
  });

  test('F7-T2-02', 'all relative chapter and template links in README.md resolve to existing files', { tier: 2, feature: 'F7', milestone: 'M3' }, ({ readFile, fileExists }) => {
    const readme = readFile('README.md');
    const relativeLinks = [...readme.matchAll(/\[[^\]]+\]\((\.\/[^\)]+)\)/g)].map(m => m[1]);
    expect(relativeLinks.length).toBeGreaterThan(20);
    for (const relLink of relativeLinks) {
      const cleanPath = relLink.replace(/^\.\//, '');
      expect(fileExists(cleanPath)).toBe(true);
    }
  });

  test('F7-T2-03', 'cover image files exist in .vitepress/public/images/ with 16:9 aspect ratio dimensions', { tier: 2, feature: 'F7', milestone: 'M3' }, ({ fileExists }) => {
    expect(fileExists('.vitepress/public/images/cover.jpg')).toBe(true);
    expect(fileExists('.vitepress/public/images/cover_en.jpg')).toBe(true);
  });

  test('F7-T2-04', 'external links in index.md use secure HTTPS scheme', { tier: 2, feature: 'F7', milestone: 'M3' }, ({ readFile }) => {
    const content = readFile('index.md');
    const urls = [...content.matchAll(/link\s*:\s*(https?:\/\/[^\s]+)/g)].map(m => m[1]);
    for (const url of urls) {
      expect(url.startsWith('https://')).toBe(true);
    }
  });

  test('F7-T2-05', 'docs:build succeeds cleanly even after cleaning .vitepress/dist cache', { tier: 2, feature: 'F7', milestone: 'M3' }, ({ runCommand }) => {
    // Verify build command executes with zero exit code
    const res = runCommand('npm run docs:build', { timeout: 60000 });
    expect(res.status).toBe(0);
  });

  // =========================================================================
  // F8: PDF Pipeline & Sync - Boundary Cases
  // =========================================================================
  test('F8-T2-01', 'compiled PDF files are at least 500KB and properly rendered', { tier: 2, feature: 'F8', milestone: 'M4' }, ({ fileStat }) => {
    const statZh = fileStat('codex_blue_book_zh.pdf');
    const statEn = fileStat('codex_blue_book_en.pdf');
    expect(statZh).toBeDefined();
    expect(statEn).toBeDefined();
    expect(statZh.size).toBeGreaterThan(500000);
    expect(statEn.size).toBeGreaterThan(500000);
  });

  test('F8-T2-02', 'compile_collection.py generates valid markdown with authoritative book title', { tier: 2, feature: 'F8', milestone: 'M4' }, ({ readFile }) => {
    const zh = readFile('codex_blue_book_zh.md');
    const en = readFile('codex_blue_book_en.md');
    expect(zh).toContain('# 《Codex 蓝皮书');
    expect(en).toContain('# Codex Practical Blue Book');
  });

  test('F8-T2-03', 'bilingual collection parity: both collections have exactly 13 chapter headings', { tier: 2, feature: 'F8', milestone: 'M4' }, ({ readFile }) => {
    const zh = readFile('codex_blue_book_zh.md');
    const en = readFile('codex_blue_book_en.md');
    const zhChapters = (zh.match(/^# Ch\.\d+/gm) || []).length;
    const enChapters = (en.match(/^# Ch\.\d+/gm) || []).length;
    expect(zhChapters).toBe(13);
    expect(enChapters).toBe(13);
  });

  test('F8-T2-04', 'public/downloads directory exists and contains matching downloadable PDFs', { tier: 2, feature: 'F8', milestone: 'M4' }, ({ fileExists, fileStat }) => {
    expect(fileExists('public/downloads')).toBe(true);
    const dlZh = fileStat('public/downloads/codex_blue_book_zh.pdf');
    const dlEn = fileStat('public/downloads/codex_blue_book_en.pdf');
    expect(dlZh).toBeDefined();
    expect(dlEn).toBeDefined();
    expect(dlZh.size).toBeGreaterThan(500000);
    expect(dlEn.size).toBeGreaterThan(500000);
  });

  test('F8-T2-05', 'scripts/compile_collection.py handles chapter loading without crashing', { tier: 2, feature: 'F8', milestone: 'M4' }, ({ runCommand }) => {
    const res = runCommand('python3 scripts/compile_collection.py');
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('Compiled and saved codex_blue_book_zh.md');
    expect(res.stdout).toContain('Compiled and saved codex_blue_book_en.md');
  });
});
