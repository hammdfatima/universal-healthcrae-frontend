"use client"

import type { LucideIcon } from "lucide-react"
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  FlaskConical,
  History,
  LayoutDashboard,
  LogOut,
  QrCode,
  ScanLine,
  Settings,
  Shield,
  Syringe,
  UserRound,
  Users,
} from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import {
  type MedicalVaultCounts,
  useMedicalVaultCounts,
} from "@/app/(dashboards)/patient/_lib/use-medical-vault-counts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useAuth } from "@/hooks/use-auth"
import { useFetch } from "@/hooks/use-fetch"
import { useSubscriptionPlan } from "@/hooks/use-subscription-plan"
import {
  MEDICAL_RECORD_SHARES_API,
  MEDICAL_RECORD_SHARES_QUERY_KEYS,
  type SidebarFamilyResponse,
} from "@/lib/api/medical-record-shares"
import {
  PATIENT_PROFILE_API,
  PATIENT_PROFILE_QUERY_KEYS,
  type PatientProfileResponse,
} from "@/lib/api/patient-profile"
import { getRoleLabel } from "@/lib/auth/roles"
import { getUserDisplayName, getUserInitials } from "@/lib/auth/utils"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  href: Route
  icon: LucideIcon
  badge?: string
}

type NavGroup = {
  label: string
  items: NavItem[]
}

type VaultItem = NavItem

const navItemBase =
  "flex items-center gap-3 rounded-full text-sm font-medium transition-colors"
const navItemActive = "bg-secondary text-secondary-foreground shadow-sm"
const navItemIdle =
  "text-foreground/75 hover:bg-secondary hover:text-secondary-foreground"

type VaultItemConfig = {
  countKey: keyof MedicalVaultCounts
  label: string
  href: Route
  icon: LucideIcon
}

const medicalVaultItemConfig: VaultItemConfig[] = [
  {
    countKey: "medications",
    label: "Medications",
    href: "/patient/medications" as Route,
    icon: Activity,
  },
  {
    countKey: "allergies",
    label: "Known Allergies",
    href: "/patient/allergies" as Route,
    icon: AlertTriangle,
  },
  {
    countKey: "healthHistory",
    label: "Health History",
    href: "/patient/health-history" as Route,
    icon: History,
  },
  {
    countKey: "vaccinations",
    label: "Immunizations",
    href: "/patient/vaccinations" as Route,
    icon: Syringe,
  },
  {
    countKey: "labResults",
    label: "Laboratory",
    href: "/patient/lab" as Route,
    icon: FlaskConical,
  },
  {
    countKey: "imagingResults",
    label: "Imaging",
    href: "/patient/imaging" as Route,
    icon: ScanLine,
  },
]

function buildMedicalVaultItems(counts: MedicalVaultCounts): VaultItem[] {
  return medicalVaultItemConfig.map((item) => ({
    label: item.label,
    href: item.href,
    icon: item.icon,
    badge: String(counts[item.countKey]),
  }))
}

const overviewNavBase: NavGroup = {
  label: "Main",
  items: [{ label: "Overview", href: "/patient", icon: LayoutDashboard }],
}

const careTeamNav: NavGroup = {
  label: "Your Care Team",
  items: [
    {
      label: "Care Providers",
      href: "/patient/provider" as Route,
      icon: UserRound,
    },
  ],
}

const accountNav: NavItem[] = [
  {
    label: "Emergency QR",
    href: "/patient/emergency-qr" as Route,
    icon: QrCode,
  },
  {
    label: "Settings",
    href: "/patient/settings" as Route,
    icon: Settings,
  },
]

const vaultPaths = medicalVaultItemConfig.map((item) => item.href)

function NavLink({
  item,
  onNavigate,
  nested = false,
}: {
  item: NavItem
  onNavigate?: () => void
  nested?: boolean
}) {
  const pathname = usePathname()
  const isActive =
    pathname === item.href ||
    (item.href !== "/patient" && pathname.startsWith(item.href))
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        navItemBase,
        nested ? "px-3 py-2" : "px-3 py-2.5",
        isActive ? navItemActive : navItemIdle
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      <span className="flex-1">{item.label}</span>
      {item.badge ? (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
            isActive
              ? "bg-secondary-foreground/20 text-secondary-foreground"
              : "bg-secondary/15 text-secondary"
          )}
        >
          {item.badge}
        </span>
      ) : null}
    </Link>
  )
}

