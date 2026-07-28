import { z } from "zod"

const COMMON_BREACHED_PASSWORDS = new Set(
  [
    "password",
    "password1",
    "password123",
    "password123!",
    "123456",
    "12345678",
    "123456789",
    "1234567890",
    "qwerty",
    "qwerty123",
    "abc123",
    "letmein",
    "welcome",
    "welcome1",
    "admin",
    "admin123",
    "passw0rd",
    "p@ssw0rd",
    "changeme",
    "Password1",
    "Password1!",
    "Password123",
    "Password123!",
    "Welcome1",
    "Welcome1!",
    "TempPass1!",
    "Healthcare1!",
    "Universal1!",
  ].map((value) => value.toLowerCase())
)

export function isCommonBreachedPassword(password: string): boolean {
  const normalized = password.trim().toLowerCase()
  if (!normalized) return false
  if (COMMON_BREACHED_PASSWORDS.has(normalized)) return true
  return COMMON_BREACHED_PASSWORDS.has(normalized.replace(/[^a-z0-9]/g, ""))
}

export const STRONG_PASSWORD_MESSAGE =
  "Password must be at least 10 characters and include uppercase, lowercase, a number, and a special character."

export const BREACHED_PASSWORD_MESSAGE =
  "This password is too common or appears in known breach lists. Choose a different password."

export const PASSWORD_REQUIREMENTS = [
  {
    id: "length",
    label: "At least 10 characters",
    test: (password: string) => password.length >= 10,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "One number",
    test: (password: string) => /[0-9]/.test(password),
  },
  {
    id: "special",
    label: "One special character",
    test: (password: string) => /[^A-Za-z0-9]/.test(password),
  },
  {
    id: "breached",
    label: "Not a commonly breached password",
    test: (password: string) => !isCommonBreachedPassword(password),
  },
] as const

export function isStrongPassword(password: string): boolean {
  return PASSWORD_REQUIREMENTS.every((requirement) =>
    requirement.test(password)
  )
}

export const strongPasswordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters.")
  .refine(isStrongPassword, {
    message: STRONG_PASSWORD_MESSAGE,
  })
  .refine((value) => !isCommonBreachedPassword(value), {
    message: BREACHED_PASSWORD_MESSAGE,
  })
