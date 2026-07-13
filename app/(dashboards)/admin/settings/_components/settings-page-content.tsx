"use client"

import { KeyRound, Settings, ShieldCheck, UserRound } from "lucide-react"

import AdminAuthenticatorMfaTab from "@/app/(dashboards)/admin/settings/_components/authenticator-mfa-tab"
import AdminChangePasswordTab from "@/app/(dashboards)/admin/settings/_components/change-password-tab"
import AdminProfileTab from "@/app/(dashboards)/admin/settings/_components/profile-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

const tabTriggerClass = cn(
  "rounded-full px-4 py-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground",
  "text-foreground/75 hover:bg-secondary/60 hover:text-secondary-foreground"
)

export default function AdminSettingsPageContent() {
  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Settings className="size-6" aria-hidden />
        </span>
        <div>
          <Typography as="h1" variant="h3">
            Settings
          </Typography>
          <Typography variant="muted" className="mt-1">
            Manage your admin profile and account security.
          </Typography>
        </div>
      </div>

      <Tabs defaultValue="profile" className="mt-8 gap-6">
        <TabsList className="thin-scrollbar h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl border border-border/60 bg-muted/40 p-1.5 sm:w-fit">
          <TabsTrigger value="profile" className={tabTriggerClass}>
            <UserRound className="size-4" aria-hidden />
            Profile
          </TabsTrigger>
          <TabsTrigger value="password" className={tabTriggerClass}>
            <KeyRound className="size-4" aria-hidden />
            Change Password
          </TabsTrigger>
          <TabsTrigger value="mfa" className={tabTriggerClass}>
            <ShieldCheck className="size-4" aria-hidden />
            Authenticator MFA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <AdminProfileTab />
        </TabsContent>
        <TabsContent value="password">
          <AdminChangePasswordTab />
        </TabsContent>
        <TabsContent value="mfa">
          <AdminAuthenticatorMfaTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
