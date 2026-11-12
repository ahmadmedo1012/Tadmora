/**
 * Session — authenticated identity, institution context, and role.
 * Mirrors frontend/src/stores/auth.store.ts semantics for the native app:
 *  - accessToken (15 min) + refresh cookie value persisted in SecureStore.
 *  - user JSON (non-secret profile) persisted in AsyncStorage under
 *    ula-mobile-user. Cache clearing happens at every session boundary.
 *
 * ULARA codemod §1.1: the keys were renamed away from the retired
 * identity's mobile key family; reads fall back to the legacy keys and
 * adopt (write-through), so an upgrading user keeps their session, and
 * logout clears BOTH spellings.
 */
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setToken } from "@/lib/tokenStorage";
import { getTokenRenamed, removeTokenRenamed, getItemRenamed, removeItemRenamed } from "@/lib/storageRename";
import { apiWithCookieCapture, post, registerAuthBridge, get as apiGet } from "@/api/client";
import type { AuthUser, SessionResponse } from "@/api/types";

const KEY_USER = "ula-mobile-user";
const KEY_ACCESS = "ula-mobile-access-token";
const KEY_REFRESH = "ula-mobile-refresh-cookie";
const KEY_INST = "ula-mobile-active-institution";
/* Legacy spellings — read-fallback + cleared on logout only (§1.1). */
const LEGACY_KEY_USER = "tdmr-mobile-user";
const LEGACY_KEY_ACCESS = "tdmr-mobile-access-token";
const LEGACY_KEY_REFRESH = "tdmr-mobile-refresh-cookie";
const LEGACY_KEY_INST = "tdmr-mobile-active-institution";

export interface SessionState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshCookie: string | null;
  activeInstitutionId: string | null;
  isHydrated: boolean;
  /** Bumped whenever the session is cleared, so the shell can redirect. */
  sessionEpoch: number;

  hydrate: () => Promise<void>;
  setSession: (user: AuthUser, accessToken: string, refreshCookie?: string | null) => void;
  applyUser: (user: AuthUser) => void;
  clearSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  selectInstitution: (institutionId: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  me: () => Promise<AuthUser | null>;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "STUDENT" | "TEACHER";
  institutionId: string;
  facultyId?: string;
  departmentId?: string;
  universityId?: string;
  year?: number;
  specialty?: string;
  rank?: string;
  inviteCode?: string;
}

function persistTokens(accessToken: string | null, refreshCookie: string | null) {
  void setToken(KEY_ACCESS, accessToken);
  void setToken(KEY_REFRESH, refreshCookie);
}

