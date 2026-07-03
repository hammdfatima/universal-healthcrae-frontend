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
} as const
