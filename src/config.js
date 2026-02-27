import fs from 'fs';
import path from 'path';

const CONFIG_FILE = '.claude-sync.json';

/**
 * Find .claude-sync.json by walking up from cwd.
 * Returns the directory containing it, or null if not found.
 */
export function findConfigDir(startDir = process.cwd()) {
  let dir = startDir;
  while (true) {
    const candidate = path.join(dir, CONFIG_FILE);
    if (fs.existsSync(candidate)) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

/**
 * Read .claude-sync.json from a given directory.
 */
export function readConfig(dir) {
  const file = path.join(dir, CONFIG_FILE);
  if (!fs.existsSync(file)) {
    throw new Error(`No ${CONFIG_FILE} found. Run 'claude-config-sync init' first.`);
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    throw new Error(`Failed to parse ${file}. Ensure it is valid JSON.`);
  }
}

/**
 * Write .claude-sync.json to a given directory.
 */
export function writeConfig(dir, config) {
  const file = path.join(dir, CONFIG_FILE);
  fs.writeFileSync(file, JSON.stringify(config, null, 2) + '\n', 'utf8');
}

/**
 * Return a fresh default config skeleton.
 */
export function defaultConfig(repoUrl, branch = 'main') {
  return {
    repo: repoUrl,
    branch,
    lastSync: null,
    syncPaths: [
      '.claude/rules',
      '.claude/settings.json',
      'CLAUDE.md',
    ],
    mergeSettings: true,
  };
}
