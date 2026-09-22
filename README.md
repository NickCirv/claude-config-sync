![Nicholas Ashkar — claude-config-sync](assets/nicholas-ashkar/banner.png)

# claude-config-sync

Shares selected Claude project configuration through a Git repository.






<a id="usage"></a>

<a id="1-point-a-project-at-your-shared-config-repo"></a>

<a id="2-pull-shared-configs-into-this-project"></a>

<a id="3-after-editing-local-configs-push-them-back"></a>

<a id="what-it-syncs"></a>

## What it does

- Shared-repository initialization.
- Configured sync paths.
- Settings merge.
- Configuration diff and sync status.


<a id="install"></a>

## Quickstart

Prerequisites: Node.js `>=18.0.0` and npm; Git is also used by the implementation. The checkout below pins the source used for this documentation.

```sh
git clone https://github.com/NickCirv/claude-config-sync.git
cd claude-config-sync
git checkout 833b7cdf21e2d9e2185aa03a5adf13c832026a85
npm install
node bin/sync.js --help
```

**Expected behavior (illustrative, not captured):** Shows init, pull, push, diff and status commands before a shared repository is configured.

Examples are source-inspected, **not runtime-tested**. See the research record for verification gaps.

## Boundaries and data

Pull and push can change local configuration and a remote Git repository. Review shared rules/hooks before applying them. The merge strategy is not a conflict-free security boundary.

## Development

The manifest defines `npm test` as:

```sh
node --test
```

The captured suite is a smoke check, not end-to-end behavior coverage. Examples include “entry is valid JavaScript”, “--help exits 0”. Tests were not run for this documentation revision.

See [implementation and command reference](docs/REFERENCE.md) for the package scripts and inspected interfaces, and [research record](docs/RESEARCH.md) for the pinned source, document decisions and unresolved checks.

## License and contact

See [LICENSE](LICENSE) for the original terms and attribution. Legal text is unchanged.

[Nicholas Ashkar](https://nicholashkar.com/) · [Discuss a project](https://nicholashkar.com/#oxblood-contact)
