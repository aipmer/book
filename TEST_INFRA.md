# Test Infrastructure Specification: Codex Blue Book E2E Testing Track

## 1. Overview & Principles

This document defines the automated, opaque-box End-to-End (E2E) testing infrastructure for the **Codex Blue Book** optimization project. 

The test suite provides systematic verification across all functional requirements (F1 through F8) without inspecting internal implementation hacks or relying on fragile facade mocks. All tests evaluate observable contracts: rendered CSS declarations, Markdown content structures, bilingual parity, navigation topologies, terminology compliance, static site generator builds, and PDF distribution artifacts.

### Core Testing Principles
1. **Opaque-Box Verification**: Tests validate observable interfaces, compiled assets, HTTP/file hyperlinks, CSS cascading properties, and build exit codes.
2. **Authoritative Output Derivation**: Expected outputs are derived strictly from `PROJECT.md`, `ORIGINAL_REQUEST.md`, and technical specifications.
3. **Progressive Testability & Milestone Tagging**: Every test case carries structured metadata (`tier`, `feature`, `milestone`, `id`, `name`). Tests can be executed by Milestone (`--milestone M1`), by Tier (`--tier 1..4`), by Feature (`--feature F1..F8`), or in full (`node tests/e2e/run_all.js`).
4. **Zero-Dependency Harness**: The test runner is written in standard Node.js (v18+) without requiring third-party testing framework installations, ensuring instant, deterministic execution in local dev, CI, and agent environments.
5. **Strict Exit Code Contract**: The test runner returns exit code `0` when all executed tests pass and `1` if any assertion fails.

---

## 2. Directory & Module Architecture

```
tests/e2e/
├── runner.js                      # Core test framework (describe, it, expect, reporting, CLI parsing)
├── tier1_feature_coverage.test.js # Tier 1: Feature Coverage (>=5 tests per feature F1..F8, 40 tests)
├── tier2_boundary_corner.test.js  # Tier 2: Boundary & Corner Cases (>=5 tests per feature F1..F8, 40 tests)
├── tier3_cross_feature.test.js    # Tier 3: Pairwise Cross-Feature Interactions (10 tests)
├── tier4_real_world.test.js       # Tier 4: Real-World Scenarios & Reader Journeys (6 tests)
└── run_all.js                     # Master executable test runner entrypoint
```

Root documentation deliverables:
- `/TEST_INFRA.md` (This document)
- `/TEST_READY.md` (Readiness sign-off report)

---

## 3. The 4-Tier Testing Methodology

The test suite organizes 96+ tests into 4 progressive tiers:

| Tier | Name | Target Scope | Minimum Tests |
|------|------|--------------|---------------|
| **Tier 1** | **Feature Coverage** | Primary happy-path contracts for features F1 through F8 | 40 (>=5 per feature) |
| **Tier 2** | **Boundary & Corner Cases** | Edge cases, dark/light bounds, dead link sweeps, empty/extreme inputs | 40 (>=5 per feature) |
| **Tier 3** | **Cross-Feature Interactions** | Pairwise combinations across styling, content, terminology, and builds | 10 pairwise suites |
| **Tier 4** | **Real-World Scenarios** | Complete reader journeys, spec generation, mobile UX, full-cycle build | 6 end-to-end flows |
| **Total** | | | **96 tests** |

---

## 4. Feature Coverage Mapping (F1 - F8)

