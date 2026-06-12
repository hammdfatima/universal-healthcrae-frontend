import { Clock, Mail, MessageCircle } from "lucide-react"
import type { Metadata } from "next"

import ContactForm from "@/app/_components/contact-form"
import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

export const metadata: Metadata = {
  title: "Contact | Universal Health Charts",
  description:
    "Get in touch with Universal Health Charts — we're here to help with questions about your secure health record.",
}

const contactDetails = [
  {
    icon: Mail,
    title: "Email us",
    description: "support@universalhealthcharts.com",
    detail: "For general questions, account help, or technical support.",
  },
  {
    icon: Clock,
    title: "Response time",
    description: "Within 1–2 business days",
    detail: "We aim to respond to all inquiries as quickly as possible.",
  },
  {
    icon: MessageCircle,
    title: "How we can help",
    description: "Plans, features & emergency access",
    detail:
      "Ask about subscriptions, medical vault storage, or Emergency QR codes.",
  },
] as const

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-border/70 bg-brand-primary-light/40 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Typography as="h1" variant="h1">
            Contact Us
          </Typography>
          <Typography variant="lead" color="muted" className="mt-4">
            Have a question about Universal Health Charts? We&apos;re here to
            help you get the most out of your secure medical vault.
          </Typography>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-5 lg:items-stretch lg:gap-14">
          <div className="flex h-full flex-col gap-4 lg:col-span-2">
            {contactDetails.map(
              ({ icon: Icon, title, description, detail }) => (
                <Card
                  key={title}
                  className="flex flex-1 flex-col border-border/80 shadow-sm"
                >
                  <CardContent className="flex flex-1 gap-4 p-5">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <Typography as="h3" variant="h5">
                        {title}
                      </Typography>
                      <Typography
                        variant="small"
                        color="primary"
                        className="mt-1 text-base"
                      >
                        {description}
                      </Typography>
                      <Typography variant="muted" className="mt-2">
                        {detail}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>

          <Card className="flex h-full flex-col border-border/80 shadow-md lg:col-span-3">
            <CardContent className="flex h-full flex-1 flex-col p-6 sm:p-8">
              <Typography as="h2" variant="h3" className="mb-2">
                Send us a message
              </Typography>
              <Typography variant="muted" className="mb-6">
                Fill out the form below and our team will get back to you
                shortly.
              </Typography>
              <div className="flex min-h-0 flex-1 flex-col">
                <ContactForm />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