function MedicalVaultNav({
  counts,
  onNavigate,
}: {
  counts: MedicalVaultCounts
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const medicalVaultItems = useMemo(
    () => buildMedicalVaultItems(counts),
    [counts]
  )
  const isVaultActive = vaultPaths.some(
    (path) => pathname === path || pathname.startsWith(path)
  )
  const [open, setOpen] = useState(isVaultActive)

  useEffect(() => {
    if (isVaultActive) {
      setOpen(true)
    }
  }, [isVaultActive])

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className={cn(
          navItemBase,
          "w-full px-3 py-2.5",
          isVaultActive ? navItemActive : navItemIdle
        )}
      >
        <Shield className="size-4 shrink-0" aria-hidden />
        <span className="flex-1 text-left">Medical Vault</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1 space-y-0.5 pl-2">
        <ul className="space-y-0.5 border-l border-border pl-2">
          {medicalVaultItems.map((item) => (
            <li key={item.href}>
              <NavLink item={item} onNavigate={onNavigate} nested />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth()
  const { counts: medicalVaultCounts } = useMedicalVaultCounts()
  const { data: profile } = useFetch<PatientProfileResponse>({
    path: PATIENT_PROFILE_API.get,
    queryKey: PATIENT_PROFILE_QUERY_KEYS.profile,
  })
  const { planName, supportsFamilyMembers, navLabel } = useSubscriptionPlan()
  const isAccountOwner = !user?.isFamilyMemberAccount
  const showFamilyNav =
    (supportsFamilyMembers && isAccountOwner) ||
    Boolean(user?.isFamilyMemberAccount)

  const { data: sidebarFamily } = useFetch<SidebarFamilyResponse>({
    path: MEDICAL_RECORD_SHARES_API.sidebarFamily,
    queryKey: MEDICAL_RECORD_SHARES_QUERY_KEYS.sidebarFamily,
    enabled: Boolean(user) && showFamilyNav,
  })

  if (!user) {
    return null
  }

  const displayName = getUserDisplayName(user)
  const initials = getUserInitials(user)
  const profileImage = profile?.profileImage ?? user.profileImage ?? null
  const overviewItems: NavItem[] = [...overviewNavBase.items]
  const familyCount = sidebarFamily?.members.length ?? 0

  if (showFamilyNav) {
    overviewItems.push({
      label: isAccountOwner ? navLabel : "My Family",
      href: "/patient/family-members" as Route,
      icon: Users,
      badge: familyCount > 0 ? String(familyCount) : undefined,
    })
  }

  return (
    <div className="flex min-h-full flex-col p-4">
      <div className="mb-6 rounded-4xl border border-border bg-background p-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-11 border-2 border-border">
            {profileImage ? (
              <AvatarImage src={profileImage} alt={displayName} />
            ) : null}
            <AvatarFallback className="bg-secondary/10 text-sm font-semibold text-secondary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">
              {displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="rounded-full border-secondary/30 bg-secondary/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-secondary uppercase"
          >
            {getRoleLabel(user.role)}
          </Badge>
          {planName ? (
            <Badge
              variant="outline"
              className="rounded-full border-border bg-muted px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
            >
              {planName}
            </Badge>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 space-y-5">
        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            {overviewNavBase.label}
          </p>
          <ul className="space-y-0.5">
            {overviewItems.map((item) => (
              <li key={item.href}>
                <NavLink item={item} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            My Health
          </p>
          <MedicalVaultNav
            counts={medicalVaultCounts}
            onNavigate={onNavigate}
          />
        </div>

        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            {careTeamNav.label}
          </p>
          <ul className="space-y-0.5">
            {careTeamNav.items.map((item) => (
              <li key={item.href}>
                <NavLink item={item} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mt-4 border-t border-border pt-4">
        <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Account
        </p>
        <ul className="space-y-0.5">
          {accountNav.map((item) => (
            <li key={item.href}>
              <NavLink item={item} onNavigate={onNavigate} />
            </li>
          ))}
          <li>
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "h-auto w-full justify-start",
                navItemBase,
                "px-3 py-2.5",
                navItemIdle
              )}
              onClick={() => {
                onNavigate?.()
                logout()
              }}
            >
              <LogOut className="size-4 shrink-0" aria-hidden />
              Logout
            </Button>
          </li>
        </ul>
      </div>
    </div>
  )
}

type PatientSidebarProps = {
  mobileOpen?: boolean
  onMobileOpenChange?: (open: boolean) => void
}

export default function PatientSidebar({
  mobileOpen = false,
  onMobileOpenChange,
}: PatientSidebarProps) {
  return (
    <>
      <aside className="hidden w-[17.5rem] shrink-0 self-stretch lg:block">
        <div className="sticky top-3 flex max-h-[calc(100vh-1.5rem)] flex-col overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-lg">
          <div className="thin-scrollbar flex-1 overflow-y-auto">
            <SidebarContent />
          </div>
        </div>
      </aside>

      {onMobileOpenChange ? (
        <div
          className={cn(
            "fixed inset-0 z-50 lg:hidden",
            mobileOpen ? "block" : "hidden"
          )}
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => onMobileOpenChange(false)}
          />
          <aside className="thin-scrollbar relative flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto rounded-r-3xl border border-border/60 bg-muted shadow-xl">
            <SidebarContent onNavigate={() => onMobileOpenChange(false)} />
          </aside>
        </div>
      ) : null}
    </>
  )
}
