import type { ExpoConfig } from "expo/config";

/**
 * تادمورا — Tadmora mobile (Expo / React Native).
 *
 * Brand: the TADMORA system — paper #F6F6EE · ink #282828 · orange #FA3600.
 * The API base URL is public configuration (EXPO_PUBLIC_API_BASE_URL);
 * secrets never belong in this file or in the app bundle.
 */
const config: ExpoConfig = {
  name: "تادمورا",
  slug: "tadmora",
  version: "1.0.0",
  scheme: "tadmora",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  description: "تادمورا — نظام تشغيل الجامعة (تطبيق الجوال الرسمي)",
  backgroundColor: "#F6F6EE",
  primaryColor: "#FA3600",
  ios: {
    bundleIdentifier: "ly.tadmora.mobile",
    supportsTablet: true,
    infoPlist: {
      CFBundleDisplayName: "تادمورا",
      CFBundleLocalizations: ["ar"],
      CFBundleDevelopmentRegion: "ar",
      SupportsRTL: true,
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: "ly.tadmora.mobile",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-foreground.png",
      backgroundImage: "./assets/images/adaptive-background.png",
      monochromeImage: "./assets/images/adaptive-monochrome.png",
    },
    // T-50 (P1-d): Android 14+ predictive back — the app has ZERO
    // BackHandler.preventDefault() calls (grep-verified), so enabling the
    // gesture is safe: sheets/dialogs close with the system cross-activity
    // back animation. Takes effect with the next EAS/gradle build (T-51
    // owns the build + fingerprint bump; OTA alone cannot ship this flag).
    predictiveBackGestureEnabled: true,
  },
  web: {
    output: "single",
    favicon: "./assets/images/favicon.png",
    bundler: "metro",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#F6F6EE",
        dark: { backgroundColor: "#282828" },
        image: "./assets/images/splash-icon.png",
        imageWidth: 120,
      },
    ],
    ["expo-secure-store", {}],
    // R327 C3 — the push notification icon (the brand's white silhouette)
    // + the orange accent for the Android status-bar tint.
    [
      "expo-notifications",
      {
        icon: "./assets/images/notification-icon.png",
        color: "#FA3600",
      },
    ],
    // R340 T-M5 (LR-001) — expo-navigation-bar for Android gesture-handle
    // contrast under enforced edge-to-edge: `enforceContrast` keeps the OS's
    // translucent scrim behind the gesture handle / 3-button bar so it never
    // sits on low-contrast content in dark mode. The concrete bar STYLE is
    // derived at runtime from the effective app theme (src/design/navbar.tsx
    // → AppNavigationBar in app/_layout.tsx); this plugin entry covers the
    // pre-JS cold-boot moment. NEW NATIVE DEP → new fingerprint → needs a
    // new binary build (local gradle path: scripts/build-android-local.sh,
    // docs/mobile/ANDROID-LOCAL.md); OTA alone cannot ship this.
    ["expo-navigation-bar", { enforceContrast: true }],
    ["expo-document-picker", { iCloudDirectoryEnabled: false }],
    "expo-video",
    // R327 C3 — the biometric app-lock (cold-start gate). D3: the
    // FaceID prompt in Arabic (the plugin's default is English).
    [
      "expo-local-authentication",
      { faceIDPermission: "يستخدم التطبيق Face ID للتحقق من هويتك عند فتح التطبيق." },
    ],
    // R326 M0.5 — real OTA: the project's update endpoint, not a username
    // placeholder. runtimeVersion uses the fingerprint policy so any native
    // dependency/plugin/config change produces a new binary+update pairing.
    [
      "expo-updates",
      {
        // TADMORA-REBRAND: a NEW EAS project must be provisioned — the
        // retired pre-rebrand project is intentionally NOT reused
        // (deployment independence). Replace this placeholder after
        // `eas init`.
        url: "https://u.expo.dev/00000000-0000-0000-0000-000000000000",
      },
    ],
  ],
  updates: {
    // TADMORA-REBRAND: placeholder until the new EAS project is provisioned.
    url: "https://u.expo.dev/00000000-0000-0000-0000-000000000000",
    checkAutomatically: "ON_LOAD",
    fallbackToCacheTimeout: 0,
  },
  runtimeVersion: {
    policy: "fingerprint",
  },
  experiments: {
    typedRoutes: true,
    // R327 C5 — reactCompiler ON: the M1.3 crash suspect (reanimated ×
    // compiler) left the tree in C4, and the 87-warning purity ratchet is
    // at zero (every set-state-in-effect / purity / immutability finding
    // fixed by refactor, not suppression). With the plugin on: tsc 0 ·
    // jest 726/726 · export green (4.51 MB, −27% vs the R327-open
    // baseline). D2 fresh device builds are the confirmation step; the
    // rollback is this one flag.
    reactCompiler: true,
  },
  extra: {
    // Public configuration — safe to inline. The default targets the deployed
    // production API at all times so a bare clone works out of the box.
    apiBaseUrl:
      process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://tadmora.vercel.app/api/v1",
    eas: {
      // TADMORA-REBRAND: placeholder — run `eas init` to bind the NEW project.
      projectId: "00000000-0000-0000-0000-000000000000",
    },
  },
};

export default config;