export const useSession = create<SessionState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshCookie: null,
  activeInstitutionId: null,
  isHydrated: false,
  sessionEpoch: 0,

  hydrate: async () => {
    try {
      // §1.1 shims: new key first, legacy fallback, adopt + write-through.
      const [accessToken, refreshCookie, userJson, instId] = await Promise.all([
        getTokenRenamed(KEY_ACCESS, LEGACY_KEY_ACCESS),
        getTokenRenamed(KEY_REFRESH, LEGACY_KEY_REFRESH),
        getItemRenamed(KEY_USER, LEGACY_KEY_USER),
        getItemRenamed(KEY_INST, LEGACY_KEY_INST),
      ]);
      const user = userJson ? (JSON.parse(userJson) as AuthUser) : null;
      set({
        accessToken,
        refreshCookie,
        user,
        activeInstitutionId: user?.currentInstitution?.id ?? instId ?? null,
        isHydrated: true,
      });
    } catch {
      set({ isHydrated: true });
    }
  },

  setSession: (user, accessToken, refreshCookie) => {
    const prev = get();
    const effectiveInst = user.currentInstitution?.id ?? prev.activeInstitutionId;
    persistTokens(accessToken, refreshCookie ?? prev.refreshCookie);
    AsyncStorage.setItem(KEY_USER, JSON.stringify(user)).catch(() => undefined);
    if (effectiveInst) AsyncStorage.setItem(KEY_INST, effectiveInst).catch(() => undefined);
    set({ user, accessToken, activeInstitutionId: effectiveInst });
  },

  applyUser: (user) => {
    AsyncStorage.setItem(KEY_USER, JSON.stringify(user)).catch(() => undefined);
    const activeInstitutionId = user.currentInstitution?.id ?? get().activeInstitutionId;
    if (activeInstitutionId) AsyncStorage.setItem(KEY_INST, activeInstitutionId).catch(() => undefined);
    set({ user, activeInstitutionId });
  },

  clearSession: async () => {
    await Promise.all([
      persistTokens(null, null),
      // §1.1: logout clears BOTH spellings — no legacy orphan survives.
      removeTokenRenamed(KEY_ACCESS, LEGACY_KEY_ACCESS),
      removeTokenRenamed(KEY_REFRESH, LEGACY_KEY_REFRESH),
      removeItemRenamed(KEY_USER, LEGACY_KEY_USER),
      removeItemRenamed(KEY_INST, LEGACY_KEY_INST),
    ]);
    set((s) => ({
      user: null,
      accessToken: null,
      refreshCookie: null,
      activeInstitutionId: null,
      sessionEpoch: s.sessionEpoch + 1,
    }));
  },

  login: async (email, password) => {
    const { data, refreshCookie } = await apiWithCookieCapture<SessionResponse>("/auth/login", {
      method: "POST",
      body: { email: email.trim().toLowerCase(), password },
      _skipAuth: true,
    });
    get().setSession(data.user, data.accessToken, refreshCookie);
    return data.user;
  },

  register: async (payload) => {
    const { data, refreshCookie } = await apiWithCookieCapture<SessionResponse>("/auth/register", {
      method: "POST",
      body: payload,
      _skipAuth: true,
    });
    get().setSession(data.user, data.accessToken, refreshCookie);
    return data.user;
  },

  selectInstitution: async (institutionId) => {
    const { data, refreshCookie } = await apiWithCookieCapture<SessionResponse>("/auth/select-institution", {
      method: "POST",
      body: { institutionId },
    });
    get().setSession(data.user, data.accessToken, refreshCookie ?? undefined);
    AsyncStorage.setItem(KEY_INST, institutionId).catch(() => undefined);
    set({ activeInstitutionId: institutionId });
    return data.user;
  },

  logout: async () => {
    try {
      await post<void>("/auth/logout");
    } catch {
      // Best-effort server revoke; local clear still runs (mirrors web).
    }
    await get().clearSession();
  },

  me: async () => {
    const user = await apiGet<AuthUser>("/auth/me");
    get().applyUser(user);
    return user;
  },
}));

registerAuthBridge({
  getAccessToken: () => useSession.getState().accessToken,
  getRefreshCookie: () => useSession.getState().refreshCookie,
  onSessionUpdate: ({ user, accessToken, refreshCookie }) => {
    useSession.getState().setSession(user as AuthUser, accessToken, refreshCookie ?? undefined);
  },
  onSessionExpired: () => {
    useSession.getState().clearSession();
  },
});

/** Role helpers (belt-locked with frontend/src/lib/roleLabels.ts). */
export const ROLE_HOME: Record<string, string> = {
  STUDENT: "/student/dashboard",
  TEACHER: "/teacher/dashboard",
  ADMIN: "/admin/dashboard",
  QUALITY: "/quality/dashboard",
  OWNER: "/owner/dashboard",
};

export const ROLE_LABELS: Record<string, string> = {
  STUDENT: "طالب",
  TEACHER: "أستاذ",
  ADMIN: "المسجل العام",
  QUALITY: "أخصائي جودة",
  OWNER: "مالك المنصة",
};

export const POSITION_LABELS: Record<string, string> = {
  DEAN: "عميد",
  ASSOCIATE_DEAN: "وكيل عميد",
  DEPARTMENT_HEAD: "رئيس قسم",
};

export const RANK_LABELS: Record<string, string> = {
  LECTURER: "محاضر",
  ASSISTANT_PROFESSOR: "أستاذ مساعد",
  ASSOCIATE_PROFESSOR: "أستاذ مشارك",
  PROFESSOR: "أستاذ",
};
