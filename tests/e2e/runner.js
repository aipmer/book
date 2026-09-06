/**
 * Codex Blue Book - Lightweight E2E Test Runner & Assertion Engine
 * Zero external dependencies. Works on standard Node.js (v18+).
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '../..');

// ANSI Color Helpers
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AssertionError';
  }
}

function formatVal(val) {
  if (typeof val === 'string') {
    if (val.length > 120) {
      return JSON.stringify(val.slice(0, 120) + '... [truncated]');
    }
    return JSON.stringify(val);
  }
  const str = JSON.stringify(val);
  return str && str.length > 120 ? str.slice(0, 120) + '... [truncated]' : str;
}

function expect(actual) {
  const matchers = (isNot = false) => ({
    toBe(expected) {
      const pass = actual === expected;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${formatVal(actual)} ${isNot ? 'NOT to be' : 'to be'} ${formatVal(expected)}`
        );
      }
    },
    toEqual(expected) {
      const pass = JSON.stringify(actual) === JSON.stringify(expected);
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected deep equal: ${formatVal(actual)} ${isNot ? 'NOT to equal' : 'to equal'} ${formatVal(expected)}`
        );
      }
    },
    toContain(expected) {
      let pass = false;
      if (typeof actual === 'string' || Array.isArray(actual)) {
        pass = actual.includes(expected);
      } else if (actual && typeof actual === 'object') {
        pass = expected in actual;
      }
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${typeof actual === 'string' ? `"${actual.slice(0, 100)}..."` : JSON.stringify(actual)} ${isNot ? 'NOT to contain' : 'to contain'} ${JSON.stringify(expected)}`
        );
      }
    },
    toMatch(regex) {
      const re = typeof regex === 'string' ? new RegExp(regex) : regex;
      const pass = re.test(String(actual));
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected "${String(actual).slice(0, 100)}..." ${isNot ? 'NOT to match' : 'to match'} pattern ${regex}`
        );
      }
    },
    toBeGreaterThan(expected) {
      const pass = actual > expected;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${actual} ${isNot ? 'NOT to be greater than' : 'to be greater than'} ${expected}`
        );
      }
    },
    toBeGreaterThanOrEqual(expected) {
      const pass = actual >= expected;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${actual} ${isNot ? 'NOT to be >= than' : 'to be >= than'} ${expected}`
        );
      }
    },
    toBeLessThan(expected) {
      const pass = actual < expected;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${actual} ${isNot ? 'NOT to be less than' : 'to be less than'} ${expected}`
        );
      }
    },
    toBeLessThanOrEqual(expected) {
      const pass = actual <= expected;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${actual} ${isNot ? 'NOT to be <= than' : 'to be <= than'} ${expected}`
        );
      }
    },
    toBeCloseTo(expected, delta = 0.001) {
      const pass = Math.abs(actual - expected) <= delta;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${actual} ${isNot ? 'NOT to be close to' : 'to be close to'} ${expected} (within delta ${delta})`
        );
      }
    },
    toBeDefined() {
      const pass = actual !== undefined && actual !== null;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${actual} ${isNot ? 'NOT to be defined' : 'to be defined (not null or undefined)'}`
        );
      }
    },
    toBeNull() {
      const pass = actual === null;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${actual} ${isNot ? 'NOT to be null' : 'to be null'}`
        );
      }
    },
    toBeTruthy() {
      const pass = !!actual;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${actual} ${isNot ? 'NOT to be truthy' : 'to be truthy'}`
        );
      }
    },
    toBeFalsy() {
      const pass = !actual;
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected ${actual} ${isNot ? 'NOT to be falsy' : 'to be falsy'}`
        );
      }
    },
    toThrow(expectedError) {
      let threw = false;
      let caughtError = null;
      try {
        if (typeof actual === 'function') {
          actual();
        }
      } catch (err) {
        threw = true;
        caughtError = err;
      }
      let pass = threw;
      if (pass && expectedError) {
        if (typeof expectedError === 'string') {
          pass = caughtError.message.includes(expectedError);
        } else if (expectedError instanceof RegExp) {
          pass = expectedError.test(caughtError.message);
        }
      }
      if (isNot ? pass : !pass) {
        throw new AssertionError(
          `Expected function ${isNot ? 'NOT to throw' : 'to throw'}${expectedError ? ` matching ${expectedError}` : ''}, but caught: ${caughtError ? caughtError.message : 'no throw'}`
        );
      }
    },
  });

  const matcherObj = matchers(false);
  matcherObj.not = matchers(true);
  return matcherObj;
}

// Registry
const testRegistry = [];
let currentSuite = null;

function describe(suiteName, fn) {
  const prevSuite = currentSuite;
  currentSuite = suiteName;
  try {
    fn();
  } finally {
    currentSuite = prevSuite;
  }
}

/**
 * Register a test case
 * @param {string} id Unique test identifier (e.g. "F1-T1-01")
 * @param {string} name Human readable test description
 * @param {object} meta { tier: 1..4, feature: 'F1'..'F8', milestone: 'M1'..'M4' }
 * @param {function} fn Test implementation (sync or async)
 */
function test(id, name, meta, fn) {
  testRegistry.push({
    id,
    name,
    suite: currentSuite,
    tier: meta.tier || 1,
    feature: meta.feature || 'F1',
    milestone: meta.milestone || 'M1',
    fn,
  });
}

