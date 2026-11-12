/**
 * R326 M1.3(e) — RTL direction, applied safely.
 *
 * `I18nManager.forceRTL(true)` at module scope only takes effect on the NEXT
 * native launch. On a fresh install the first session therefore runs LTR
 * while the JS tree renders RTL-authored layouts → mirrored screens. The fix:
 * keep the module-scope calls (they bake the preference), and on startup do
 * ONE controlled reload when the native side hasn't caught up — guarded by a
 * persisted flag so it can never loop.
 *
 * ULARA codemod §1.1: the flag key was renamed; an upgrade that already
 * reloaded under the legacy key is treated as applied (adopted into the
 * new key) so it never reloads a second time.
 */
import { I18nManager } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "ula.rtl.applied.v1";
/** The retired identity's key — read as "already applied" (§1.1). */
const LEGACY_KEY = "tdmr.rtl.applied.v1";

/**
 * Returns true when a reload was requested (caller should not render the app
 * this tick — show the splash instead).
 */
export async function ensureRTL(): Promise<boolean> {
  try {
    if (I18nManager.isRTL) {
      await AsyncStorage.setItem(KEY, "1").catch(() => undefined);
      return false;
    }
    const read = async (k: string) => AsyncStorage.getItem(k).catch(() => null);
    const done = (await read(KEY)) === "1" || (await read(LEGACY_KEY)) === "1";
    if (done) {
      // Already reloaded once (this key or the legacy one) and the native
      // side still reports LTR (expo-go / platform quirk). Adopt the legacy
      // flag into the new key, render anyway — never loop.
      await AsyncStorage.setItem(KEY, "1").catch(() => undefined);
      return false;
    }
    await AsyncStorage.setItem(KEY, "1").catch(() => undefined);
    // Controlled restart so the baked RTL direction goes live now, not on
    // the user's second launch.
    try {
      const Updates = await import("expo-updates");
      await Updates.reloadAsync();
      return true;
    } catch {
      // reloadAsync unavailable (no updates runtime) — the direction applies
      // on the next natural launch; render rather than freeze.
      return false;
    }
  } catch {
    return false;
  }
}
