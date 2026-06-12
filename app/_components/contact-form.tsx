"use client"

import { useState } from "react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useToast from "@/hooks/use-toast"

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(1, "Please select a subject."),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(1000, "Message must be 1000 characters or less."),
})

const subjectOptions = [
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Technical Support" },
  { value: "billing", label: "Billing & Subscriptions" },
  { value: "partnership", label: "Partnership" },
] as const

const defaultValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
}

export default function ContactForm() {
  const { toastSuccess } = useToast()
  const [formKey, setFormKey] = useState(0)

  return (
    <FormModified
      key={formKey}
      schema={contactSchema}
      defaultValues={defaultValues}
      formKey={formKey}
      formProps={{ className: "flex h-full flex-1 flex-col" }}
      fieldsetProps={{ className: "flex h-full flex-1 flex-col gap-5" }}
      onSubmit={() => {
        toastSuccess(
          "Thank you! We'll get back to you within 1–2 business days."
        )
        setFormKey((key) => key + 1)
      }}
    >
      {({ components: { Input, Textarea, Field } }) => (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input name="name" label="Full Name" placeholder="John Smith" />
            <Input
              name="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <Field name="subject" label="Subject">
            {(field) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  {subjectOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>

          <Textarea
            name="message"
            label="Message"
            placeholder="How can we help you?"
            formItemClassName="flex min-h-0 flex-1 flex-col"
            className="min-h-32 flex-1"
          />

          <Button type="submit" className="mt-auto w-full sm:w-auto">
            Send Message
          </Button>
        </>
      )}
    </FormModified>
  )
}
