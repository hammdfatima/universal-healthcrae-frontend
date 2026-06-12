"use client"

import { CreditCard, KeyRound, Settings, UserRound } from "lucide-react"

import AccountTab from "@/app/(dashboards)/patient/settings/_components/account-tab"
import ChangePasswordTab from "@/app/(dashboards)/patient/settings/_components/change-password-tab"
import ProfileTab from "@/app/(dashboards)/patient/settings/_components/profile-tab"
import SubscriptionTab from "@/app/(dashboards)/patient/settings/_components/subscription-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

const tabTriggerClass = cn(
  "rounded-full px-4 py-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground",
  "text-foreground/75 hover:bg-secondary/60 hover:text-secondary-foreground"
)

export default function SettingsPageContent() {
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
            Manage your profile, subscription, account, and security.
          </Typography>
        </div>
      </div>

      <Tabs defaultValue="profile" className="mt-8 gap-6">
        <TabsList className="thin-scrollbar h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl border border-border/60 bg-muted/40 p-1.5 sm:w-fit">
          <TabsTrigger value="profile" className={tabTriggerClass}>
            <UserRound className="size-4" aria-hidden />
            Profile
          </TabsTrigger>
          <TabsTrigger value="subscription" className={tabTriggerClass}>
            <CreditCard className="size-4" aria-hidden />
            Manage Subscription
          </TabsTrigger>
          <TabsTrigger value="account" className={tabTriggerClass}>
            <Settings className="size-4" aria-hidden />
            Manage Account
          </TabsTrigger>
          <TabsTrigger value="password" className={tabTriggerClass}>
            <KeyRound className="size-4" aria-hidden />
            Change Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="subscription">
          <SubscriptionTab />
        </TabsContent>
        <TabsContent value="account">
          <AccountTab />
        </TabsContent>
        <TabsContent value="password">
          <ChangePasswordTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
