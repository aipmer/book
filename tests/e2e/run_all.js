#!/usr/bin/env node
/**
 * Master E2E Test Runner for Codex Blue Book
 * Executes tests across Tiers 1 through 4 with CLI filtering support.
 */

const { runTests } = require('./runner');

// Load all test suites to register tests
require('./tier1_feature_coverage.test');
require('./tier2_boundary_corner.test');
require('./tier3_cross_feature.test');
require('./tier4_real_world.test');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    tier: null,
    milestone: null,
    feature: null,
    json: false,
    bail: false,
    verbose: true,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--tier' && args[i + 1]) {
      options.tier = args[++i];
    } else if (arg === '--milestone' && args[i + 1]) {
      options.milestone = args[++i];
    } else if (arg === '--feature' && args[i + 1]) {
      options.feature = args[++i];
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--bail') {
      options.bail = true;
    } else if (arg === '--quiet') {
      options.verbose = false;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Codex Blue Book - E2E Test Runner

Usage:
  node tests/e2e/run_all.js [options]

Options:
  --tier <1|2|3|4>          Filter tests by Tier (1: Coverage, 2: Boundary, 3: Cross, 4: Real-world)
  --milestone <M1|M2|M3|M4> Filter tests by Milestone (M1: Cover, M2: Copy, M3: Term, M4: PDF)
  --feature <F1..F8>        Filter tests by Feature identifier
  --bail                    Halt test execution on first failure
  --json                    Output structured JSON report
  --quiet                   Suppress per-test progress logs
  --help, -h                Show this help message
`);
      process.exit(0);
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();
  try {
    const results = await runTests(options);
    const exitCode = results.failed > 0 ? 1 : 0;
    process.exit(exitCode);
  } catch (err) {
    console.error('Fatal error running tests:', err);
    process.exit(2);
  }
}

if (require.main === module) {
  main();
}
