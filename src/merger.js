import fs from 'fs';

/**
 * Smart merge for settings.json.
 *
 * Strategy:
 *  - Local keys win (no overwrite of existing keys).
 *  - Shared-only keys are added to local.
 *  - Arrays are unioned (deduped), not replaced.
 *
 * This means a team can add new hooks / allowed-tools without
 * clobbering each developer's personal overrides.
 */
export function mergeSettings(localPath, sharedObj) {
  let local = {};
  if (fs.existsSync(localPath)) {
    try {
      local = JSON.parse(fs.readFileSync(localPath, 'utf8'));
    } catch {
      // corrupt local — start fresh
    }
  }

  const merged = deepMerge(sharedObj, local);
  fs.writeFileSync(localPath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
  return merged;
}

/**
 * Deep merge where `override` values win over `base`.
 * Arrays are unioned on string/number primitives; objects recurse.
 */
function deepMerge(base, override) {
  if (!isObject(base) || !isObject(override)) {
    // Scalar: override wins
    return override !== undefined ? override : base;
  }

  const result = { ...base };

  for (const key of Object.keys(override)) {
    const baseVal = base[key];
    const overrideVal = override[key];

    if (Array.isArray(baseVal) && Array.isArray(overrideVal)) {
      result[key] = unionArray(baseVal, overrideVal);
    } else if (isObject(baseVal) && isObject(overrideVal)) {
      result[key] = deepMerge(baseVal, overrideVal);
    } else {
      result[key] = overrideVal;
    }
  }

  return result;
}

function isObject(val) {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

function unionArray(a, b) {
  const set = new Set([...a, ...b].map(v =>
    typeof v === 'object' ? JSON.stringify(v) : v
  ));
  return [...set].map(v => {
    try { return JSON.parse(v); } catch { return v; }
  });
}
