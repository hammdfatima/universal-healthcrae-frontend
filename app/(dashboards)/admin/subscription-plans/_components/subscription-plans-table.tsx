"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Pencil, Plus, Tags, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"

import {
  formatBillingCycle,
  formValuesToPayload,
  getBillingCycleFilterOptions,
  type SubscriptionPlan,
  type SubscriptionPlanFormValues,
  type SubscriptionPlanPayload,
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
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import {
  SUBSCRIPTION_PLANS_API,
  SUBSCRIPTION_PLANS_QUERY_KEYS,
} from "@/lib/api/subscription-plans"
import { ensureCurrencyPrice } from "@/lib/subscription/format-price"

export default function SubscriptionPlansTable() {
  const queryClient = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [deletePlan, setDeletePlan] = useState<SubscriptionPlan | null>(null)

  const {
    data: plans = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFetch<SubscriptionPlan[]>({
    path: SUBSCRIPTION_PLANS_API.admin.list,
    queryKey: SUBSCRIPTION_PLANS_QUERY_KEYS.admin,
  })

  const { onRequest: createPlan, isPending: isCreating } =
    useApi<SubscriptionPlanPayload>({
      key: "create-subscription-plan",
      method: "post",
    })

  const { onRequest: updatePlan, isPending: isUpdating } =
    useApi<SubscriptionPlanPayload>({
      key: "update-subscription-plan",
      method: "put",
    })

  const { onRequest: deletePlanRequest, isPending: isDeleting } = useApi<
    Record<string, never>
  >({
    key: "delete-subscription-plan",
    method: "delete",
  })

  const billingCycleOptions = useMemo(
    () => getBillingCycleFilterOptions(plans),
    [plans]
  )

  const isSaving = isCreating || isUpdating
  const isMutating = isSaving || isDeleting

  function invalidatePlans() {
    queryClient.invalidateQueries({
      queryKey: SUBSCRIPTION_PLANS_QUERY_KEYS.admin,
    })
    queryClient.invalidateQueries({
      queryKey: SUBSCRIPTION_PLANS_QUERY_KEYS.public,
    })
  }

  function handleSave(values: SubscriptionPlanFormValues, planId?: string) {
    const payload = formValuesToPayload(values)

    if (planId) {
      updatePlan({
        path: SUBSCRIPTION_PLANS_API.admin.update(planId),
        data: payload,
        onSuccess: () => {
          invalidatePlans()
          setFormOpen(false)
          setEditingPlan(null)
        },
      })
      return
    }

    createPlan({
      path: SUBSCRIPTION_PLANS_API.admin.create,
      data: payload,
      onSuccess: () => {
        invalidatePlans()
        setFormOpen(false)
        setEditingPlan(null)
      },
    })
  }

  function handleDelete(plan: SubscriptionPlan) {
    deletePlanRequest({
      path: SUBSCRIPTION_PLANS_API.admin.delete(plan.id),
      data: {},
      onSuccess: () => {
        invalidatePlans()
        setDeletePlan(null)
      },
    })
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
      cell: (row) => ensureCurrencyPrice(row.price),
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
      id: "memberLimit",
      header: "Members",
      accessorKey: "memberLimit",
      className: "tabular-nums",
      cell: (row) => String(row.memberLimit),
    },
    {
      id: "allowsPets",
      header: "Pets",
      searchable: false,
      cell: (row) => (row.allowsPets ? "Yes" : "No"),
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
            disabled={isMutating}
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
            disabled={isMutating}
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
        isLoading={isLoading}
        loadingLabel="Loading subscription plans..."
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching && !isLoading}
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
            disabled={isMutating}
            onClick={() => {
              setEditingPlan(null)
              setFormOpen(true)
            }}
          >
            <Plus className="size-4" aria-hidden />
            Add Subscription Plan
          </Button>
        }
        emptyMessage="No subscription plans found"
        emptyDescription="Add your first plan to make it available to patients."
        emptyAction={
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
      />

      <SubscriptionPlanFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        plan={editingPlan}
        isSubmitting={isSaving}
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
              </span>{" "}
              from the platform and deactivate it in Stripe. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={() => {
                if (deletePlan) handleDelete(deletePlan)
              }}
            >
              {isDeleting ? (
                <Loader variant="button" color="white" />
              ) : (
                "Delete Plan"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
