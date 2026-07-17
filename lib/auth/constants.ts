export const AUTH_API = {
  signup: "/auth/signup",
  login: "/auth/login",
  logout: "/auth/logout",
  verifyEmail: "/auth/verify-email",
  resendVerification: "/auth/resend-verification",
  forgotPassword: "/auth/forgot-password",
  verifyResetOtp: "/auth/verify-reset-otp",
  resetPassword: "/auth/reset-password",
  session: "/auth/session",
  verifyMfaLogin: "/auth/mfa/verify-login",
  mfaStatus: "/auth/mfa",
  mfaSetup: "/auth/mfa/setup",
  mfaEnable: "/auth/mfa/enable",
  mfaDisable: "/auth/mfa/disable",
} as const

export const AUTH_STORAGE_KEYS = {
  token: "uhc_auth_token",
  user: "uhc_auth_user",
  resetToken: "uhc_reset_token",
  lastActivity: "uhc_last_activity",
} as const

/** Cookie readable by Next.js proxy for route-level role guards. */
export const AUTH_COOKIE_KEYS = {
  role: "uhc_auth_role",
  present: "uhc_auth_present",
} as const

/** Matches backend JWT expiry (24 hours). */
export const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000

/** Sign out after this period with no user interaction. */
export const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000

export type SessionEndReason =
  | "expired"
  | "inactive"
  | "blocked"
  | "revoked"
  | "family_access"
