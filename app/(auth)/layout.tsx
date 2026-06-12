import Image from "next/image"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen">
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/auth-hero.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            aria-hidden
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-secondary/75 via-secondary/45 to-secondary/15"
          />
        </div>

        <div className="relative z-10 flex justify-center p-4 py-8 sm:p-6 sm:py-10 lg:justify-end lg:pr-8 xl:pr-14">
          <div className="w-full max-w-md rounded-3xl border border-border/40 bg-background p-8 shadow-2xl sm:max-w-2xl sm:p-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
