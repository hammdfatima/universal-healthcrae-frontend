export type UserRole = "USER" | "ADMIN"

export type AuthUser = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  name: string | null
  profileImage?: string | null
  role: UserRole
  emailVerified: boolean
  mustChangePassword?: boolean
  isFamilyMemberAccount?: boolean
  mfaEnabled?: boolean
  /** HIPAA §2.5: server signal to prompt MFA enrollment right after sign-in. */
  mfaSetupRequired?: boolean
}

/** Successful authenticated session (cookie set by API). */
export type AuthTokenResponse = {
  mfaRequired: false
  user: AuthUser
}

export type MfaChallengeResponse = {
  mfaRequired: true
  mfaToken: string
}

export type LoginResponse = AuthTokenResponse | MfaChallengeResponse

export type SessionValidationResponse = {
  valid: true
  user: AuthUser
}

export type MfaStatusResponse = {
  mfaEnabled: boolean
}

export type MfaSetupResponse = {
  secret: string
  otpauthUrl: string
}

export type ResetTokenResponse = {
  resetToken: string
}

export type MessageResponse = {
  message: string
}

/** HIPAA §2.4: short-lived token proving a recent password re-entry. */
export type StepUpTokenResponse = {
  stepUpToken: string
}
