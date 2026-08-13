/**
 * Server-only backend URL helpers. Browser code must keep using getApiBaseUrl()
 * (`/api/v1`) so auth cookies stay first-party.
 */
export function getBackendApiBaseUrl() {
  const backendApiUrl = process.env.BACKEND_API_URL?.trim()
  if (backendApiUrl) {
    return backendApiUrl.replace(/\/+$/, "")
  }

  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (publicApiUrl && /^https?:\/\//i.test(publicApiUrl)) {
    return publicApiUrl.replace(/\/+$/, "")
  }

  return "http://localhost:8080/api/v1"
}

/** Origin of the API process (health lives at `/health`, not under `/api/v1`). */
export function getBackendOrigin() {
  return getBackendApiBaseUrl().replace(/\/api\/v1$/i, "")
}
