import ChangePasswordTab from "@/app/(dashboards)/patient/settings/_components/change-password-tab"
import { Typography } from "@/components/ui/typography"

export default function RequiredChangePasswordPage() {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <Typography as="h1" variant="h3">
        Change your password
      </Typography>
      <Typography variant="muted" className="mt-2">
        For your security, please set a new password before continuing to your
        dashboard.
      </Typography>

      <div className="mt-8">
        <ChangePasswordTab required />
      </div>
    </div>
  )
}
