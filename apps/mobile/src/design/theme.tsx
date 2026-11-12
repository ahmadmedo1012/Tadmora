import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { renamedAsyncStorage } from "@/lib/storageRename";
import { heron, statusTones, type HeronPalette, type StatusTone, type StatusToneName, type ThemeName } from "./tokens";
import { semanticThemeFor, type SemanticTheme } from "./semantic";

export type ThemePreference = "light" | "dark" | "system";

interface ThemeState {
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
}

/** The retired identity's persisted-theme key — read-fallback only (§1.1). */
const LEGACY_THEME_KEY = "tadmora-mobile-theme";

const useThemeStore = create(
  persist<ThemeState>(
    (set) => ({
      preference: "light",
      setPreference: (preference) => set({ preference }),
    }),
    {
      // §1.1 rename shim: reads the legacy persisted theme once, adopts it
      // under the new key, writes only the new key from then on.
      name: "ula-mobile-theme",
      storage: createJSONStorage(() =>
        renamedAsyncStorage("ula-mobile-theme", LEGACY_THEME_KEY),
      ),
    },
  ),
);

export function useThemePreference(): ThemePreference {
  return useThemeStore((s) => s.preference);
}

export function setThemePreference(p: ThemePreference) {
  useThemeStore.getState().setPreference(p);
}

/** Effective theme for the current preference + device scheme. */
export function useTheme(): {
  name: ThemeName;
  palette: HeronPalette;
  tones: Record<StatusToneName, StatusTone>;
  /** R334 2-f — additive: the semantic seat layer (never breaks consumers). */
  semantic: SemanticTheme;
} {
  const preference = useThemePreference();
  const system = useColorScheme();
  const name: ThemeName = preference === "system" ? (system === "dark" ? "dark" : "light") : preference;
  return useMemo(
    () => ({ name, palette: heron[name], tones: statusTones[name], semantic: semanticThemeFor(name) }),
    [name],
  );
}

export function themeFor(name: ThemeName) {
  return { name, palette: heron[name], tones: statusTones[name], semantic: semanticThemeFor(name) };
}

/** Palette as a StyleSheet-compatible flat object (for non-hook contexts). */
export function usePalette(): HeronPalette {
  return useTheme().palette;
}

export function useStatusTones(): Record<StatusToneName, StatusTone> {
  return useTheme().tones;
}

/** R334 2-f — the semantic color layer (surface/elevated/sunken seats,
 *  hairline presets, THE accent, status triples) resolved for the
 *  effective theme. See ./semantic + docs/mobile/foundations/theming.md. */
export function useSemanticTheme(): SemanticTheme {
  return useTheme().semantic;
}

export interface ThemeContextValue {
  name: ThemeName;
}

export const ThemeContext = createContext<ThemeContextValue>({ name: "light" });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { name } = useTheme();
  const value = useMemo(() => ({ name }), [name]);
  useEffect(() => {
    const el = globalThis.document?.documentElement;
    if (el) {
      el.setAttribute("dir", "rtl");
      el.setAttribute("lang", "ar");
      el.setAttribute("data-theme", name);
    }
  }, [name]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
