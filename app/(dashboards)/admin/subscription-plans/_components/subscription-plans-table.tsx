"use client"

import { Pencil, Plus, Tags, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import {
  formatBillingCycle,
  getBillingCycleFilterOptions,
  getSubscriptionPlansFromStorage,
  initialSubscriptionPlans,
  type SubscriptionPlan,
  saveSubscriptionPlansToStorage,
} from "@/app/(dashboards)/admin/_lib/subscription-plans"
import SubscriptionPlanFormDialog from "@/app/(dashboards)/admin/subscription-plans/_components/subscription-plan-form-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import useToast from "@/hooks/use-toast"

export default function SubscriptionPlansTable() {
  const { toastSuccess } = useToast()
  const [plans, setPlans] = useState<SubscriptionPlan[]>(
    initialSubscriptionPlans
  )
  const [formOpen, setFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [deletePlan, setDeletePlan] = useState<SubscriptionPlan | null>(null)

  useEffect(() => {
    setPlans(getSubscriptionPlansFromStorage())
  }, [])

  const billingCycleOptions = useMemo(
    () => getBillingCycleFilterOptions(plans),
    [plans]
  )

  function updatePlans(next: SubscriptionPlan[]) {
    setPlans(next)
    saveSubscriptionPlansToStorage(next)
  }

  function handleSave(plan: SubscriptionPlan) {
    const exists = plans.some((item) => item.id === plan.id)
    const next = exists
      ? plans.map((item) => (item.id === plan.id ? plan : item))
      : [...plans, plan]

    updatePlans(next)
    toastSuccess(
      exists ? "Subscription plan updated." : "Subscription plan added."
    )
  }

  function handleDelete(plan: SubscriptionPlan) {
    updatePlans(plans.filter((item) => item.id !== plan.id))
    setDeletePlan(null)
    toastSuccess("Subscription plan deleted.")
  }

  const columns: DataTableColumn<SubscriptionPlan>[] = [
    {
      id: "planName",
      header: "Plan Name",
      accessorKey: "planName",
      cell: (row) => (
        <Typography variant="small" className="font-medium">
          {row.planName}
        </Typography>
      ),
    },
    {
      id: "price",
      header: "Price",
      accessorKey: "price",
      className: "tabular-nums",
    },
    {
      id: "billingCycle",
      header: "Billing Cycle",
      cell: (row) => (
        <Badge variant="outline" className="rounded-full capitalize">
          {formatBillingCycle(row.billingCycle)}
        </Badge>
      ),
      accessorKey: "billingCycle",
    },
    {
      id: "features",
      header: "Features",
      cell: (row) => (
        <Typography variant="muted" className="line-clamp-2 max-w-xs text-sm">
          {row.features.join(" · ")}
        </Typography>
      ),
      searchable: false,
      className: "hidden md:table-cell max-w-xs",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "actions",
      header: "",
      searchable: false,
      className: "w-24 text-right",
      headerClassName: "w-24 text-right",
      cell: (row) => (
        <div className="flex justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            className="size-8 rounded-full"
            aria-label={`Edit ${row.planName}`}
            onClick={() => {
              setEditingPlan(row)
              setFormOpen(true)
            }}
          >
            <Pencil className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="size-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Delete ${row.planName}`}
            onClick={() => setDeletePlan(row)}
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable
        title="Subscription Plans"
        description="Manage pricing plans available to patients on the platform."
        icon={<Tags className="size-6" aria-hidden />}
        columns={columns}
        data={plans}
        getRowId={(row) => row.id}
        searchPlaceholder="Search plans..."
        filters={
          billingCycleOptions.length > 0
            ? [
                {
                  id: "billingCycle",
                  label: "Billing Cycle",
                  accessorKey: "billingCycle",
                  options: billingCycleOptions,
                },
              ]
            : []
        }
        actions={
          <Button
            onClick={() => {
              setEditingPlan(null)
              setFormOpen(true)
            }}
          >
            <Plus className="size-4" aria-hidden />
            Add Subscription Plan
          </Button>
        }
        emptyMessage="No subscription plans found. Add your first plan to get started."
      />

      <SubscriptionPlanFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        plan={editingPlan}
        onSave={handleSave}
      />

      <AlertDialog
        open={Boolean(deletePlan)}
        onOpenChange={(open) => {
          if (!open) setDeletePlan(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete subscription plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-medium text-foreground">
                {deletePlan?.planName}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deletePlan) handleDelete(deletePlan)
              }}
            >
              Delete Plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
