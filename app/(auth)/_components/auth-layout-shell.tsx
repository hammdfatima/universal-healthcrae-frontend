export default function AuthLayoutShell({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4 sm:p-6">
      <div className="w-full max-w-2xl rounded-3xl border border-border/40 bg-background p-8 shadow-xl sm:p-10">
        {children}
      </div>
    </div>
  )
}
