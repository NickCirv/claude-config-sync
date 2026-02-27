import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

/**
 * Compare local project files against the shared repo clone.
 *
 * Returns an array of diff objects:
 *   { file, status: 'added' | 'removed' | 'modified' | 'identical' }
 */
export function diffConfigs(projectDir, sharedDir, syncPaths) {
  const diffs = [];

  for (const syncPath of syncPaths) {
    const localFull = path.join(projectDir, syncPath);
    const sharedFull = path.join(sharedDir, syncPath);

    const localIsDir = fs.existsSync(localFull) && fs.statSync(localFull).isDirectory();
    const sharedIsDir = fs.existsSync(sharedFull) && fs.statSync(sharedFull).isDirectory();

    if (localIsDir || sharedIsDir) {
      // Directory: compare all .md and .json files inside
      const localFiles = localIsDir ? listFiles(localFull) : [];
      const sharedFiles = sharedIsDir ? listFiles(sharedFull) : [];
      const allRelative = new Set([...localFiles, ...sharedFiles]);

      for (const rel of allRelative) {
        const lPath = path.join(localFull, rel);
        const sPath = path.join(sharedFull, rel);
        diffs.push(compareFiles(path.join(syncPath, rel), lPath, sPath));
      }
    } else {
      diffs.push(compareFiles(syncPath, localFull, sharedFull));
    }
  }

  return diffs;
}

function compareFiles(label, localPath, sharedPath) {
  const localExists = fs.existsSync(localPath);
  const sharedExists = fs.existsSync(sharedPath);

  if (!localExists && !sharedExists) {
    return { file: label, status: 'identical' };
  }
  if (localExists && !sharedExists) {
    return { file: label, status: 'added' };      // local has it, shared doesn't
  }
  if (!localExists && sharedExists) {
    return { file: label, status: 'removed' };    // shared has it, local doesn't
  }

  const localContent = fs.readFileSync(localPath, 'utf8');
  const sharedContent = fs.readFileSync(sharedPath, 'utf8');

  if (localContent === sharedContent) {
    return { file: label, status: 'identical' };
  }

  return {
    file: label,
    status: 'modified',
    localLines: localContent.split('\n').length,
    sharedLines: sharedContent.split('\n').length,
  };
}

/**
 * Print a human-readable diff summary to stdout.
 */
export function printDiff(diffs) {
  const counts = { added: 0, removed: 0, modified: 0, identical: 0 };

  for (const d of diffs) {
    counts[d.status]++;
    switch (d.status) {
      case 'added':
        console.log(chalk.green(`  + ${d.file}`) + chalk.dim('  (local only — not in shared repo)'));
        break;
      case 'removed':
        console.log(chalk.red(`  - ${d.file}`) + chalk.dim('  (in shared repo — missing locally)'));
        break;
      case 'modified':
        console.log(
          chalk.yellow(`  ~ ${d.file}`) +
          chalk.dim(`  (local: ${d.localLines} lines, shared: ${d.sharedLines} lines)`)
        );
        break;
      case 'identical':
        console.log(chalk.dim(`    ${d.file}  (identical)`));
        break;
    }
  }

  console.log('');
  console.log(
    chalk.green(`+${counts.added} added`) + '  ' +
    chalk.red(`-${counts.removed} removed`) + '  ' +
    chalk.yellow(`~${counts.modified} modified`) + '  ' +
    chalk.dim(`=${counts.identical} identical`)
  );

  return counts;
}

function listFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      for (const child of listFiles(path.join(dir, entry.name))) {
        results.push(path.join(entry.name, child));
      }
    } else if (/\.(md|json)$/.test(entry.name)) {
      results.push(entry.name);
    }
  }
  return results;
}
