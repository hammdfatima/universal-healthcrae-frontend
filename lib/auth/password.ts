import { z } from "zod"

export const STRONG_PASSWORD_MESSAGE =
  "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character."

export const PASSWORD_REQUIREMENTS = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
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
] as const

export function isStrongPassword(password: string): boolean {
  return PASSWORD_REQUIREMENTS.every((requirement) =>
    requirement.test(password)
  )
}

export const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .refine(isStrongPassword, {
    message: STRONG_PASSWORD_MESSAGE,
  })
