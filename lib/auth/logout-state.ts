/** Tracks intentional logout so 401 handlers don't open the session-expired modal. */

let loggingOut = false

export function beginLogout() {
  loggingOut = true
}

export function endLogout() {
  loggingOut = false
}

export function isLoggingOut() {
  return loggingOut
}
