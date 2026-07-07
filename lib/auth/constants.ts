export const AUTH_API = {
  signup: "/auth/signup",
  login: "/auth/login",
  verifyEmail: "/auth/verify-email",
  resendVerification: "/auth/resend-verification",
  forgotPassword: "/auth/forgot-password",
  verifyResetOtp: "/auth/verify-reset-otp",
  resetPassword: "/auth/reset-password",
} as const

export const AUTH_STORAGE_KEYS = {
  token: "uhc_auth_token",
  user: "uhc_auth_user",
  resetToken: "uhc_reset_token",
  lastActivity: "uhc_last_activity",
} as const

/** Matches backend JWT expiry (24 hours). */
export const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000

/** Sign out after this period with no user interaction. */
export const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000

export type SessionEndReason = "expired" | "inactive" | "blocked" | "revoked"
