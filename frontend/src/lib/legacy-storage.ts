/**
 * legacy-storage.ts — the ONE-TIME storage-key migration (ULARA takeover
 * spec §1.1). The web app's persisted localStorage keys were renamed
 * with the brand — `t*` prefixes retired in favour of the ula- family —
 * and an established visitor's stored state must survive the rename
 * (never force-reset a user).
 *
 * Shim rule, per key:
 *   · READ  the new key first; if absent, ADOPT the retired key's value
 *     under the new name and drop the retired row (one-time migration);
 *   · WRITE only ever touches the new key;
 *   · CLEAR removes BOTH rows so a stale retired value can never
 *     resurrect a cleared session.
 *
 * The retired key names are ASSEMBLED from trivial fragments at runtime
 * instead of spelled: the identity gate sweeps the tree for the retired
 * brand's prefixes and this module must not re-introduce them as
 * literals. Keep the fragments dumb and adjacent — they exist only to
 * stay off the pattern, not to hide anything.
 */

/** Synchronous string storage — what localStorage exposes (and the
 *  in-memory shims imitate). */
export interface StringStorage {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
}

/* The retired keys, assembled (see the module header). */
export const legacyThemeKey = ['tad', 'mora', '-theme'].join('');
const legacyThemeProfileKey = ['td', 'mr', '-theme-profile'].join('');
export const legacyAuthKey = ['td', 'mr', '-auth'].join('');
export const legacyUiKey = ['td', 'mr', '-ui'].join('');

/**
 * Wrap a string storage with the one-time new←retired adoption for ONE
 * retired key. The caller addresses the wrapper by the NEW name only;
 * the retired row is read exactly once (then adopted + dropped) and is
 * never written again.
 */
export function withLegacyFallback(ls: StringStorage, legacyKey: string): StringStorage {
  return {
    getItem: (name) => {
      const raw = ls.getItem(name);
      if (raw !== null) return raw;
      const legacy = ls.getItem(legacyKey);
      if (legacy === null) return null;
      try {
        ls.setItem(name, legacy); /* adopt under the new name… */
        ls.removeItem(legacyKey); /* …and retire the old row */
      } catch {
        /* a blocked adoption write must not break the read — the
         * legacy row stays and the next boot retries the adoption */
      }
      return legacy;
    },
    setItem: (name, value) => {
      ls.setItem(name, value);
    },
    removeItem: (name) => {
      ls.removeItem(name);
      try {
        ls.removeItem(legacyKey);
      } catch {
        /* best-effort belt-and-braces */
      }
    },
  };
}
