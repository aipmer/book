/**
 * Tier 4: Real-World Scenarios E2E Test Suite
 * Covers end-to-end reader and builder workflows (6 tests total).
 */

const { describe, test, it, expect } = require('./runner');
const fs = require('fs');
const path = require('path');

describe('Tier 4 - Real-World Scenarios', () => {
  test('T4-01', 'Reader Journey: Homepage -> Ch.01 Mindset -> Ch.08 Feishu Assistant navigation flow', { tier: 4, feature: 'F3,F4,F6,F7', milestone: 'M2,M3' }, ({ readFile, fileExists }) => {
    // 1. Visit homepage
    const indexMd = readFile('index.md');
    expect(indexMd).toContain('/chapters/ch01_mindset');

    // 2. Open Ch.01
    expect(fileExists('chapters/ch01_mindset.md')).toBe(true);
    const ch01 = readFile('chapters/ch01_mindset.md');
    // Verify structured guide
    expect(ch01).toMatch(/痛点|麻烦/);
    expect(ch01).toMatch(/收益|代码/);

    // 3. Follow journey to Ch.08
    expect(fileExists('chapters/ch08_mobile_workflow.md')).toBe(true);
    const ch08 = readFile('chapters/ch08_mobile_workflow.md');
    expect(ch08).toContain('飞书助理');
    expect(ch08).not.toContain('离线看护助理');
  });

  test('T4-02', 'Indie Hacker Journey: Online spec generator defense options and AGENTS.md generation', { tier: 4, feature: 'F5,F6', milestone: 'M2,M3' }, ({ readFile }) => {
    const generator = readFile('generator.md');
    // Ensure all 4 essential defense checks are present
    expect(generator).toMatch(/防自旋|Anti-Loop/);
    expect(generator).toMatch(/防虚假|占位符/);
    expect(generator).toMatch(/依赖/);
    expect(generator).toMatch(/测试|验证/);
    // Ensure template generation script exists
    expect(generator).toMatch(/<script setup/);
    expect(generator).toContain('stackConfigs');
  });

  test('T4-03', 'Full-Cycle Build & Asset Sync Workflow: compile collection, sync assets, and build site', { tier: 4, feature: 'F7,F8', milestone: 'M3,M4' }, ({ runCommand, fileExists, fileStat }) => {
    // 1. Compile collection
    const compileRes = runCommand('python3 scripts/compile_collection.py');
    expect(compileRes.status).toBe(0);

    // 2. Verify collection markdown generated
    expect(fileExists('codex_blue_book_zh.md')).toBe(true);
    expect(fileExists('codex_blue_book_en.md')).toBe(true);

    // 3. Verify public/downloads assets exist
    expect(fileExists('public/downloads/codex_blue_book_zh.pdf')).toBe(true);
    expect(fileExists('public/downloads/codex_blue_book_en.pdf')).toBe(true);

    // 4. Run static site build
    const buildRes = runCommand('npm run docs:build', { timeout: 60000 });
    expect(buildRes.status).toBe(0);
    expect(fileExists('.vitepress/dist/index.html')).toBe(true);
  });

  test('T4-04', 'Mobile Reader Experience: responsive viewport, 16:9 aspect-ratio, and zero-CLS constraints', { tier: 4, feature: 'F1,F2,F4', milestone: 'M1,M2' }, ({ readFile }) => {
    const css = readFile('.vitepress/theme/custom.css');
    // Aspect ratio keeps container from collapsing before image loads
    expect(css).toMatch(/aspect-ratio\s*:\s*16\s*\/\s*9/);
    expect(css).toMatch(/width\s*:\s*100%/);
    expect(css).toMatch(/max-width\s*:\s*380px/);
    // Check config for responsive viewport or head tags
    const config = readFile('.vitepress/config.mts');
    expect(config).toContain('cleanUrls: true');
  });

  test('T4-05', 'International Reader Journey: en/ homepage to en/ chapters with Feishu Assistant terminology', { tier: 4, feature: 'F3,F4,F6', milestone: 'M2,M3' }, ({ readFile, fileExists }) => {
    const enIndex = readFile('en/index.md');
    expect(enIndex).toContain('/en/ch01_mindset');
    expect(enIndex).toContain('Feishu Assistant');
    expect(fileExists('en/ch01_mindset.md')).toBe(true);
    expect(fileExists('en/ch08_mobile_workflow.md')).toBe(true);
    const enCh08 = readFile('en/ch08_mobile_workflow.md');
    expect(enCh08).toMatch(/Feishu Assistant|Sentinel/);
  });

  test('T4-06', 'Developer Ecosystem Journey: companion examples and case studies consistency', { tier: 4, feature: 'F4,F5,F6,F7', milestone: 'M2,M3' }, ({ readFile, fileExists }) => {
    expect(fileExists('case-studies/README.md')).toBe(true);
    const caseStudiesReadme = readFile('case-studies/README.md');
    expect(caseStudiesReadme).toContain('https://github.com/aipmer/plugins-codex-feishu');
    expect(caseStudiesReadme).not.toContain('离线看护助理');
  });
});
