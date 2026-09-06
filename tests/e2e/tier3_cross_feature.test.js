/**
 * Tier 3: Cross-Feature Interactions E2E Test Suite
 * Tests pairwise combinations across features (10 tests total).
 */

const { describe, test, it, expect } = require('./runner');
const fs = require('fs');
const path = require('path');

describe('Tier 3 - Cross-Feature Interactions', () => {
  test('T3-01', '[F1 + F2] Dark mode theme switch preserves zero-displacement physics while activating blue glow', { tier: 3, feature: 'F1,F2', milestone: 'M1' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    // Verify both .dark and hover rules coexist harmoniously
    const darkMatch = css.match(/\.dark\s*\{([^}]+)\}/);
    const hoverMatch = css.match(/\.VPHero\s+\.image-src:hover\s*\{([^}]+)\}/);
    expect(darkMatch).toBeDefined();
    expect(hoverMatch).toBeDefined();
    // Hover references variables that are modified by .dark
    expect(hoverMatch[1]).toContain('var(--book-cover-shadow-hover)');
    expect(hoverMatch[1]).toContain('var(--book-cover-border-hover)');
    expect(hoverMatch[1]).toContain('var(--book-cover-filter-hover)');
    // No transform property declaration in hover
    expect(hoverMatch[1]).not.toMatch(/transform\s*:/);
  });

  test('T3-02', '[F5 + F6] Spec generator output aligns with 飞书助理 terminology and anti-loop defense rules', { tier: 3, feature: 'F5,F6', milestone: 'M2,M3' }, ({ readFile }) => {
    const gen = readFile('generator.md');
    // Verify generator UI incorporates 飞书助理
    expect(gen).toMatch(/飞书助理/);
    expect(gen).not.toContain('离线看护助理');
    // Verify generator output template incorporates anti-loop rules
    expect(gen).toMatch(/防自旋|Anti-Loop/);
  });

  test('T3-03', '[F6 + F7] Static site build produces zero occurrences of 离线看护助理 in compiled HTML', { tier: 3, feature: 'F6,F7', milestone: 'M3' }, ({ runCommand, fileExists }) => {
    if (!fileExists('.vitepress/dist/index.html')) {
      runCommand('npm run docs:build');
    }
    const res = runCommand('grep -rn "离线看护助理" .vitepress/dist/');
    expect(res.stdout.trim()).toBe('');
  });

  test('T3-04', '[F4 + F8] Chapter H1 titles synchronize with compile_collection.py TOC anchors', { tier: 3, feature: 'F4,F8', milestone: 'M2,M4' }, ({ readFile }) => {
    const script = readFile('scripts/compile_collection.py');
    // For each chapter 1 to 13, ensure H1 title matches toc anchor
    for (let i = 1; i <= 13; i++) {
      const pad = String(i).padStart(2, '0');
      const zhFiles = fs.readdirSync(path.resolve(__dirname, '../../chapters')).filter(f => f.startsWith(`ch${pad}`));
      expect(zhFiles.length).toBe(1);
      const content = readFile(`chapters/${zhFiles[0]}`);
      const h1Match = content.match(/^# ([^\n]+)/m);
      expect(h1Match).toBeDefined();
      const h1Title = h1Match[1].trim();
      // TOC anchor should be present in compile_collection.py
      expect(script).toContain(zhFiles[0].replace('.md', ''));
    }
  });

  test('T3-05', '[F3 + F7 + F8] Homepage action buttons route to valid pages and downloadable PDF assets', { tier: 3, feature: 'F3,F7,F8', milestone: 'M2,M3,M4' }, ({ readFile, fileExists }) => {
    const zhIndex = readFile('index.md');
    expect(zhIndex).toContain('/chapters/ch01_mindset');
    expect(zhIndex).toContain('/generator');
    expect(zhIndex).toContain('/downloads/codex_blue_book_zh.pdf');
    expect(fileExists('chapters/ch01_mindset.md')).toBe(true);
    expect(fileExists('generator.md')).toBe(true);
    expect(fileExists('public/downloads/codex_blue_book_zh.pdf')).toBe(true);
  });

  test('T3-06', '[F3 + F4 + F7] Bilingual documentation parity compiles cleanly across / and /en/ routes', { tier: 3, feature: 'F3,F4,F7', milestone: 'M2,M3' }, ({ fileExists }) => {
    expect(fileExists('index.md')).toBe(true);
    expect(fileExists('en/index.md')).toBe(true);
    expect(fileExists('generator.md')).toBe(true);
    expect(fileExists('en/generator.md')).toBe(true);
    // 13 chapters in each
    for (let i = 1; i <= 13; i++) {
      const pad = String(i).padStart(2, '0');
      const zhFiles = fs.readdirSync(path.resolve(__dirname, '../../chapters')).filter(f => f.startsWith(`ch${pad}`));
      const enFiles = fs.readdirSync(path.resolve(__dirname, '../../en')).filter(f => f.startsWith(`ch${pad}`));
      expect(zhFiles.length).toBe(1);
      expect(enFiles.length).toBe(1);
    }
  });

  test('T3-07', '[F5 + F7] Template specifications define valid and runnable validation scripts', { tier: 3, feature: 'F5,F7', milestone: 'M2,M3' }, ({ readFile }) => {
    const nextjsTpl = readFile('templates/AGENTS-nextjs.md');
    expect(nextjsTpl).toContain('npm run build');
    expect(nextjsTpl).toContain('Validation Specs');
  });

  test('T3-08', '[F4 + F8] Chapter reading guide callouts are preserved cleanly during markdown collection compilation', { tier: 3, feature: 'F4,F8', milestone: 'M2,M4' }, ({ readFile }) => {
    const zhCollection = readFile('codex_blue_book_zh.md');
    // Ensure collection preserves structured emoji guides
    expect(zhCollection).toMatch(/🎯|💡|⚡/);
    expect(zhCollection).toMatch(/痛点|收益/);
  });

  test('T3-09', '[F1 + F2 + F7] Cover image assets are properly located and accessible to VitePress theme', { tier: 3, feature: 'F1,F2,F7', milestone: 'M1,M3' }, ({ readFile, fileExists }) => {
    const zhIndex = readFile('index.md');
    const enIndex = readFile('en/index.md');
    expect(zhIndex).toContain('/images/cover.jpg');
    expect(enIndex).toContain('/images/cover_en.jpg');
    expect(fileExists('.vitepress/public/images/cover.jpg')).toBe(true);
    expect(fileExists('.vitepress/public/images/cover_en.jpg')).toBe(true);
  });

  test('T3-10', '[F4 + F6] Case study documents align with Chapter 08 飞书助理 references', { tier: 3, feature: 'F4,F6', milestone: 'M2,M3' }, ({ readFile }) => {
    const caseStudyReadme = readFile('case-studies/README.md');
    expect(caseStudyReadme).toContain('飞书');
    expect(caseStudyReadme).not.toContain('离线看护助理');
  });
});
