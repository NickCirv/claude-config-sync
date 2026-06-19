<div align="center">

# claude-config-sync

**Keep every developer's Claude Code rules, hooks, and settings in sync via a shared git repo.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue?labelColor=0B0A09)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen?labelColor=0B0A09)](package.json)

</div>

## Install

```bash
npx github:NickCirv/claude-config-sync <command>
```

Or link it globally for repeated use:

```bash
npm install -g github:NickCirv/claude-config-sync
```

## Usage

```bash
# 1. Point a project at your shared config repo
npx github:NickCirv/claude-config-sync init git@github.com:your-org/claude-configs.git

# 2. Pull shared configs into this project
npx github:NickCirv/claude-config-sync pull

# 3. After editing local configs, push them back
npx github:NickCirv/claude-config-sync push --message "add rate-limit rule"
```

| Command | Description |
|---|---|
| `init <repo-url>` | Link this project to a shared config repo (creates `.claude-sync.json`) |
| `pull` | Pull latest configs from the shared repo into this project |
| `push [-m <msg>]` | Push local config changes back to the shared repo |
| `diff` | Show what differs between local and shared (`+` local-only, `-` shared-only, `~` modified) |
| `status` | Report whether you are up-to-date, behind, ahead, or diverged |

`init` accepts `-b, --branch <branch>` (default: `main`).

## What it syncs

| Path | How |
|---|---|
| `.claude/rules/*.md` | Copied verbatim (team-wide rules) |
| `.claude/settings.json` | Smart-merged — shared keys added, local keys kept |
| `CLAUDE.md` | Copied if a shared version exists |

The smart merge means no developer loses personal overrides: shared-only keys are added, local-only keys are kept, conflicting keys keep the local value, and arrays are unioned (deduplicated).

## What it does

`claude-config-sync` lets a team manage Claude Code configuration the same way they manage code. One shared git repo acts as the source of truth for rules, hooks, and settings; each project runs `pull` to stay current and `push` to contribute changes back. No API keys, no servers — just git.

---
<sub>Node ≥18 · MIT · by <a href="https://github.com/NickCirv">NickCirv</a></sub>
