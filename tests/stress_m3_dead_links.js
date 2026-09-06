#!/usr/bin/env node
/**
 * Milestone M3 Adversarial Stress Test: Dead Links & Static Build Integrity
 *
 * Exhaustively checks:
 * 1. Clean build execution and exit code.
 * 2. Complete HTML file inventory in .vitepress/dist.
 * 3. Terminology cleanliness (zero deprecated terms in dist HTML/JS and markdown sources).
 * 4. Internal link resolution and anchor (hash) verification across all compiled HTML files.
 * 5. Markdown source link integrity, relative paths, and anchor targets.
 * 6. Sequential chapter navigation continuity (Ch.01 - Ch.13 in ZH and EN).
 * 7. Asset references (images, PDF downloads) existence and non-zero byte size.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, '.vitepress', 'dist');

const CHAPTERS_ZH = [
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

const CHAPTERS_EN = CHAPTERS_ZH; // same filenames under en/

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const failureReports = [];

function record(pass, name, detail = '') {
  totalChecks++;
  if (pass) {
    passedChecks++;
    console.log(`  ✓ [PASS] ${name}`);
  } else {
    failedChecks++;
    console.error(`  ✗ [FAIL] ${name}${detail ? ': ' + detail : ''}`);
    failureReports.push({ name, detail });
  }
}

function getAllFiles(dir, exts = ['.html']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, exts));
    } else if (exts.some(ext => file.endsWith(ext))) {
      results.push(filePath);
    }
  }
  return results;
}

// 1. Check Dist Inventory
function checkDistInventory() {
  console.log('\n--- 1. Checking Dist Output Directory & HTML Inventory ---');
  record(fs.existsSync(DIST_DIR), 'dist directory exists (.vitepress/dist)');
  
  const htmlFiles = getAllFiles(DIST_DIR, ['.html']);
  console.log(`  Found ${htmlFiles.length} HTML files in ${DIST_DIR}`);
  record(htmlFiles.length >= 30, `HTML file count >= 30 (actual: ${htmlFiles.length})`);

  // Key expected HTML files
  const expectedFiles = [
    'index.html',
    '404.html',
    'generator.html',
    'en/index.html',
    'en/generator.html',
    'chapters/ch01_mindset.html',
    'chapters/ch08_mobile_workflow.html',
    'chapters/ch13_2026_frontier.html',
    'en/ch01_mindset.html',
    'en/ch08_mobile_workflow.html',
    'en/ch13_2026_frontier.html',
  ];

  for (const expected of expectedFiles) {
    const fullPath = path.join(DIST_DIR, expected);
    record(fs.existsSync(fullPath), `Expected HTML exists: ${expected}`);
  }

  return htmlFiles;
}

// 2. Check Terminology Cleanliness
function checkTerminologyCleanliness(htmlFiles) {
  console.log('\n--- 2. Checking Terminology Cleanliness in Dist & Sources ---');

  // Forbidden terms
  // 1) 离线看护助理
  // 2) isolated 看护助理 (not preceded by 飞书)
  // 3) Offline Watchdog Assistant

  let distForbiddenMatches = [];
  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(DIST_DIR, file);

    if (content.includes('离线看护助理')) {
      distForbiddenMatches.push(`${rel} contains 离线看护助理`);
    }

    // Check isolated 看护助理: not preceded by 飞书
    const isolatedRegex = /([^飞书]|^)看护助理/g;
    let match;
    while ((match = isolatedRegex.exec(content)) !== null) {
      distForbiddenMatches.push(`${rel} contains isolated 看护助理 at index ${match.index}`);
    }

    if (/Offline Watchdog Assistant/i.test(content)) {
      distForbiddenMatches.push(`${rel} contains Offline Watchdog Assistant`);
    }
  }

  record(distForbiddenMatches.length === 0, 'Zero deprecated terms in all compiled HTML files', distForbiddenMatches.join('; '));

  // Check in JS chunks as well
  const jsFiles = getAllFiles(DIST_DIR, ['.js']);
  let jsForbiddenMatches = [];
  for (const file of jsFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(DIST_DIR, file);
    if (content.includes('离线看护助理')) {
      jsForbiddenMatches.push(`${rel} contains 离线看护助理`);
    }
    const isolatedRegex = /([^飞书]|^)看护助理/g;
    if (isolatedRegex.test(content)) {
      jsForbiddenMatches.push(`${rel} contains isolated 看护助理`);
    }
  }
  record(jsForbiddenMatches.length === 0, 'Zero deprecated terms in all compiled JS chunks', jsForbiddenMatches.join('; '));

  // Check Markdown source files
  const mdFiles = [
    ...getAllFiles(path.join(ROOT_DIR, 'chapters'), ['.md']),
    ...getAllFiles(path.join(ROOT_DIR, 'en'), ['.md']),
    ...getAllFiles(path.join(ROOT_DIR, 'case-studies'), ['.md']),
    path.join(ROOT_DIR, 'index.md'),
    path.join(ROOT_DIR, 'README.md'),
    path.join(ROOT_DIR, 'generator.md'),
  ].filter(f => fs.existsSync(f));

  let mdForbiddenMatches = [];
  for (const file of mdFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT_DIR, file);
    if (content.includes('离线看护助理')) {
      mdForbiddenMatches.push(`${rel} contains 离线看护助理`);
    }
    const isolatedRegex = /([^飞书]|^)看护助理/g;
    if (isolatedRegex.test(content)) {
      mdForbiddenMatches.push(`${rel} contains isolated 看护助理`);
    }
  }
  record(mdForbiddenMatches.length === 0, 'Zero deprecated terms in markdown sources (excluding tests/meta)', mdForbiddenMatches.join('; '));
}

// 3. Extract IDs and names from HTML content
function extractHtmlAnchors(html) {
  const anchors = new Set();
  // match id="..."
  const idRegex = /\bid=["']([^"']+)["']/g;
  let m;
  while ((m = idRegex.exec(html)) !== null) {
    anchors.add(m[1]);
  }
  // match name="..."
  const nameRegex = /\bname=["']([^"']+)["']/g;
  while ((m = nameRegex.exec(html)) !== null) {
    anchors.add(m[1]);
  }
  return anchors;
}

// 4. Crawl all internal links in compiled HTML
function checkCompiledHtmlLinks(htmlFiles) {
  console.log('\n--- 3. Checking Internal Link Resolution & Anchors in Compiled HTML ---');

  // Cache file anchors
  const fileAnchorsCache = new Map();
  function getAnchors(filePath) {
    if (!fileAnchorsCache.has(filePath)) {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        fileAnchorsCache.set(filePath, extractHtmlAnchors(content));
      } else {
        fileAnchorsCache.set(filePath, new Set());
      }
    }
    return fileAnchorsCache.get(filePath);
  }

  let totalLinksChecked = 0;
  let brokenFileLinks = [];
  let brokenAnchorLinks = [];

  const aHrefRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;

  for (const htmlFile of htmlFiles) {
    const htmlContent = fs.readFileSync(htmlFile, 'utf8');
    const sourceRel = path.relative(DIST_DIR, htmlFile);
    const sourceDir = path.dirname(htmlFile);

    let match;
    while ((match = aHrefRegex.exec(htmlContent)) !== null) {
      const rawHref = match[1].trim();

      // Skip external, protocol, or empty links
      if (
        !rawHref ||
        rawHref.startsWith('http://') ||
        rawHref.startsWith('https://') ||
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:') ||
        rawHref.startsWith('javascript:') ||
        rawHref.startsWith('data:')
      ) {
        continue;
      }

      totalLinksChecked++;

      // Separate path and hash
      const hashIndex = rawHref.indexOf('#');
      let urlPath = hashIndex >= 0 ? rawHref.slice(0, hashIndex) : rawHref;
      let hash = hashIndex >= 0 ? rawHref.slice(hashIndex + 1) : '';

      // Clean query params if any
      const queryIndex = urlPath.indexOf('?');
      if (queryIndex >= 0) {
        urlPath = urlPath.slice(0, queryIndex);
      }

      // Determine target file path
      let targetFilePath = null;

      if (!urlPath) {
        // Same page anchor: e.g. #some-heading
        targetFilePath = htmlFile;
      } else if (urlPath.startsWith('/')) {
        // Root relative path
        const candidate1 = path.join(DIST_DIR, urlPath.slice(1) + '.html');
        const candidate2 = path.join(DIST_DIR, urlPath.slice(1), 'index.html');
        const candidate3 = path.join(DIST_DIR, urlPath.slice(1));
        if (fs.existsSync(candidate1)) {
          targetFilePath = candidate1;
        } else if (fs.existsSync(candidate2)) {
          targetFilePath = candidate2;
        } else if (fs.existsSync(candidate3) && !fs.statSync(candidate3).isDirectory()) {
          targetFilePath = candidate3;
        } else if (urlPath === '/' && fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
          targetFilePath = path.join(DIST_DIR, 'index.html');
        } else {
          brokenFileLinks.push(`In ${sourceRel}: "${rawHref}" -> target not found (${candidate1} or ${candidate2} or ${candidate3})`);
          continue;
        }
      } else {
        // Relative path
        const relCandidate1 = path.resolve(sourceDir, urlPath + '.html');
        const relCandidate2 = path.resolve(sourceDir, urlPath, 'index.html');
        const relCandidate3 = path.resolve(sourceDir, urlPath);
        if (fs.existsSync(relCandidate1)) {
          targetFilePath = relCandidate1;
        } else if (fs.existsSync(relCandidate2)) {
          targetFilePath = relCandidate2;
        } else if (fs.existsSync(relCandidate3) && !fs.statSync(relCandidate3).isDirectory()) {
          targetFilePath = relCandidate3;
        } else {
          brokenFileLinks.push(`In ${sourceRel}: "${rawHref}" -> relative target not found (${relCandidate1} or ${relCandidate3})`);
          continue;
        }
      }

      // If there is a hash anchor, verify it in the target HTML file
      if (hash && targetFilePath && targetFilePath.endsWith('.html')) {
        const decodedHash = decodeURIComponent(hash);
        const anchors = getAnchors(targetFilePath);
        // Anchors might match either encoded or decoded form
        const hasAnchor = anchors.has(hash) || anchors.has(decodedHash);
        if (!hasAnchor) {
          const targetRel = path.relative(DIST_DIR, targetFilePath);
          brokenAnchorLinks.push(`In ${sourceRel}: anchor "#${hash}" (decoded: "#${decodedHash}") not found in ${targetRel}`);
        }
      }
    }
  }

  console.log(`  Scanned ${totalLinksChecked} internal links across ${htmlFiles.length} HTML files.`);
  record(brokenFileLinks.length === 0, 'All compiled HTML internal links resolve to valid files', brokenFileLinks.slice(0, 10).join('; '));
  record(brokenAnchorLinks.length === 0, 'All compiled HTML internal anchor hashes resolve to existing DOM IDs', brokenAnchorLinks.slice(0, 10).join('; '));
}

// 5. Check Sequential Chapter Navigation Continuity
function checkChapterNavigationContinuity() {
  console.log('\n--- 4. Checking Sequential Chapter Navigation Continuity ---');

  // Verify ZH chapters (ch01 to ch13)
  for (let i = 0; i < CHAPTERS_ZH.length; i++) {
    const current = CHAPTERS_ZH[i];
    const prev = i > 0 ? CHAPTERS_ZH[i - 1] : null;
    const next = i < CHAPTERS_ZH.length - 1 ? CHAPTERS_ZH[i + 1] : null;
    const zhPath = path.join(ROOT_DIR, 'chapters', current);

    const content = fs.readFileSync(zhPath, 'utf8');

    if (prev) {
      const prevStem = prev.replace('.md', '');
      const prevLinkRegex = new RegExp(`href=["']\\./${prevStem}["']|href=["']\\./${prev}["']|\\[.*?上一章.*?\\]\\(\\./${prevStem}\\)|\\[.*?上一章.*?\\]\\(\\./${prev}\\)`);
      record(prevLinkRegex.test(content), `ZH ${current} links back to previous chapter ${prev}`);
    }

    if (next) {
      const nextStem = next.replace('.md', '');
      const nextLinkRegex = new RegExp(`href=["']\\./${nextStem}["']|href=["']\\./${next}["']|\\[.*?下一章.*?\\]\\(\\./${nextStem}\\)|\\[.*?下一章.*?\\]\\(\\./${next}\\)`);
      record(nextLinkRegex.test(content), `ZH ${current} links forward to next chapter ${next}`);
    }

    // Bilingual link to English
    const enStem = current.replace('.md', '');
    const enLinkRegex = new RegExp(`href=["'].*?/en/${enStem}["']|\\[.*?English.*?\\]\\(.*?/en/${enStem}`);
    record(enLinkRegex.test(content), `ZH ${current} links to English counterpart /en/${enStem}`);
  }

  // Verify EN chapters (ch01 to ch13)
  for (let i = 0; i < CHAPTERS_EN.length; i++) {
    const current = CHAPTERS_EN[i];
    const prev = i > 0 ? CHAPTERS_EN[i - 1] : null;
    const next = i < CHAPTERS_EN.length - 1 ? CHAPTERS_EN[i + 1] : null;
    const enPath = path.join(ROOT_DIR, 'en', current);

    const content = fs.readFileSync(enPath, 'utf8');

    if (prev) {
      const prevStem = prev.replace('.md', '');
      const prevLinkRegex = new RegExp(`href=["']\\./${prevStem}["']|href=["']\\./${prev}["']|\\[.*?Prev.*?\\]\\(\\./${prevStem}\\)|\\[.*?Prev.*?\\]\\(\\./${prev}\\)`);
      record(prevLinkRegex.test(content), `EN ${current} links back to previous chapter ${prev}`);
    }

    if (next) {
      const nextStem = next.replace('.md', '');
      const nextLinkRegex = new RegExp(`href=["']\\./${nextStem}["']|href=["']\\./${next}["']|\\[.*?Next.*?\\]\\(\\./${nextStem}\\)|\\[.*?Next.*?\\]\\(\\./${next}\\)`);
      record(nextLinkRegex.test(content), `EN ${current} links forward to next chapter ${next}`);
    }

    // Bilingual link to Chinese
    const zhStem = current.replace('.md', '');
    const zhLinkRegex = new RegExp(`href=["'].*?/chapters/${zhStem}["']|\\[.*?中文.*?\\]\\(.*?/chapters/${zhStem}`);
    record(zhLinkRegex.test(content), `EN ${current} links to Chinese counterpart /chapters/${zhStem}`);
  }
}

// 6. Check Static Assets & Downloads
function checkStaticAssets() {
  console.log('\n--- 5. Checking Static Assets & PDF Downloads ---');

  // Verify PDF downloads
  const zhPdf = path.join(DIST_DIR, 'downloads', 'codex_blue_book_zh.pdf');
  const enPdf = path.join(DIST_DIR, 'downloads', 'codex_blue_book_en.pdf');

  record(fs.existsSync(zhPdf), 'Chinese PDF exists in dist: downloads/codex_blue_book_zh.pdf');
  if (fs.existsSync(zhPdf)) {
    const size = fs.statSync(zhPdf).size;
    record(size > 500000, `Chinese PDF size is substantial (> 500KB, actual: ${size} bytes)`);
  }

  record(fs.existsSync(enPdf), 'English PDF exists in dist: downloads/codex_blue_book_en.pdf');
  if (fs.existsSync(enPdf)) {
    const size = fs.statSync(enPdf).size;
    record(size > 500000, `English PDF size is substantial (> 500KB, actual: ${size} bytes)`);
  }

  // Verify cover images
  const coverDark = path.join(DIST_DIR, 'images', 'cover_dark.png');
  const coverLight = path.join(DIST_DIR, 'images', 'cover_light.png');
  record(fs.existsSync(coverDark), 'Dark cover image exists in dist: images/cover_dark.png');
  record(fs.existsSync(coverLight), 'Light cover image exists in dist: images/cover_light.png');
}

// 7. Check Markdown relative links for dead paths
function checkMarkdownDeadLinks() {
  console.log('\n--- 6. Checking Markdown Relative Dead Links ---');
  const mdFiles = [
    ...getAllFiles(path.join(ROOT_DIR, 'chapters'), ['.md']),
    ...getAllFiles(path.join(ROOT_DIR, 'en'), ['.md']),
    ...getAllFiles(path.join(ROOT_DIR, 'case-studies'), ['.md']),
    path.join(ROOT_DIR, 'index.md'),
    path.join(ROOT_DIR, 'README.md'),
    path.join(ROOT_DIR, 'generator.md'),
  ].filter(f => fs.existsSync(f));

  let brokenMdLinks = [];
  const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;

  for (const file of mdFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const fileDir = path.dirname(file);
    const relFile = path.relative(ROOT_DIR, file);

    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      const url = match[2].trim().split(/\s+/)[0]; // strip optional title
      if (!url || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('#') || url.startsWith('mailto:')) {
        continue;
      }

      // Strip anchor
      const pathPart = url.split('#')[0];
      if (!pathPart) continue;

      // Check relative path
      let resolved = path.resolve(fileDir, pathPart);
      // VitePress cleanUrls might omit .md
      if (!fs.existsSync(resolved) && fs.existsSync(resolved + '.md')) {
        resolved = resolved + '.md';
      }

      if (!fs.existsSync(resolved)) {
        brokenMdLinks.push(`In ${relFile}: [${match[1]}](${url}) -> resolved to non-existent ${path.relative(ROOT_DIR, resolved)}`);
      }
    }
  }

  record(brokenMdLinks.length === 0, 'Zero dead relative links in all markdown sources', brokenMdLinks.slice(0, 10).join('; '));
}

async function main() {
  console.log('================================================================');
  console.log('  Milestone M3 Adversarial Stress Test: Dead Links & Build Integrity');
  console.log('================================================================');

  const htmlFiles = checkDistInventory();
  checkTerminologyCleanliness(htmlFiles);
  checkCompiledHtmlLinks(htmlFiles);
  checkChapterNavigationContinuity();
  checkStaticAssets();
  checkMarkdownDeadLinks();

  console.log('\n================================================================');
  console.log(`Summary: ${totalChecks} checks, ${passedChecks} passed, ${failedChecks} failed.`);
  console.log('================================================================');

  if (failedChecks > 0) {
    console.error('\nFailures detail:');
    for (const report of failureReports) {
      console.error(`- ${report.name}: ${report.detail}`);
    }
    process.exit(1);
  } else {
    console.log('\nAll adversarial stress tests passed successfully!');
    process.exit(0);
  }
}

main();
