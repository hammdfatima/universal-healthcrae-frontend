import Footer from "@/app/_components/footer"
import Header from "@/app/_components/header"

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
