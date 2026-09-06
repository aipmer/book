# Project: Codex Blue Book Virality & Reading Experience Optimization

## Architecture
The Codex Blue Book is a bilingual (Chinese & English) technical documentation guide and ebook built on:
- **Frontend / SSG**: VitePress 1.6+ (Vue 3, Markdown, custom theme in `.vitepress/theme/custom.css`, multi-language configuration in `.vitepress/config.mts`).
- **Content Structure**:
  - Homepage: `index.md` (ZH), `en/index.md` (EN).
  - Chapters: `chapters/ch01_mindset.md` ~ `ch13_2026_frontier.md` (ZH, 13 chapters), `en/ch01_mindset.md` ~ `en/ch13_2026_frontier.md` (EN, 13 chapters). Total 26 chapters across 5 major sections.
  - Interactive Spec Generator: `generator.md` (ZH), `en/generator.md` (EN).
  - Protocol Templates: `templates/AGENTS-*.md` (10 framework configurations).
  - Companion Case Studies & Examples: `case-studies/`, `examples/`.
- **Build & Asset Pipelines**:
  - `npm run docs:build`: VitePress static site compiler.
  - `python3 scripts/compile_collection.py`: Markdown book collection preprocessor.
  - `node scripts/compile_pdf.js`: Dual-language PDF compiler (`codex_blue_book_zh.pdf`, `codex_blue_book_en.pdf`).
  - `public/downloads/`: Downloadable PDF assets served on the live site.

## Feature Inventory
Every feature from the Survey phase is mapped to a milestone below:
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | F1. Cover Hover Physics Fix | Remove `transform` from hover/transitions, retain VitePress absolute centering (0px shift, 0 CLS). Fix invalid `box-shadow` syntax. | M1 | Survey (Explorer 1) |
| 2 | F2. Cover Glow & Micro-Contrast | Dual-mode soft glow diffusion, luminous border, micro-contrast enhancement (`contrast(1.03) brightness(1.03)`), radial backlight aura. | M1 | Survey (Explorer 1) |
| 3 | F3. Hero & 4 Features Copywriting | Refactor Hero tagline and 4 feature cards in `index.md` and `en/index.md` from jargon to "痛点直击 + 落地收益". | M2 | Survey (Explorer 2) |
| 4 | F4. 5 Sections & 26 Chapters Guides | Standardized reading guides (pain point + runnable output + viral quote) in all 26 chapters; optimize sidebar titles and section intros. | M2 | Survey (Explorer 2) |
| 5 | F5. Spec Generator & Templates Scenarios | Rephrase generator and templates from abstract jargon to concrete project defense scenarios (防死循环、防伪造、防滥装、必带测试). | M2 | Survey (Explorer 2) |
| 6 | F6. Global Terminology Alignment | Replace `离线看护助理` and isolated `看护助理` with `飞书助理` (and EN `Feishu Assistant` / `Sentinel`), 0 remaining target occurrences. | M3 | Survey (Explorer 3) |
| 7 | F7. Build & Dead Links Governance | Ensure `npm run docs:build` passes without errors; fix latent dead links (`../README.md` -> `/`, `../examples` -> GitHub URLs). | M3 | Survey (Explorer 3) |
| 8 | F8. Dual-Language PDF Pipeline & Sync | Synchronize `compile_collection.py` TOC anchors; generate latest dual-language PDFs; synchronize output to `public/downloads/`. | M4 | Survey (Explorer 3) |
| 9 | F9. E2E Test Suite & Final Verification | Opaque-box verification of visual, copywriting, terminology, and automated builds across all 4 tiers + Tier 5 adversarial audit. | M5 | User Request |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Cover Hover & Micro-Glow Refinement | F1, F2: `.vitepress/theme/custom.css` | none | DONE |
| M2 | Copywriting & Content Virality Refinement | F3, F4, F5: `index.md`, `en/index.md`, `.vitepress/config.mts`, `chapters/`, `en/`, `generator.md`, `templates/` | none | DONE |
| M3 | Terminology Alignment & Dead Links Governance | F6, F7: Replace `离线看护助理` / `看护助理` -> `飞书助理`, resolve `../README.md` dead links, verify docs build | M2 | PLANNED |
| M4 | PDF Compilation Pipeline & Asset Sync | F8: `scripts/compile_collection.py`, `scripts/compile_pdf.js`, sync to `public/downloads/`, `package.json` scripts | M2, M3 | PLANNED |
| M5 | Final Milestone: Pass 100% E2E Tests & Adversarial Hardening | F9: Pass Tiers 1-4 tests, run Tier 5 adversarial checks, forensic integrity audit | M1, M2, M3, M4, TEST_READY | PLANNED |

## Interface Contracts
### M1 ↔ M2 / Site Layout
- M1 modifies `.vitepress/theme/custom.css` exclusively.
- M1 respects VitePress `.VPHero .image-src` absolute centering and does not modify HTML structure.
- Light and dark mode variables `--book-cover-shadow`, `--book-cover-shadow-hover`, `--book-cover-border-hover`, `--book-cover-filter-hover` are scoped cleanly in `:root` and `.dark`.

### M2 ↔ M3 / Terminology & Navigation
- M2 and M3 collaborate on copy: M2 refactors copywriting while enforcing M3's terminology standard: ALWAYS use `飞书助理` (Chinese) and `Feishu Assistant` / `Sentinel` (English).
- M3 ensures that zero instances of `离线看护助理` or isolated `看护助理` remain in any file touched by M2 or throughout the repository.

### M2 / M3 ↔ M4 / PDF Pipeline & Assets
- M4 relies on final chapter H1 titles and filenames from M2 and M3.
- `scripts/compile_collection.py` `toc_zh` and `toc_en` anchors must exactly match chapter H1 headings.
- M4 compiles `codex_blue_book_zh.pdf` and `codex_blue_book_en.pdf` and copies them to `public/downloads/`.

### Testing Track ↔ Implementation Track
- E2E Testing Track creates `tests/e2e/` and `TEST_READY.md`.
- Implementation Track must pass 100% of E2E tests before project completion.

## Code Layout
- Exclusive File Ownership:
  - M1: `.vitepress/theme/custom.css`
  - M2: `index.md`, `en/index.md`, `.vitepress/config.mts`, `chapters/*.md`, `en/*.md`, `generator.md`, `en/generator.md`, `templates/AGENTS-*.md`
  - M3: Cross-cutting terminology sweep and dead link resolution in `case-studies/`, `README.md`, `changelog.md`, `dev_task.md`
  - M4: `scripts/compile_collection.py`, `scripts/compile_pdf.js`, `public/downloads/*.pdf`, `package.json`
  - E2E Testing Track: `tests/e2e/`, `TEST_INFRA.md`, `TEST_READY.md`
