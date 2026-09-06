const fs = require('fs');
const path = require('path');
const { createMarkdownRenderer } = require('vitepress');
const { compile } = require('@vue/compiler-dom');

const ROOT_DIR = path.resolve(__dirname, '..');
const ZH_DIR = path.join(ROOT_DIR, 'chapters');
const EN_DIR = path.join(ROOT_DIR, 'en');

const CHAPTER_FILES = [
  'ch01_mindset.md',
  'ch02_setup.md',
  'ch03_sandbox.md',
  'ch04_goal_driven.md',
  'ch05_agents_protocol.md',
  'ch06_reasoning_steer.md',
  'ch07_desktop_computer_use.md',
  'ch08_mobile_workflow.md',
  'ch09_legacy_code.md',
  'ch10_saas_mvp.md',
  'ch11_expo_mobile.md',
  'ch12_commercialization.md',
  'ch13_2026_frontier.md',
];

function stripCodeBlocks(content) {
  return content.replace(/```[\s\S]*?```/g, (m) => '\n'.repeat((m.match(/\n/g) || []).length))
                .replace(/~~~[\s\S]*?~~~/g, (m) => '\n'.repeat((m.match(/\n/g) || []).length));
}

function stripInlineCode(content) {
  return content.replace(/`[^`\n]+`/g, '');
}

async function runStressTest() {
  console.log('================================================================');
  console.log('  Milestone M2 Adversarial Stress Test: All 26 Chapters');
  console.log('================================================================\n');

  let totalChecks = 0;
  let passedChecks = 0;
  let failedChecks = 0;
  const failureReports = [];

  function record(pass, name, detail) {
    totalChecks++;
    if (pass) {
      passedChecks++;
      console.log(`  ✓ [PASS] ${name}`);
    } else {
      failedChecks++;
      console.error(`  ✗ [FAIL] ${name}: ${detail}`);
      failureReports.push({ name, detail });
    }
  }

  // 1. File existence & size
  console.log('--- 1. Checking File Existence & Non-Trivial Length ---');
  for (const name of CHAPTER_FILES) {
    const zhPath = path.join(ZH_DIR, name);
    const enPath = path.join(EN_DIR, name);
    const zhExists = fs.existsSync(zhPath);
    const enExists = fs.existsSync(enPath);
    record(zhExists, `ZH file exists: chapters/${name}`, 'File not found');
    record(enExists, `EN file exists: en/${name}`, 'File not found');
    if (zhExists) {
      const len = fs.readFileSync(zhPath, 'utf8').length;
      record(len > 1500, `ZH chapters/${name} length > 1500 chars (${len} chars)`, `Only ${len} chars`);
    }
    if (enExists) {
      const len = fs.readFileSync(enPath, 'utf8').length;
      record(len > 1500, `EN en/${name} length > 1500 chars (${len} chars)`, `Only ${len} chars`);
    }
  }

  // 2. Code Fence Balance (No unclosed code fences)
  console.log('\n--- 2. Checking Code Fence Parity ---');
  for (const name of CHAPTER_FILES) {
    for (const [lang, dir] of [['ZH', ZH_DIR], ['EN', EN_DIR]]) {
      const filePath = path.join(dir, name);
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, 'utf8');
      const fences = content.match(/^```/gm) || [];
      const isEven = fences.length % 2 === 0;
      record(isEven, `Code fence parity in ${lang} ${path.basename(dir)}/${name} (${fences.length} fences)`, `Odd number of fences: ${fences.length}`);
    }
  }

  // 3. Single H1 heading check
  console.log('\n--- 3. Checking Single H1 Headings ---');
  for (const name of CHAPTER_FILES) {
    for (const [lang, dir] of [['ZH', ZH_DIR], ['EN', EN_DIR]]) {
      const filePath = path.join(dir, name);
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, 'utf8');
      const nonCode = stripCodeBlocks(content);
      const lines = nonCode.split('\n');
      const h1Lines = [];
      lines.forEach((line, idx) => {
        if (/^#\s+/.test(line.trim())) {
          h1Lines.push({ lineNum: idx + 1, text: line.trim() });
        }
      });

      const pass = h1Lines.length === 1;
      const detail = pass 
        ? '' 
        : `Found ${h1Lines.length} H1 headings: ${JSON.stringify(h1Lines)}`;
      record(pass, `Single H1 in ${lang} ${path.basename(dir)}/${name} (${h1Lines[0] ? h1Lines[0].text.substring(0, 40) : 'none'})`, detail);
    }
  }

  // 4. Reading Guide Callout Check (🎯, 💡, ⚡)
  console.log('\n--- 4. Checking Reading Guide Callouts (🎯, 💡, ⚡) ---');
  for (const name of CHAPTER_FILES) {
    for (const [lang, dir] of [['ZH', ZH_DIR], ['EN', EN_DIR]]) {
      const filePath = path.join(dir, name);
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, 'utf8');
      
      const hasTarget = content.includes('🎯');
      const hasBulb = content.includes('💡');
      const hasZap = content.includes('⚡');

      const lines = content.split('\n');
      const guideLines = lines.filter(l => l.startsWith('>') && (l.includes('🎯') || l.includes('💡') || l.includes('⚡')));

      const allPresent = hasTarget && hasBulb && hasZap;
      const isBlockquote = guideLines.length >= 3;
      const pass = allPresent && isBlockquote;

      let detail = '';
      if (!allPresent) {
        detail += `Missing emoji(s): ${!hasTarget ? '🎯 ' : ''}${!hasBulb ? '💡 ' : ''}${!hasZap ? '⚡ ' : ''}; `;
      }
      if (!isBlockquote) {
        detail += `Expected >= 3 blockquote lines with emojis, found ${guideLines.length}`;
      }

      record(pass, `Standardized callout in ${lang} ${path.basename(dir)}/${name}`, detail);
    }
  }

  // 5. Dead links and relative README links check
  console.log('\n--- 5. Checking Dead Links and Relative References ---');
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  for (const name of CHAPTER_FILES) {
    for (const [lang, dir] of [['ZH', ZH_DIR], ['EN', EN_DIR]]) {
      const filePath = path.join(dir, name);
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, 'utf8');

      const hasDeadReadme = content.includes('../README.md');
      record(!hasDeadReadme, `No ../README.md in ${lang} ${path.basename(dir)}/${name}`, 'Found ../README.md link');

      let match;
      const brokenLinks = [];
      const regexCopy = new RegExp(markdownLinkRegex.source, 'g');
      while ((match = regexCopy.exec(content)) !== null) {
        const linkTarget = match[2].trim();
        if (linkTarget.startsWith('http://') || linkTarget.startsWith('https://') || linkTarget.startsWith('mailto:')) {
          continue;
        }
        if (linkTarget.startsWith('#')) {
          continue;
        }

        const [targetPath] = linkTarget.split('#');
        if (!targetPath) continue;

        let resolvedPath;
        if (targetPath.startsWith('/')) {
          if (targetPath === '/' || targetPath === '/index.md') {
            resolvedPath = path.join(ROOT_DIR, 'index.md');
          } else if (targetPath === '/en/' || targetPath === '/en/index.md') {
            resolvedPath = path.join(ROOT_DIR, 'en/index.md');
          } else {
            resolvedPath = path.join(ROOT_DIR, targetPath);
            if (!fs.existsSync(resolvedPath) && !resolvedPath.endsWith('.md')) {
              if (fs.existsSync(resolvedPath + '.md')) resolvedPath += '.md';
            }
          }
        } else {
          resolvedPath = path.resolve(dir, targetPath);
          if (!fs.existsSync(resolvedPath) && !resolvedPath.endsWith('.md')) {
            if (fs.existsSync(resolvedPath + '.md')) resolvedPath += '.md';
          }
        }

        if (!fs.existsSync(resolvedPath)) {
          brokenLinks.push({ raw: linkTarget, resolved: resolvedPath });
        }
      }

      record(
        brokenLinks.length === 0,
        `All relative links valid in ${lang} ${path.basename(dir)}/${name}`,
        brokenLinks.length > 0 ? `Broken links: ${JSON.stringify(brokenLinks)}` : ''
      );
    }
  }

  // 6. Navigation Bar Parity
  console.log('\n--- 6. Checking Top Navigation Bar Parity ---');
  for (const name of CHAPTER_FILES) {
    for (const [lang, dir] of [['ZH', ZH_DIR], ['EN', EN_DIR]]) {
      const filePath = path.join(dir, name);
      if (!fs.existsSync(filePath)) continue;
      const firstLine = fs.readFileSync(filePath, 'utf8').split('\n')[0];
      const hasNav = firstLine.includes('[ 🏠') || firstLine.includes('[ 🌐');
      record(hasNav, `Nav bar header on line 1 in ${lang} ${path.basename(dir)}/${name}`, `First line: ${firstLine}`);
    }
  }

  // 7. Vue Template Parsing & Safety
  console.log('\n--- 7. Checking Vue Template Parsing & Syntax Safety ---');
  const mdRenderer = await createMarkdownRenderer(ROOT_DIR);

  for (const name of CHAPTER_FILES) {
    for (const [lang, dir] of [['ZH', ZH_DIR], ['EN', EN_DIR]]) {
      const filePath = path.join(dir, name);
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, 'utf8');

      const nonCode = stripInlineCode(stripCodeBlocks(content));
      const hasMustache = /\{\{[^}]+\}\}/.test(nonCode);
      record(!hasMustache, `No raw Vue interpolation {{ }} in ${lang} ${path.basename(dir)}/${name}`, 'Found {{ }} interpolation');

      let html = '';
      let renderError = null;
      try {
        const env = { path: filePath, relativePath: path.relative(ROOT_DIR, filePath) };
        html = mdRenderer.render(content, env);
      } catch (err) {
        renderError = err.message;
      }

      record(!renderError, `VitePress markdown render for ${lang} ${path.basename(dir)}/${name}`, renderError);

      let vueErrors = [];
      if (html) {
        try {
          compile(`<template><div>${html}</div></template>`, {
            mode: 'module',
            onError: (err) => {
              vueErrors.push(err.message || String(err));
            },
          });
        } catch (err) {
          vueErrors.push(err.message || String(err));
        }
      }

      record(
        vueErrors.length === 0,
        `Vue compilerDOM parse for ${lang} ${path.basename(dir)}/${name}`,
        vueErrors.length > 0 ? `Vue compiler errors: ${vueErrors.join('; ')}` : ''
      );
    }
  }

  // 8. Terminology Alignment Check
  console.log('\n--- 8. Checking Terminology Alignment (飞书助理) ---');
  for (const name of CHAPTER_FILES) {
    for (const [lang, dir] of [['ZH', ZH_DIR], ['EN', EN_DIR]]) {
      const filePath = path.join(dir, name);
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, 'utf8');

      const hasOfflineGuard = content.includes('离线看护助理');
      const hasIsolatedGuard = /[^飞书]看护助理/.test(content);
      const cleanTerminology = !hasOfflineGuard && !hasIsolatedGuard;

      record(
        cleanTerminology,
        `Terminology alignment (no 看护助理) in ${lang} ${path.basename(dir)}/${name}`,
        hasOfflineGuard ? 'Contains 离线看护助理' : hasIsolatedGuard ? 'Contains 看护助理' : ''
      );
    }
  }

  // Summary
  console.log('\n================================================================');
  console.log(`Stress Test Completed!`);
  console.log(`Total Checks:  ${totalChecks}`);
  console.log(`Passed:        ${passedChecks}`);
  console.log(`Failed:        ${failedChecks}`);
  console.log('================================================================\n');

  if (failedChecks > 0) {
    console.error('FAILURES SUMMARY:');
    failureReports.forEach((f, i) => console.error(`${i + 1}. [${f.name}] -> ${f.detail}`));
    process.exit(1);
  } else {
    console.log('ALL EMPIRICAL STRESS TESTS PASSED WITH ZERO FAILURES!');
    process.exit(0);
  }
}

runStressTest().catch(err => {
  console.error('Unhandled fatal error in stress test:', err);
  process.exit(2);
});
