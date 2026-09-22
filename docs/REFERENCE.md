# claude-config-sync — implementation reference

Source revision: `833b7cdf21e2d9e2185aa03a5adf13c832026a85`. This reference records source declarations; it is not a transcript of a successful run.

## Entrypoint and runtime

[package.json](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/package.json) declares `bin/sync.js`. Node.js `>=18.0.0` and npm; Git is also used by the implementation.

Executable mapping: `claude-config-sync` → `./bin/sync.js`.

## Supported workflow

Shared-repository initialization; configured sync paths; settings merge; configuration diff and sync status.

Pull and push can change local configuration and a remote Git repository. Review shared rules/hooks before applying them. The merge strategy is not a conflict-free security boundary.

## Declared command interface

Options belong to the preceding command in the linked source; they are not necessarily global.

| Kind | Declaration | Source description | Source |
| --- | --- | --- | --- |
| command | `init <repo-url>` | Link this project to a shared config repo | [src/index.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/index.js) |
| option | `-b, --branch <branch>` | Branch to use | [src/index.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/index.js) |
| command | `pull` | Pull latest configs from the shared repo into this project | [src/index.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/index.js) |
| command | `push` | Push local config changes to the shared repo | [src/index.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/index.js) |
| option | `-m, --message <msg>` | Custom commit message | [src/index.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/index.js) |
| command | `diff` | Show what differs between local and shared repo configs | [src/index.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/index.js) |
| command | `status` | Show sync status (up-to-date, behind, ahead, diverged) | [src/index.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/index.js) |

## Option defaults

These are literal defaults or parsers declared by the command builder; flags belong to their command as shown above.

| Option | Declared default / parser |
| --- | --- |
| `-b, --branch <branch>` | `'main'` |

## Package scripts

| Script | Exact command |
| --- | --- |
| `test` | `node --test` |

## Implementation sources

[src/index.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/index.js).

## Verification boundary

No repository code, tests, network operation, hook installer or migration was executed for this review. Source inspection supports the documented interface; runtime correctness and external-service compatibility remain unverified.
