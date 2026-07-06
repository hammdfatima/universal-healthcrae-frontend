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
}

export type AuthTokenResponse = {
  token: string
  user: AuthUser
}

export type ResetTokenResponse = {
  resetToken: string
}

export type MessageResponse = {
  message: string
}
