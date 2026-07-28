import { describe, expect, test } from "bun:test"

import {
  isCommonBreachedPassword,
  isStrongPassword,
  strongPasswordSchema,
} from "@/lib/auth/password"

describe("isStrongPassword", () => {
  test("rejects passwords shorter than 10 characters", () => {
    expect(isStrongPassword("Ab1!")).toBe(false)
  })

  test("rejects passwords missing an uppercase letter", () => {
    expect(isStrongPassword("lowercase1!")).toBe(false)
  })

  test("rejects passwords missing a lowercase letter", () => {
    expect(isStrongPassword("UPPERCASE1!")).toBe(false)
  })

  test("rejects passwords missing a number", () => {
    expect(isStrongPassword("NoNumbers!!")).toBe(false)
  })

  test("rejects passwords missing a special character", () => {
    expect(isStrongPassword("NoSpecial123")).toBe(false)
  })

  test("rejects common breached passwords even if they look strong", () => {
    expect(isStrongPassword("Password123!")).toBe(false)
  })

  test("accepts a password meeting every requirement", () => {
    expect(isStrongPassword("Tr0ub4dor&Zephyr")).toBe(true)
  })
})

describe("isCommonBreachedPassword", () => {
  test("flags known breached passwords case-insensitively", () => {
    expect(isCommonBreachedPassword("password123!")).toBe(true)
    expect(isCommonBreachedPassword("PASSWORD123!")).toBe(true)
  })

  test("flags breached passwords regardless of punctuation", () => {
    expect(isCommonBreachedPassword("Welcome-1!")).toBe(true)
  })

  test("does not flag a unique, strong password", () => {
    expect(isCommonBreachedPassword("Tr0ub4dor&Zephyr")).toBe(false)
  })

  test("does not flag an empty string", () => {
    expect(isCommonBreachedPassword("")).toBe(false)
  })
})

describe("strongPasswordSchema", () => {
  test("passes for a strong, non-breached password", () => {
    const result = strongPasswordSchema.safeParse("Tr0ub4dor&Zephyr")
    expect(result.success).toBe(true)
  })

  test("fails for a password under 10 characters", () => {
    const result = strongPasswordSchema.safeParse("Ab1!Ab1!")
    expect(result.success).toBe(false)
  })

  test("fails for a common breached password", () => {
    const result = strongPasswordSchema.safeParse("Password123!")
    expect(result.success).toBe(false)
  })
})
