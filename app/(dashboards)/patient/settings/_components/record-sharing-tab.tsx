"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Share2, Users } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import {
  MEDICAL_RECORD_SHARES_API,
  MEDICAL_RECORD_SHARES_QUERY_KEYS,
  type MedicalRecordSharingSettings,
  type UpdateSharingPayload,
} from "@/lib/api/medical-record-shares"

export default function RecordSharingTab() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error, refetch, isFetching } =
    useFetch<MedicalRecordSharingSettings>({
      path: MEDICAL_RECORD_SHARES_API.settings,
      queryKey: MEDICAL_RECORD_SHARES_QUERY_KEYS.settings,
    })

  const [shareWithAll, setShareWithAll] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    if (!data) return
    setShareWithAll(data.shareWithAll)
    setSelectedIds(
      data.members.filter((member) => member.isSharedWith).map((m) => m.userId)
    )
  }, [data])

  const { onRequest: updateSharing, isPending } = useApi<UpdateSharingPayload>({
    key: "update-medical-record-sharing",
    method: "put",
  })

  const members = data?.members ?? []
  const hasHousehold = members.length > 0
  const isManagedMember = data?.isManagedMember ?? false

  const isDirty = useMemo(() => {
    if (!data) return false
    if (shareWithAll !== data.shareWithAll) return true
    if (shareWithAll) return false
    const original = new Set(
      data.members.filter((m) => m.isSharedWith).map((m) => m.userId)
    )
    if (original.size !== selectedIds.length) return true
    return selectedIds.some((id) => !original.has(id))
  }, [data, selectedIds, shareWithAll])

  function toggleMember(userId: string, checked: boolean) {
    setSelectedIds((current) => {
      if (checked) {
        return current.includes(userId) ? current : [...current, userId]
      }
      return current.filter((id) => id !== userId)
    })
  }

  function handleSave() {
    updateSharing({
      path: MEDICAL_RECORD_SHARES_API.settings,
      data: {
        shareWithAll,
        granteeUserIds: shareWithAll ? [] : selectedIds,
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: MEDICAL_RECORD_SHARES_QUERY_KEYS.settings,
        })
        queryClient.invalidateQueries({
          queryKey: MEDICAL_RECORD_SHARES_QUERY_KEYS.accessiblePatients,
        })
        queryClient.invalidateQueries({
          queryKey: MEDICAL_RECORD_SHARES_QUERY_KEYS.sidebarFamily,
        })
        refetch()
      },
    })
  }

  if (isLoading) {
    return <Loader variant="fetch" label="Loading sharing settings..." />
  }

  if (isError) {
    return (
      <div className="space-y-3 rounded-2xl border border-border/60 p-6">
        <Typography variant="p">
          {(error as Error)?.message ?? "Failed to load sharing settings."}
        </Typography>
        <Button type="button" variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Share2 className="size-5" aria-hidden />
          </span>
          <div>
            <Typography as="h2" variant="h4">
              Share my medical records
            </Typography>
            <Typography variant="muted" className="mt-1 text-sm">
              {isManagedMember
                ? "Share your medical vault with the account owner who added you. Sharing is off by default."
                : "Choose whether family members can view your medical vault (medications, allergies, health history, immunizations, lab, and imaging). Sharing is off by default."}
            </Typography>
          </div>
        </div>

        {!hasHousehold ? (
          <Typography variant="muted" className="mt-6 text-sm">
            {isManagedMember
              ? "Your account is not linked to a family owner yet."
              : "No family members are linked to your household yet. Add family members to share records."}
          </Typography>
        ) : (
          <div className="mt-6 space-y-5">
            {!isManagedMember ? (
              <label
                htmlFor="share-with-all"
                className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 px-4 py-3"
              >
                <div>
                  <Typography variant="small" className="font-medium">
                    Share with all family members
                  </Typography>
                  <Typography variant="muted" className="text-xs">
                    Everyone in your household can view your medical records.
                  </Typography>
                </div>
                <Checkbox
                  id="share-with-all"
                  checked={shareWithAll}
                  onCheckedChange={(checked) => {
                    const enabled = checked === true
                    setShareWithAll(enabled)
                    if (enabled) {
                      setSelectedIds(members.map((member) => member.userId))
                    }
                  }}
                />
              </label>
            ) : null}

            <div
              className={
                !isManagedMember && shareWithAll
                  ? "pointer-events-none space-y-3 opacity-50"
                  : "space-y-3"
              }
            >
              <div className="flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" aria-hidden />
                <Typography variant="small" className="font-medium">
                  {isManagedMember
                    ? "Share with account owner"
                    : "Or choose specific family members"}
                </Typography>
              </div>

              <ul className="space-y-2">
                {members.map((member) => {
                  const checked = selectedIds.includes(member.userId)
                  const label =
                    `${member.firstName} ${member.lastName}`.trim() ||
                    member.email

                  return (
                    <li key={member.userId}>
                      <label
                        htmlFor={`share-member-${member.userId}`}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 px-4 py-3 hover:bg-muted/30"
                      >
                        <Checkbox
                          id={`share-member-${member.userId}`}
                          checked={checked}
                          onCheckedChange={(value) =>
                            toggleMember(member.userId, value === true)
                          }
                          disabled={!isManagedMember && shareWithAll}
                        />
                        <div className="min-w-0 flex-1">
                          <Typography variant="small" className="font-medium">
                            {label}
                          </Typography>
                          <Typography variant="muted" className="text-xs">
                            {member.relationship}
                            {member.isAccountOwner ? " · Account owner" : ""}
                          </Typography>
                        </div>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                onClick={handleSave}
                disabled={!isDirty || isPending || isFetching}
              >
                {isPending ? (
                  <Loader variant="button" label="Saving..." />
                ) : (
                  "Save sharing settings"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
