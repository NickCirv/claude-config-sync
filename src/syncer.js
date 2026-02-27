import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFileSync } from 'child_process';
import chalk from 'chalk';
import { mergeSettings } from './merger.js';

const CLONE_BASE = path.join(os.tmpdir(), 'claude-config-sync');

/**
 * Return a deterministic temp path for a given repo URL.
 */
function cloneDir(repoUrl) {
  const slug = repoUrl
    .replace(/https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .slice(0, 80);
  return path.join(CLONE_BASE, slug);
}

/**
 * Ensure the shared repo is cloned / up-to-date in temp.
 */
export function ensureSharedRepo(repoUrl, branch) {
  const dir = cloneDir(repoUrl);

  if (fs.existsSync(path.join(dir, '.git'))) {
    git(['fetch', 'origin'], dir);
    git(['checkout', branch], dir);
    git(['reset', '--hard', `origin/${branch}`], dir);
  } else {
    fs.mkdirSync(dir, { recursive: true });
    git(['clone', '--branch', branch, '--single-branch', repoUrl, '.'], dir);
  }

  return dir;
}

/**
 * Pull: copy files from shared repo into the local project.
 */
export function pull(projectDir, repoUrl, branch, syncPaths, mergeSettingsFlag) {
  const sharedDir = ensureSharedRepo(repoUrl, branch);

  for (const syncPath of syncPaths) {
    const src = path.join(sharedDir, syncPath);
    const dest = path.join(projectDir, syncPath);

    if (!fs.existsSync(src)) continue;

    const stat = fs.statSync(src);

    if (stat.isDirectory()) {
      copyDir(src, dest, mergeSettingsFlag);
    } else if (syncPath.endsWith('settings.json') && mergeSettingsFlag) {
      const sharedObj = JSON.parse(fs.readFileSync(src, 'utf8'));
      mergeSettings(dest, sharedObj);
      console.log(chalk.cyan(`  merged  ${syncPath}`));
    } else {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      console.log(chalk.green(`  pulled  ${syncPath}`));
    }
  }
}

/**
 * Push: copy local project files into the shared repo clone, then commit+push.
 */
export function push(projectDir, repoUrl, branch, syncPaths, message) {
  const sharedDir = ensureSharedRepo(repoUrl, branch);

  let changed = false;

  for (const syncPath of syncPaths) {
    const src = path.join(projectDir, syncPath);
    const dest = path.join(sharedDir, syncPath);

    if (!fs.existsSync(src)) continue;

    const stat = fs.statSync(src);

    if (stat.isDirectory()) {
      copyDir(src, dest, false);
      changed = true;
      console.log(chalk.green(`  staged  ${syncPath}/`));
    } else {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      changed = true;
      console.log(chalk.green(`  staged  ${syncPath}`));
    }
  }

  if (!changed) {
    console.log(chalk.dim('  Nothing to push.'));
    return;
  }

  git(['add', '--all'], sharedDir);

  const status = git(['status', '--porcelain'], sharedDir);
  if (!status.trim()) {
    console.log(chalk.dim('  Shared repo already up-to-date.'));
    return;
  }

  const commitMsg = message || `sync: update claude configs from ${os.hostname()}`;
  git(['commit', '-m', commitMsg], sharedDir);
  git(['push', 'origin', branch], sharedDir);
  console.log(chalk.green(`\n  Pushed to ${repoUrl} (${branch})`));
}

/**
 * Return sync status relative to shared repo.
 * Returns: 'up-to-date' | 'behind' | 'ahead' | 'diverged'
 */
export function syncStatus(projectDir, repoUrl, branch, syncPaths) {
  const sharedDir = ensureSharedRepo(repoUrl, branch);

  let localOnly = 0;
  let sharedOnly = 0;

  for (const syncPath of syncPaths) {
    const local = path.join(projectDir, syncPath);
    const shared = path.join(sharedDir, syncPath);
    const localExists = fs.existsSync(local);
    const sharedExists = fs.existsSync(shared);

    if (localExists && !sharedExists) localOnly++;
    if (!localExists && sharedExists) sharedOnly++;
    if (localExists && sharedExists) {
      if (contentChanged(local, shared)) {
        localOnly++;
        sharedOnly++;
      }
    }
  }

  if (localOnly === 0 && sharedOnly === 0) return 'up-to-date';
  if (localOnly > 0 && sharedOnly === 0) return 'ahead';
  if (localOnly === 0 && sharedOnly > 0) return 'behind';
  return 'diverged';
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function git(args, cwd) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (err) {
    throw new Error(`git ${args[0]} failed: ${err.stderr || err.message}`);
  }
}

function copyDir(src, dest, mergeSettingsFlag) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcEntry = path.join(src, entry.name);
    const destEntry = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcEntry, destEntry, mergeSettingsFlag);
    } else if (entry.name === 'settings.json' && mergeSettingsFlag) {
      const sharedObj = JSON.parse(fs.readFileSync(srcEntry, 'utf8'));
      mergeSettings(destEntry, sharedObj);
    } else {
      fs.copyFileSync(srcEntry, destEntry);
    }
  }
}

function contentChanged(localPath, sharedPath) {
  const ls = fs.statSync(localPath);
  const ss = fs.statSync(sharedPath);

  if (ls.isDirectory() !== ss.isDirectory()) return true;
  if (ls.isDirectory()) {
    // Shallow check: compare file lists
    const lFiles = fs.readdirSync(localPath).sort().join('|');
    const sFiles = fs.readdirSync(sharedPath).sort().join('|');
    return lFiles !== sFiles;
  }

  return fs.readFileSync(localPath, 'utf8') !== fs.readFileSync(sharedPath, 'utf8');
}
