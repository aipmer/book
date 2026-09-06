/**
 * Milestone M3 Adversarial Stress Harness: Global Terminology Alignment
 * Empirically tests the entire codebase for forbidden terms and verified replacements.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');

const FORBIDDEN_PATTERNS = [
  { name: '离线看护助理', regex: /离线看护助理/ },
  { name: '看护助理 (without 飞书)', regex: /(?<!飞书)看护助理/ },
  { name: 'Offline Watchdog Assistant (case-insensitive)', regex: /offline\s+watchdog\s+assistant/i },
  { name: 'Watchdog Assistant (case-insensitive)', regex: /watchdog\s+assistant/i },
];

const EXCLUDE_DIRS = [
  '.git',
  '.agents',
  'node_modules',
  'dist',
  '.vitepress/cache',
  'tests',
];

const EXCLUDE_FILES = [
  'PROJECT.md',
  'TEST_INFRA.md',
  'TEST_READY.md',
];

function getAllFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(ROOT_DIR, fullPath);

    // Check exclusion
    if (EXCLUDE_DIRS.some(ex => relPath === ex || relPath.startsWith(ex + path.sep))) {
      continue;
    }

    if (entry.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (entry.isFile()) {
      if (EXCLUDE_FILES.includes(relPath)) continue;
      // Filter interesting text/code extensions
      const ext = path.extname(entry.name).toLowerCase();
      if (['.md', '.mts', '.ts', '.js', '.vue', '.json', '.py', '.html', '.css', '.sh', '.yml', '.yaml'].includes(ext)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

async function runM3StressTest() {
  console.log('================================================================');
  console.log('  Milestone M3 Adversarial Stress Test: Terminology Alignment');
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

  // -------------------------------------------------------------
  // Test 1: Full-Repository Scan for Forbidden Terminology
  // -------------------------------------------------------------
  console.log('--- 1. Exhaustive Scan of All Source & Doc Files ---');
  const files = getAllFiles(ROOT_DIR);
  console.log(`Discovered ${files.length} candidate files for terminology scan.\n`);

  for (const pattern of FORBIDDEN_PATTERNS) {
    const matchedFiles = [];
    for (const filePath of files) {
      const relPath = path.relative(ROOT_DIR, filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      if (pattern.regex.test(content)) {
        matchedFiles.push(relPath);
      }
    }
    record(
      matchedFiles.length === 0,
      `Zero occurrences of [${pattern.name}] across ${files.length} files`,
      `Found in: ${matchedFiles.join(', ')}`
    );
  }

  // -------------------------------------------------------------
  // Test 2: Boundary Analysis for Any Occurrence of "看护"
  // -------------------------------------------------------------
  console.log('\n--- 2. Boundary Analysis: Context of all "看护" tokens ---');
  const allowedPrefixes = ['移动看护', '全天候移动看护', '多端移动看护', '户外移动看护', '远程移动看护'];
  const allowedSuffixes = ['工作流', '网关', '体验', '链条', '实战', '架构', '闭环'];
  
  let invalidKanhugOccurrences = [];
  for (const filePath of files) {
    const relPath = path.relative(ROOT_DIR, filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('看护')) {
        // Must NOT contain 看护助理
        if (line.includes('看护助理')) {
          invalidKanhugOccurrences.push(`${relPath}:${idx + 1} -> ${line.trim()}`);
        }
      }
    });
  }
  record(
    invalidKanhugOccurrences.length === 0,
    'All occurrences of "看护" are strictly valid domain concepts and never "看护助理"',
    `Invalid occurrences: ${invalidKanhugOccurrences.join('\n')}`
  );

  // -------------------------------------------------------------
  // Test 3: Positive Adoption Verification for "飞书助理"
  // -------------------------------------------------------------
  console.log('\n--- 3. Positive Adoption Verification for "飞书助理" ---');
  const requiredAdoptions = [
    { file: 'index.md', desc: 'Homepage Hero Action 3' },
    { file: '.vitepress/config.mts', desc: 'Navigation Bar and Chapter 08 Sidebar' },
    { file: 'chapters/ch08_mobile_workflow.md', desc: 'Ch.08 Section 8.4 & text' },
    { file: 'generator.md', desc: 'Defense option and tunnel description' },
    { file: 'README.md', desc: 'Companion ecosystem section' },
    { file: 'case-studies/case_study_mobile_sentinel.md', desc: 'Case Study 02 Title & body' },
    { file: 'case-studies/README.md', desc: 'Case Study 02 Table row' },
    { file: 'scripts/compile_collection.py', desc: 'Collection build companion section' },
  ];

  for (const item of requiredAdoptions) {
    const fullPath = path.join(ROOT_DIR, item.file);
    const exists = fs.existsSync(fullPath);
    if (!exists) {
      record(false, `Adoption target exists: ${item.file}`, 'File not found');
      continue;
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasTerm = content.includes('飞书助理');
    record(hasTerm, `Adoption present in ${item.file} (${item.desc})`, 'Missing "飞书助理"');
  }

  // -------------------------------------------------------------
  // Test 4: Positive Adoption Verification for English Parity
  // -------------------------------------------------------------
  console.log('\n--- 4. Positive Adoption Verification for English Parity ---');
  const enRequiredAdoptions = [
    { file: 'en/index.md', desc: 'EN Homepage' },
    { file: 'en/ch08_mobile_workflow.md', desc: 'EN Ch.08' },
    { file: '.vitepress/config.mts', desc: 'EN Nav/Sidebar in config' },
  ];

  for (const item of enRequiredAdoptions) {
    const fullPath = path.join(ROOT_DIR, item.file);
    const exists = fs.existsSync(fullPath);
    if (!exists) {
      record(false, `EN adoption target exists: ${item.file}`, 'File not found');
      continue;
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasEnTerm = /Feishu Assistant|Feishu Sentinel|Sentinel/.test(content);
    record(hasEnTerm, `EN adoption present in ${item.file} (${item.desc})`, 'Missing Feishu Assistant / Sentinel');
  }

  // -------------------------------------------------------------
  // Test 5: Production Build Artifacts Audit (.vitepress/dist)
  // -------------------------------------------------------------
  console.log('\n--- 5. Production Dist Artifacts Audit ---');
  const distDir = path.join(ROOT_DIR, '.vitepress/dist');
  if (fs.existsSync(distDir)) {
    const distFiles = [];
    function scanDist(dir) {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const fp = path.join(dir, e.name);
        if (e.isDirectory()) scanDist(fp);
        else if (e.isFile() && (fp.endsWith('.html') || fp.endsWith('.js'))) distFiles.push(fp);
      }
    }
    scanDist(distDir);

    let distViolations = [];
    for (const fp of distFiles) {
      const rel = path.relative(ROOT_DIR, fp);
      const c = fs.readFileSync(fp, 'utf8');
      if (c.includes('离线看护助理') || c.includes('看护助理')) {
        distViolations.push(`${rel}`);
      }
    }
    record(
      distViolations.length === 0,
      `Zero legacy terminology in ${distFiles.length} production dist assets (.html, .js)`,
      `Found in: ${distViolations.join(', ')}`
    );
  } else {
    record(false, 'Production dist directory exists', 'Please run npm run docs:build');
  }

  // -------------------------------------------------------------
  // Test 6: Compiled Markdown Collections Audit
  // -------------------------------------------------------------
  console.log('\n--- 6. Compiled Collection Markdown Audit ---');
  const zhCollection = path.join(ROOT_DIR, 'codex_blue_book_zh.md');
  const enCollection = path.join(ROOT_DIR, 'codex_blue_book_en.md');

  if (fs.existsSync(zhCollection)) {
    const zhC = fs.readFileSync(zhCollection, 'utf8');
    record(
      !zhC.includes('离线看护助理') && !zhC.includes('看护助理'),
      'codex_blue_book_zh.md contains zero legacy terminology',
      'Found legacy terminology in compiled ZH collection'
    );
    record(
      zhC.includes('飞书助理'),
      'codex_blue_book_zh.md contains unified "飞书助理"',
      'Missing "飞书助理" in compiled ZH collection'
    );
  }

  if (fs.existsSync(enCollection)) {
    const enC = fs.readFileSync(enCollection, 'utf8');
    record(
      !/offline\s+watchdog\s+assistant/i.test(enC),
      'codex_blue_book_en.md contains zero "Offline Watchdog Assistant"',
      'Found legacy English terminology in compiled EN collection'
    );
  }

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log('  Stress Test Summary');
  console.log('================================================================');
  console.log(`  Total Checks:   ${totalChecks}`);
  console.log(`  Passed:         ${passedChecks}`);
  console.log(`  Failed:         ${failedChecks}`);
  console.log('================================================================\n');

  if (failedChecks > 0) {
    process.exit(1);
  }
}

runM3StressTest().catch(err => {
  console.error('Fatal error in stress test:', err);
  process.exit(1);
});
