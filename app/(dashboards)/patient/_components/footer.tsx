import { Typography } from "@/components/ui/typography"

export default function PatientFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="shrink-0 rounded-full bg-primary px-4 py-3 text-center text-primary-foreground shadow-sm">
      <Typography
        variant="small"
        color="inherit"
        className="text-primary-foreground/90"
      >
        &copy; {year} Universal Health Charts. All rights reserved.
      </Typography>
    </footer>
  )
}