| Feature ID | Feature Name | Mapped Milestone | Scope & Invariants Tested |
|------------|--------------|------------------|---------------------------|
| **F1** | Cover Hover Physics Fix | **M1** | Zero physical displacement (CLS=0, delta-X=0, delta-Y=0); remove `transform` from hover; valid CSS `box-shadow` syntax without `drop-shadow` parse failures; aspect ratio 16:9 preserved. |
| **F2** | Cover Glow & Micro-Contrast | **M1** | Dual-mode soft glow diffusion (`--book-cover-shadow`, `--book-cover-shadow-hover`); micro-contrast enhancement (`contrast(1.025~1.03) brightness(1.02~1.03)`); luminous blue-tint border hover; radial backlight aura (`.image-bg`); GPU compositing optimizations (`will-change`, `backface-visibility`). |
| **F3** | Hero & 4 Features Copywriting | **M2** | Total elimination of academic jargon ("CAP规范", "Anti-Loop护栏", "沙盒穿透", "Computer Use鸿沟"); 4 feature cards rewritten into "痛点直击 + 落地收益"; action button 3 aligned to "飞书助理"; English homepage synchronized. |
| **F4** | 5 Sections & 26 Chapters Guides | **M2** | 26 chapter files across `chapters/` (ZH) and `en/` (EN); top-of-chapter reading guide callouts (`🎯 痛点麻烦`, `💡 落地收益`, `⚡ 金句`); jargon-free sidebar titles; 5 major section introductions. |
| **F5** | Spec Generator & Templates Scenarios | **M2** | Generator options phrased as concrete defense scenarios (防自旋死循环、防虚假伪造、防滥装依赖、交付必带测试); remove "提权策略" and raw "CAP" jargon; 10 protocol templates in `templates/` with concrete engineering rules and zero fake TODO placeholders. |
| **F6** | Global Terminology Alignment | **M3** | Zero occurrences of `离线看护助理` across entire codebase; zero occurrences of isolated `看护助理`; consistent adoption of `飞书助理` (ZH) and `Feishu Assistant` / `Sentinel` (EN) in navigation, actions, and Ch.08. |
| **F7** | Build & Dead Links Governance | **M3** | `npm run docs:build` passes cleanly with exit code 0; zero dead relative links to `../README.md`; zero dead relative links to `../examples/`; valid navigation targets. |
| **F8** | Dual-Language PDF Pipeline & Sync | **M4** | `compile_collection.py` runs and outputs dual-language markdown; TOC anchors match chapter H1 headings; `compile_pdf.js` generates `codex_blue_book_zh.pdf` and `codex_blue_book_en.pdf`; download assets in `public/downloads/` synchronized and non-empty. |

---

## 5. Test Runner & CLI Specification

The test runner provides flexible execution modes via command-line arguments:

```bash
# 1. Run all 96+ tests across all 4 tiers
node tests/e2e/run_all.js

# 2. Run by specific Tier
node tests/e2e/run_all.js --tier 1
node tests/e2e/run_all.js --tier 2
node tests/e2e/run_all.js --tier 3
node tests/e2e/run_all.js --tier 4

# 3. Run by Milestone (Progressive Verification)
node tests/e2e/run_all.js --milestone M1   # Cover hover & glow (Features F1, F2)
node tests/e2e/run_all.js --milestone M2   # Copywriting & guides (Features F3, F4, F5)
node tests/e2e/run_all.js --milestone M3   # Terminology & build (Features F6, F7)
node tests/e2e/run_all.js --milestone M4   # PDF pipeline & sync (Feature F8)

# 4. Run by specific Feature
node tests/e2e/run_all.js --feature F1
node tests/e2e/run_all.js --feature F6

# 5. Output structured JSON report (for CI & agent orchestration)
node tests/e2e/run_all.js --json

# 6. Stop on first failure
node tests/e2e/run_all.js --bail
```

### Exit Codes
- `0`: All executed tests passed.
- `1`: One or more tests failed.
- `2`: Configuration or syntax error in test runner.

---

## 6. Assertion Library & Capabilities

The custom `runner.js` implements a lightweight assertion engine:
- `expect(val).toBe(expected)`: Strict equality (`===`).
- `expect(val).toEqual(expected)`: Deep recursive value equality.
- `expect(val).toContain(substringOrItem)`: Substring or array inclusion check.
- `expect(val).toMatch(regex)`: Regular expression pattern match.
- `expect(val).toBeGreaterThan(min)` / `toBeLessThan(max)`: Numeric comparisons.
- `expect(val).toBeCloseTo(expected, delta)`: Floating point precision comparison.
- `expect(val).toBeNull()` / `toBeDefined()`: Type guards.
- Inversion via `.not` (e.g. `expect(val).not.toContain(forbiddenJargon)`).
- Asynchronous test support (`async/await` in test callbacks).

---

## 7. Quality Gates & Acceptance Matrix

Before Milestone M5 sign-off and production deployment, the codebase must satisfy:
1. **Tier 1 (Feature Coverage)**: 40/40 Passing (100%).
2. **Tier 2 (Boundary & Corners)**: 40/40 Passing (100%).
3. **Tier 3 (Cross-Feature)**: 10/10 Passing (100%).
4. **Tier 4 (Real-World)**: 6/6 Passing (100%).
5. **Total Test Suite**: 96/96 Passing (100%).
6. **Build Integrity**: `npm run docs:build` completes with zero errors.
7. **Asset Integrity**: Dual-language PDFs compiled and verified in `public/downloads/`.
