/**
 * storageRename — ULARA codemod §1.1 shims for the storage-key rename
 * ("never force-reset users").
 *
 * Every renamed key follows ONE discipline, enforced by these helpers:
 *   · READ the new key first; fall back to the LEGACY key (the retired
 *     identity's spelling) when the new one is absent;
 *   · ADOPT a legacy value by writing it through to the new key (the
 *     legacy copy is then never needed again);
 *   · WRITE only the new key;
 *   · REMOVE both names on every clear path (logout / reset), so no
 *     orphaned legacy copy outlives the session that wrote it.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken, setToken } from "./tokenStorage";

/**
 * AsyncStorage read with the rename shim: new key first, legacy fallback,
 * adopt + write-through. Never throws (a broken store reads as absent).
 */
export async function getItemRenamed(newKey: string, legacyKey: string): Promise<string | null> {
  let fresh: string | null = null;
  try {
    fresh = await AsyncStorage.getItem(newKey);
  } catch {
    fresh = null;
  }
  if (fresh !== null) return fresh;
  let legacy: string | null = null;
  try {
    legacy = await AsyncStorage.getItem(legacyKey);
  } catch {
    return null;
  }
  if (legacy !== null) {
    // adopt: persist the value under the new name immediately
    void AsyncStorage.setItem(newKey, legacy).catch(() => undefined);
  }
  return legacy;
}

/** AsyncStorage removal of BOTH names (clear / reset paths). Never throws. */
export async function removeItemRenamed(newKey: string, legacyKey: string): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(newKey).catch(() => undefined),
    AsyncStorage.removeItem(legacyKey).catch(() => undefined),
  ]);
}

/**
 * SecureStore (platform-honest, via tokenStorage) read with the rename
 * shim: new key first, legacy fallback, adopt + write-through.
 */
export async function getTokenRenamed(newKey: string, legacyKey: string): Promise<string | null> {
  const fresh = await getToken(newKey);
  if (fresh !== null) return fresh;
  const legacy = await getToken(legacyKey);
  if (legacy !== null) await setToken(newKey, legacy);
  return legacy;
}

/** SecureStore removal of BOTH names (logout clears every spelling). */
export async function removeTokenRenamed(newKey: string, legacyKey: string): Promise<void> {
  await Promise.all([setToken(newKey, null), setToken(legacyKey, null)]);
}

/**
 * A storage facade for the renamed key that satisfies BOTH the zustand
 * `createJSONStorage` StateStorage shape and the resilience persister's
 * `AsyncStorageLike`: reads with the legacy fallback (adopting once),
 * writes only the new key, and removes both names. The key argument is
 * accepted but ignored — each site constructs its own facade with the
 * key pair bound.
 */
export function renamedAsyncStorage(newKey: string, legacyKey: string) {
  return {
    getItem(_key?: string): Promise<string | null> {
      return getItemRenamed(newKey, legacyKey);
    },
    setItem(_key: string, value: string): Promise<void> {
      return AsyncStorage.setItem(newKey, value).catch(() => undefined);
    },
    removeItem(_key: string): Promise<void> {
      return removeItemRenamed(newKey, legacyKey);
    },
  };
}
