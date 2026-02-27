import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

import { findConfigDir, readConfig, writeConfig, defaultConfig } from './config.js';
import { pull, push, syncStatus, ensureSharedRepo } from './syncer.js';
import { diffConfigs, printDiff } from './differ.js';

export function run() {
  const program = new Command();

  program
    .name('claude-config-sync')
    .description('Sync Claude Code configs across a team via a shared git repo')
    .version('1.0.0');

  // ── init ──────────────────────────────────────────────────────────────────
  program
    .command('init <repo-url>')
    .description('Link this project to a shared config repo')
    .option('-b, --branch <branch>', 'Branch to use', 'main')
    .action((repoUrl, opts) => {
      const cwd = process.cwd();
      const configPath = path.join(cwd, '.claude-sync.json');

      if (fs.existsSync(configPath)) {
        console.log(chalk.yellow('  .claude-sync.json already exists.'));
        console.log(chalk.dim('  Delete it and re-run init to reconfigure.'));
        process.exit(1);
      }

      const config = defaultConfig(repoUrl, opts.branch);
      writeConfig(cwd, config);

      console.log(chalk.green('\n  Initialized claude-config-sync'));
      console.log(chalk.dim(`  Repo:   ${repoUrl}`));
      console.log(chalk.dim(`  Branch: ${opts.branch}`));
      console.log(chalk.dim(`  Config: ${configPath}`));
      console.log('');
      console.log('  Next steps:');
      console.log(chalk.cyan('    claude-config-sync pull') + '  — pull shared configs');
      console.log(chalk.cyan('    claude-config-sync status') + ' — check sync status');
    });

  // ── pull ──────────────────────────────────────────────────────────────────
  program
    .command('pull')
    .description('Pull latest configs from the shared repo into this project')
    .action(() => {
      const configDir = findConfigDir();
      if (!configDir) return exitNoConfig();

      const config = readConfig(configDir);
      console.log(chalk.dim(`\n  Pulling from ${config.repo} (${config.branch})...\n`));

      try {
        pull(configDir, config.repo, config.branch, config.syncPaths, config.mergeSettings);
        config.lastSync = new Date().toISOString();
        writeConfig(configDir, config);
        console.log(chalk.green('\n  Pull complete.'));
        console.log(chalk.dim(`  Last sync: ${config.lastSync}`));
      } catch (err) {
        console.error(chalk.red(`\n  Pull failed: ${err.message}`));
        process.exit(1);
      }
    });

  // ── push ──────────────────────────────────────────────────────────────────
  program
    .command('push')
    .description('Push local config changes to the shared repo')
    .option('-m, --message <msg>', 'Custom commit message')
    .action((opts) => {
      const configDir = findConfigDir();
      if (!configDir) return exitNoConfig();

      const config = readConfig(configDir);
      console.log(chalk.dim(`\n  Pushing to ${config.repo} (${config.branch})...\n`));

      try {
        push(configDir, config.repo, config.branch, config.syncPaths, opts.message);
        config.lastSync = new Date().toISOString();
        writeConfig(configDir, config);
      } catch (err) {
        console.error(chalk.red(`\n  Push failed: ${err.message}`));
        process.exit(1);
      }
    });

  // ── diff ──────────────────────────────────────────────────────────────────
  program
    .command('diff')
    .description('Show what differs between local and shared repo configs')
    .action(() => {
      const configDir = findConfigDir();
      if (!configDir) return exitNoConfig();

      const config = readConfig(configDir);
      console.log(chalk.dim(`\n  Comparing against ${config.repo} (${config.branch})...\n`));

      try {
        const sharedDir = ensureSharedRepo(config.repo, config.branch);
        const diffs = diffConfigs(configDir, sharedDir, config.syncPaths);
        printDiff(diffs);
      } catch (err) {
        console.error(chalk.red(`\n  Diff failed: ${err.message}`));
        process.exit(1);
      }
    });

  // ── status ────────────────────────────────────────────────────────────────
  program
    .command('status')
    .description('Show sync status (up-to-date, behind, ahead, diverged)')
    .action(() => {
      const configDir = findConfigDir();
      if (!configDir) return exitNoConfig();

      const config = readConfig(configDir);
      console.log(chalk.dim(`\n  Checking status against ${config.repo} (${config.branch})...\n`));

      try {
        const status = syncStatus(configDir, config.repo, config.branch, config.syncPaths);
        const lastSync = config.lastSync
          ? new Date(config.lastSync).toLocaleString()
          : 'never';

        const icons = {
          'up-to-date': chalk.green('  up-to-date'),
          'behind':     chalk.yellow('  behind') + chalk.dim(' — run pull to update'),
          'ahead':      chalk.cyan('  ahead') + chalk.dim(' — run push to share'),
          'diverged':   chalk.red('  diverged') + chalk.dim(' — pull then push to reconcile'),
        };

        console.log(`  Status:    ${icons[status]}`);
        console.log(chalk.dim(`  Last sync: ${lastSync}`));
        console.log(chalk.dim(`  Repo:      ${config.repo}`));
        console.log(chalk.dim(`  Branch:    ${config.branch}`));
        console.log(chalk.dim(`  Paths:     ${config.syncPaths.join(', ')}`));
        console.log('');
      } catch (err) {
        console.error(chalk.red(`\n  Status check failed: ${err.message}`));
        process.exit(1);
      }
    });

  program.parse(process.argv);
}

function exitNoConfig() {
  console.error(chalk.red('\n  No .claude-sync.json found in this directory or any parent.'));
  console.error(chalk.dim('  Run: claude-config-sync init <repo-url>'));
  process.exit(1);
}