// Helper utilities for tests
const utils = {
  ROOT_DIR,
  readFile(relPath) {
    const absPath = path.resolve(ROOT_DIR, relPath);
    if (!fs.existsSync(absPath)) {
      throw new Error(`File does not exist: ${absPath}`);
    }
    return fs.readFileSync(absPath, 'utf-8');
  },
  fileExists(relPath) {
    return fs.existsSync(path.resolve(ROOT_DIR, relPath));
  },
  fileStat(relPath) {
    const absPath = path.resolve(ROOT_DIR, relPath);
    if (!fs.existsSync(absPath)) {
      return null;
    }
    return fs.statSync(absPath);
  },
  runCommand(cmd, options = {}) {
    const cwd = options.cwd || ROOT_DIR;
    const timeout = options.timeout || 60000;
    try {
      const stdout = execSync(cmd, {
        cwd,
        timeout,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      return { status: 0, stdout, stderr: '' };
    } catch (err) {
      return {
        status: err.status || 1,
        stdout: err.stdout ? err.stdout.toString() : '',
        stderr: err.stderr ? err.stderr.toString() : err.message,
      };
    }
  },
  parseYamlFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return null;
    return match[1];
  },
};

/**
 * Runner execution
 */
async function runTests(options = {}) {
  const {
    tier = null,
    milestone = null,
    feature = null,
    json = false,
    bail = false,
    verbose = true,
  } = options;

  let filteredTests = testRegistry.filter((t) => {
    if (tier && String(t.tier) !== String(tier)) return false;
    if (milestone && t.milestone.toUpperCase() !== milestone.toUpperCase()) return false;
    if (feature && t.feature.toUpperCase() !== feature.toUpperCase()) return false;
    return true;
  });

  if (!json && verbose) {
    console.log(`\n${colors.bold}${colors.cyan}================================================================${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}  Codex Blue Book E2E Test Suite Runner${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}================================================================${colors.reset}`);
    console.log(`${colors.gray}Active Filters:${colors.reset} ${JSON.stringify({ tier, milestone, feature }) || 'None (Running full suite)'}`);
    console.log(`${colors.gray}Total Registered Tests:${colors.reset} ${testRegistry.length}`);
    console.log(`${colors.gray}Tests Matching Filter:${colors.reset} ${filteredTests.length}\n`);
  }

  const results = {
    total: filteredTests.length,
    passed: 0,
    failed: 0,
    skipped: 0,
    startTime: Date.now(),
    durationMs: 0,
    tests: [],
  };

  for (let i = 0; i < filteredTests.length; i++) {
    const t = filteredTests[i];
    const testStart = Date.now();
    let status = 'pass';
    let errorMessage = null;

    try {
      await t.fn(utils);
      results.passed++;
    } catch (err) {
      status = 'fail';
      errorMessage = err.message || String(err);
      results.failed++;
    }

    const durationMs = Date.now() - testStart;
    const testResult = {
      id: t.id,
      name: t.name,
      suite: t.suite,
      tier: t.tier,
      feature: t.feature,
      milestone: t.milestone,
      status,
      durationMs,
      error: errorMessage,
    };
    results.tests.push(testResult);

    if (!json && verbose) {
      const tag = `[Tier ${t.tier}][${t.feature}][${t.milestone}]`;
      if (status === 'pass') {
        console.log(`  ${colors.green}✓${colors.reset} ${colors.gray}${tag}${colors.reset} ${colors.bold}${t.id}${colors.reset}: ${t.name} ${colors.dim}(${durationMs}ms)${colors.reset}`);
      } else {
        console.log(`  ${colors.red}✗${colors.reset} ${colors.yellow}${tag}${colors.reset} ${colors.bold}${t.id}${colors.reset}: ${t.name} ${colors.dim}(${durationMs}ms)${colors.reset}`);
        console.log(`    ${colors.red}Error: ${errorMessage}${colors.reset}`);
      }
    }

    if (bail && status === 'fail') {
      if (!json && verbose) {
        console.log(`\n${colors.red}Execution halted on first failure (--bail specified).${colors.reset}`);
      }
      break;
    }
  }

  results.durationMs = Date.now() - results.startTime;

  if (json) {
    console.log(JSON.stringify(results, null, 2));
  } else if (verbose) {
    console.log(`\n${colors.bold}----------------------------------------------------------------${colors.reset}`);
    console.log(`${colors.bold}E2E Test Execution Summary:${colors.reset}`);
    console.log(`  Total:   ${results.total}`);
    console.log(`  Passed:  ${colors.green}${results.passed}${colors.reset}`);
    console.log(`  Failed:  ${results.failed > 0 ? colors.red + results.failed + colors.reset : '0'}`);
    console.log(`  Time:    ${results.durationMs}ms`);
    console.log(`${colors.bold}----------------------------------------------------------------${colors.reset}\n`);

    // Tier Breakdown Summary
    const tierStats = {};
    for (const t of results.tests) {
      if (!tierStats[t.tier]) tierStats[t.tier] = { passed: 0, failed: 0, total: 0 };
      tierStats[t.tier].total++;
      if (t.status === 'pass') tierStats[t.tier].passed++;
      else tierStats[t.tier].failed++;
    }
    console.log(`${colors.bold}Tier Breakdown:${colors.reset}`);
    for (const [tierNum, s] of Object.entries(tierStats)) {
      const passColor = s.failed === 0 ? colors.green : colors.yellow;
      console.log(`  Tier ${tierNum}: ${passColor}${s.passed}/${s.total} passed${colors.reset} (${s.failed} failed)`);
    }
    console.log('');
  }

  return results;
}

module.exports = {
  expect,
  describe,
  test,
  it: test,
  runTests,
  utils,
  testRegistry,
};
