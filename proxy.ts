import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const AUTH_PRESENT_COOKIE = "uhc_auth_present"
const AUTH_ROLE_COOKIE = "uhc_auth_role"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith("/admin")
  const isPatientRoute = pathname.startsWith("/patient")

  if (!isAdminRoute && !isPatientRoute) {
    return NextResponse.next()
  }

  const isPresent = request.cookies.get(AUTH_PRESENT_COOKIE)?.value === "1"
  const role = request.cookies.get(AUTH_ROLE_COOKIE)?.value

  if (!isPresent || !role) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAdminRoute && role !== "ADMIN") {
    const homeUrl = request.nextUrl.clone()
    homeUrl.pathname = "/patient"
    homeUrl.search = ""
    return NextResponse.redirect(homeUrl)
  }

  if (isPatientRoute && role !== "USER") {
    const homeUrl = request.nextUrl.clone()
    homeUrl.pathname = "/admin"
    homeUrl.search = ""
    return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/patient/:path*"],
}
