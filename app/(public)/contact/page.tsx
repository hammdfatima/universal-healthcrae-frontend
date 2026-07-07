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
    <div className="w-full overflow-x-clip">
      <section className="border-b border-border/70 bg-brand-primary-light/40 py-10 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-3xl px-5 text-center sm:px-6 lg:px-8">
          <Typography as="h1" variant="h1" className="text-3xl sm:text-5xl">
            Contact Us
          </Typography>
          <Typography
            variant="lead"
            color="muted"
            className="mt-3 text-base sm:mt-4 sm:text-xl"
          >
            Have a question about Universal Health Charts? We&apos;re here to
            help you get the most out of your secure medical vault.
          </Typography>
        </div>
      </section>

      <section className="py-10 pb-24 sm:py-16 sm:pb-20 lg:py-20">
        <div className="mx-auto w-full max-w-6xl min-w-0 px-5 sm:px-6 lg:px-8">
          <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-5 lg:items-stretch lg:gap-14">
            <div className="flex min-w-0 flex-col gap-4 sm:gap-5 lg:col-span-2">
              {contactDetails.map(
                ({ icon: Icon, title, description, detail }) => (
                  <Card
                    key={title}
                    className="w-full min-w-0 overflow-hidden border-border/80 shadow-sm"
                  >
                    <CardContent className="flex min-w-0 items-start gap-4 p-5 sm:p-6">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <Typography as="h3" variant="h5">
                          {title}
                        </Typography>
                        <Typography
                          variant="small"
                          color="primary"
                          className="mt-1 break-all text-base"
                        >
                          {description}
                        </Typography>
                        <Typography
                          variant="muted"
                          className="mt-2 break-words"
                        >
                          {detail}
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>

            <Card className="w-full min-w-0 overflow-hidden border-border/80 shadow-md lg:col-span-3">
              <CardContent className="flex min-w-0 flex-col p-5 sm:p-8">
                <Typography as="h2" variant="h3" className="mb-2">
                  Send us a message
                </Typography>
                <Typography variant="muted" className="mb-6">
                  Fill out the form below and our team will get back to you
                  shortly.
                </Typography>
                <div className="flex min-w-0 flex-col">
                  <ContactForm />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
