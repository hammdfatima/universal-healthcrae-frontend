/**
 * Browser requests always use the same-origin `/api/v1` proxy so the httpOnly
 * auth cookie is first-party. That is required for reliable mobile login when
 * the API is hosted on a different site (e.g. *.onrender.com).
 */
export function getApiBaseUrl() {
  return "/api/v1"
}
