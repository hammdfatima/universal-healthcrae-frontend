export const AUTH_SESSION_CHANGE_EVENT = "uhc:auth-session-change"

export function dispatchAuthSessionChange() {
  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(new Event(AUTH_SESSION_CHANGE_EVENT))
}
