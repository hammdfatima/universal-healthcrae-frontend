import axios from "axios"

/** True when the API blocked a request because authenticator MFA is not enrolled yet. */
export function isMfaSetupRequiredError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false
  }

  if (error.response?.status !== 403) {
    return false
  }

  const message = String(error.response.data?.message ?? "").toLowerCase()
  return message.includes("mfa setup required")
}
