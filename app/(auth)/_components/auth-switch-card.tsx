"use client"

import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import LoginForm from "@/app/(auth)/_components/login-form"
import SignupForm from "@/app/(auth)/_components/signup-form"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

type AuthMode = "login" | "signup"

type AuthSwitchCardProps = {
  initialMode: AuthMode
}

function syncAuthUrl(mode: AuthMode) {
  const nextPath = mode === "login" ? "/login" : "/signup"
  if (window.location.pathname !== nextPath) {
    window.history.replaceState(null, "", nextPath)
  }
  document.title =
    mode === "login"
      ? "Log in | Universal Health Charts"
      : "Sign up | Universal Health Charts"
}

export default function AuthSwitchCard({ initialMode }: AuthSwitchCardProps) {
  const pathname = usePathname()
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const isSignup = mode === "signup"

  useEffect(() => {
    if (pathname === "/login" || pathname === "/signup") {
      setMode(pathname === "/signup" ? "signup" : "login")
    }
  }, [pathname])

  const switchMode = useCallback((next: AuthMode) => {
    setMode(next)
    syncAuthUrl(next)
  }, [])

  return (
    <div className="h-dvh w-full">
      {/* Mobile: single-panel switch */}
      <div className="h-full overflow-y-auto bg-card md:hidden">
        <div className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center p-6 sm:p-8">
          {isSignup ? (
            <SignupForm compact onSwitchToLogin={() => switchMode("login")} />
          ) : (
            <LoginForm compact onSwitchToSignup={() => switchMode("signup")} />
          )}
        </div>
      </div>

      {/* Desktop: full-viewport sliding overlay */}
      <div
        data-mode={mode}
        className="relative hidden h-full overflow-hidden bg-card md:block"
      >
        <div
          className={cn(
            "absolute inset-y-0 left-0 z-10 flex w-1/2 items-start overflow-y-auto px-10 py-10 transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] lg:px-16 xl:px-20",
            isSignup
              ? "pointer-events-none -translate-x-full opacity-0"
              : "pointer-events-auto translate-x-0 opacity-100"
          )}
        >
          <div className="my-auto w-full max-w-md">
            <LoginForm />
          </div>
        </div>

        <div
          className={cn(
            "absolute inset-y-0 left-0 z-[5] flex w-1/2 items-start overflow-y-auto px-10 py-10 transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] lg:px-16 xl:px-20",
            isSignup
              ? "pointer-events-auto z-10 translate-x-full opacity-100"
              : "pointer-events-none translate-x-full opacity-0"
          )}
        >
          <div className="my-auto w-full max-w-md">
            <SignupForm />
          </div>
        </div>

        <div
          className={cn(
            "absolute inset-y-0 left-1/2 z-20 w-1/2 overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            isSignup
              ? "-translate-x-full rounded-r-[7rem] rounded-l-none"
              : "translate-x-0 rounded-l-[7rem] rounded-r-none"
          )}
        >
          <div
            className={cn(
              "relative -left-full flex h-full w-[200%] bg-gradient-to-br from-brand-secondary via-[#006644] to-brand-primary transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
              isSignup ? "translate-x-1/2" : "translate-x-0"
            )}
          >
            <div
              className={cn(
                "flex w-1/2 flex-col items-center justify-center gap-4 px-10 text-center text-white transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] lg:px-14",
                isSignup
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-[40%] opacity-0"
              )}
            >
              <Typography
                as="h2"
                className="text-3xl font-bold tracking-tight text-white lg:text-4xl"
              >
                Welcome Back!
              </Typography>
              <p className="max-w-xs text-sm leading-relaxed text-white/85 lg:text-base">
                Already have an account? Sign in to access your secure health
                records and family profiles.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-2 min-w-[140px] border-white/70 bg-transparent text-white hover:bg-white/10 hover:text-white"
                onClick={() => switchMode("login")}
              >
                Sign In
              </Button>
            </div>

            <div
              className={cn(
                "flex w-1/2 flex-col items-center justify-center gap-4 px-10 text-center text-white transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] lg:px-14",
                isSignup
                  ? "translate-x-[40%] opacity-0"
                  : "translate-x-0 opacity-100"
              )}
            >
              <Typography
                as="h2"
                className="text-3xl font-bold tracking-tight text-white lg:text-4xl"
              >
                Hello, Friend!
              </Typography>
              <p className="max-w-xs text-sm leading-relaxed text-white/85 lg:text-base">
                New here? Create your Universal Health Charts account and keep
                your care information ready when it matters.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-2 min-w-[140px] border-white/70 bg-transparent text-white hover:bg-white/10 hover:text-white"
                onClick={() => switchMode("signup")}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
