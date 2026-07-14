"use client"

import { useEffect, useState } from "react"

import {
  billingCycleOptions,
  planToFormValues,
  type SubscriptionPlan,
  type SubscriptionPlanFormValues,
  sanitizePriceInput,
  subscriptionPlanDefaultValues,
  subscriptionPlanSchema,
} from "@/app/(dashboards)/admin/_lib/subscription-plans"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import FormModified from "@/components/ui/form-modified"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SubscriptionPlanFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan?: SubscriptionPlan | null
  isSubmitting?: boolean
  onSave: (values: SubscriptionPlanFormValues, planId?: string) => void
}

export default function SubscriptionPlanFormDialog({
  open,
  onOpenChange,
  plan,
  isSubmitting = false,
  onSave,
}: SubscriptionPlanFormDialogProps) {
  const isEditing = Boolean(plan)
  const [defaultValues, setDefaultValues] =
    useState<SubscriptionPlanFormValues>(subscriptionPlanDefaultValues)
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    if (open) {
      setDefaultValues(
        plan ? planToFormValues(plan) : subscriptionPlanDefaultValues
      )
      setFormKey((key) => key + 1)
    }
  }, [open, plan])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
          <DialogTitle>
            {isEditing ? "Edit Subscription Plan" : "Add Subscription Plan"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update pricing, member limit, pets, and features."
              : "Create a subscription plan with pricing, seat limit, and features."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5">
          <FormModified
            key={formKey}
            schema={subscriptionPlanSchema}
            defaultValues={defaultValues}
            fieldsetProps={{ className: "space-y-5" }}
            onSubmit={(values) => {
              onSave(values, plan?.id)
            }}
          >
            {({ components }) => {
              const { Input: FormInput, Textarea, Field } = components

              return (
                <>
                  <FormInput
                    name="planName"
                    label="Plan Name"
                    placeholder="e.g. Individual Plan"
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      name="price"
                      label="Price (USD)"
                      description="Enter the amount in dollars. Currency is fixed to USD."
                    >
                      {(field) => (
                        <div className="relative">
                          <span className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            placeholder="9.95"
                            className="pl-8 tabular-nums"
                            value={(field.value as string) ?? ""}
                            onBlur={field.onBlur}
                            onChange={(event) => {
                              field.onChange(
                                sanitizePriceInput(event.target.value)
                              )
                            }}
                          />
                        </div>
                      )}
                    </Field>

                    <Field name="billingCycle" label="Billing Cycle">
                      {(field) => (
                        <Select
                          value={field.value as string}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select billing cycle" />
                          </SelectTrigger>
                          <SelectContent>
                            {billingCycleOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormInput
                      name="memberLimit"
                      label="Member limit"
                      type="number"
                      placeholder="0"
                      description="Extra household seats beyond the account owner (0 = individual)."
                    />

                    <Field name="allowsPets" label="Allows pets">
                      {(field) => (
                        <label className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-3 text-sm">
                          <input
                            type="checkbox"
                            className="size-4 accent-primary"
                            checked={Boolean(field.value)}
                            onChange={(event) =>
                              field.onChange(event.target.checked)
                            }
                          />
                          <span>
                            Pets count toward seats and can be managed on this
                            plan
                          </span>
                        </label>
                      )}
                    </Field>
                  </div>

                  <Textarea
                    name="features"
                    label="Features"
                    placeholder="Enter one feature per line"
                    rows={8}
                    description="Add each plan feature on a separate line."
                  />

                  <DialogFooter className="gap-2 px-0 pt-2 sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={() => onOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader variant="button" color="white" />
                      ) : isEditing ? (
                        "Save Changes"
                      ) : (
                        "Add Plan"
                      )}
                    </Button>
                  </DialogFooter>
                </>
              )
            }}
          </FormModified>
        </div>
      </DialogContent>
    </Dialog>
  )
}
