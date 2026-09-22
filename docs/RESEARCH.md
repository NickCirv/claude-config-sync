# claude-config-sync — documentation research

Reviewed 21 September 2026. Public GitHub source only.

## Revision and scope

- Commit: [`833b7cdf21e2d9e2185aa03a5adf13c832026a85`](https://github.com/NickCirv/claude-config-sync/commit/833b7cdf21e2d9e2185aa03a5adf13c832026a85).
- Tree: `c88573c54ce60de5a3d9556cb2cadc0b477bce32`; truncated: `false`.
- Capture: 11 of 11 eligible text files; all eligible text files.
- Method: package and entrypoint inspection, implementation-interface review, targeted behavior/limitation inspection, and test-source review. This is not an exhaustive correctness or security audit.
- Commands run against repository code: **none**. External services, deployment and npm publication were not verified.

## Claim and evidence map

| Documentation claim | Pinned evidence | Assessment |
| --- | --- | --- |
| Runtime, executable and development commands | [package.json](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/package.json) | Source declaration inspected; runtime unverified |
| Shares selected Claude project configuration through a Git repository. | [bin/sync.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/bin/sync.js) · [src/index.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/index.js) | Implementation interfaces inspected; behavior not executed |
| Shared-repository initialization; configured sync paths; settings merge; configuration diff and sync status. | [bin/sync.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/bin/sync.js), [src/config.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/config.js), [src/differ.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/differ.js), [src/index.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/index.js), [src/merger.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/merger.js), [src/syncer.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/syncer.js) | Source-backed scope, not a test result |
| Pull and push can change local configuration and a remote Git repository. Review shared rules/hooks before applying them. The merge strategy is not a conflict-free security boundary. | [bin/sync.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/bin/sync.js), [src/config.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/config.js), [src/differ.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/differ.js), [src/index.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/index.js), [src/merger.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/merger.js), [src/syncer.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/syncer.js) | Material limits documented; service compatibility remains open |
| Existing checks | [test/smoke.test.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/test/smoke.test.js) | Test source read; no passing-run claim |

## Documentation inventory and disposition

| Existing document | Decision |
| --- | --- |
| [README.md](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/README.md) | Rewritten with source-specific purpose, direct checkout setup, limitations and verification status. Old section fragments retained where practical. |

Added `docs/REFERENCE.md` for the observed implementation and command surface, and this research record. Protected license and attribution files remain in their original locations without edits. No source or product UI was changed.

## Quality dimensions

| Dimension | Status | Evidence / next step |
| --- | --- | --- |
| Pinned provenance | Verified | Captured commit, tree and per-file hashes recorded below |
| Interface documentation | Partially verified | Source inspection only; run clean-checkout quickstart |
| Runtime behavior | Unverified | No repository execution in this review |
| Test results | Unverified | Existing tests were not run |
| Deployment / package availability | Unverified | No remote publish or live-service check |
| Visual / link checks | Unverified | Portfolio renderer and independent QA are separate from this authoring step |

## Unresolved issues

Pull and push can change local configuration and a remote Git repository. Review shared rules/hooks before applying them. The merge strategy is not a conflict-free security boundary.

## Captured source inventory

This lists captured provenance, not a claim that every line received a full audit. Binary/generated/excluded files are outside the eligible text capture.

| File | SHA-256 | Bytes |
| --- | --- | --- |
| [LICENSE](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/LICENSE) | `68729cab364d82364078b08d8580ccfa51dc69c81a7d64e8d8d47a1da6c9349d` | 1072 |
| [README.md](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/README.md) | `368d6463b1854285102aa82e2c32451dd73eeb26e1e17c5f3af5f717db29c13e` | 2244 |
| [package.json](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/package.json) | `795d381142a3c5c9cf15f43fe2a9ff5d4c0e0a115b89c5ead9f1a3698a6a5b15` | 785 |
| [.github/workflows/ci.yml](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/.github/workflows/ci.yml) | `433fbf65635a767ef5cd787147104c248d0cea6bbd6523c6c862f915e0e3206a` | 384 |
| [bin/sync.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/bin/sync.js) | `d8a7ec112395c1e9080b4fe7b4e7ad1c37338e884524be74ba0cb935674150d4` | 68 |
| [src/config.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/config.js) | `917bd2d9e7b6a543fa0b4917b1fd36232f41a9dcba384eeec59ae0874337c3f7` | 1435 |
| [src/differ.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/differ.js) | `3c54015b1193f10e97db68a12c362fea19aa95a7e86dd33bf9b390e71df13291` | 3653 |
| [src/index.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/index.js) | `385c0e1a2b9393f70db4bc6626440be417e741ac8782ba1e3ca67ae4fd3a5650` | 6580 |
| [src/merger.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/merger.js) | `b41b5bdbfb5f3e7daa32d8dd8b62430ce8db71166d8b4fe6d5fee3c1949c2b16` | 1810 |
| [src/syncer.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/src/syncer.js) | `fee282f0afe7d72d822e7d2f13926fda6d5db4e2427cc90c4c93d3809e10ba9f` | 5736 |
| [test/smoke.test.js](https://github.com/NickCirv/claude-config-sync/blob/833b7cdf21e2d9e2185aa03a5adf13c832026a85/test/smoke.test.js) | `18b886e1d21595b293d8d26d319ceb93037d798567930878587c15e610ea994e` | 457 |
