"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Share2, Users } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import { MEDICAL_RECORD_SHARES_QUERY_KEYS } from "@/lib/api/medical-record-shares"
import {
  PETS_API,
  PETS_QUERY_KEYS,
  type Pet,
  type PetSharingSettings,
  type UpdatePetSharingPayload,
} from "@/lib/api/pets"

type PetSharingDialogProps = {
  pet: Pet | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PetSharingDialog({
  pet,
  open,
  onOpenChange,
}: PetSharingDialogProps) {
  const queryClient = useQueryClient()
  const petId = pet?.id ?? ""
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const { data, isLoading, isError, error, refetch, isFetching } =
    useFetch<PetSharingSettings>({
      path: PETS_API.sharingSettings(petId),
      queryKey: PETS_QUERY_KEYS.sharingSettings(petId),
      enabled: open && Boolean(petId),
    })

  useEffect(() => {
    if (!data || !open) return
    setSelectedIds(
      data.members
        .filter((member) => member.isSharedWith)
        .map((member) => member.userId)
    )
  }, [data, open])

  const members = data?.members ?? []
  const allSelected =
    members.length > 0 && selectedIds.length === members.length
  const isDirty = useMemo(() => {
    if (!data) return false
    const original = new Set(
      data.members
        .filter((member) => member.isSharedWith)
        .map((member) => member.userId)
    )
    return (
      original.size !== selectedIds.length ||
      selectedIds.some((id) => !original.has(id))
    )
  }, [data, selectedIds])

  const { onRequest: updateSharing, isPending } =
    useApi<UpdatePetSharingPayload>({
      key: "update-pet-sharing",
      method: "put",
    })

  function toggleMember(userId: string, checked: boolean) {
    setSelectedIds((current) =>
      checked
        ? current.includes(userId)
          ? current
          : [...current, userId]
        : current.filter((id) => id !== userId)
    )
  }

  function handleSave() {
    if (!pet) return

    updateSharing({
      path: PETS_API.sharingSettings(pet.id),
      data: { granteeUserIds: selectedIds },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: PETS_QUERY_KEYS.sharingSettings(pet.id),
        })
        queryClient.invalidateQueries({
          queryKey: MEDICAL_RECORD_SHARES_QUERY_KEYS.sidebarFamily,
        })
        queryClient.invalidateQueries({ queryKey: ["pets", "shared"] })
        onOpenChange(false)
      },
    })
  }

  if (!pet) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
          <div className="flex items-start gap-3 pr-8">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Share2 className="size-5" aria-hidden />
            </span>
            <div>
              <DialogTitle>Share {pet.name}&apos;s profile</DialogTitle>
              <DialogDescription className="mt-1">
                Choose family members who can view this pet&apos;s details,
                medications, allergies, vaccinations, and veterinary records.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[min(28rem,60vh)] space-y-4 overflow-y-auto px-6 py-5">
          {isLoading ? (
            <Loader variant="fetch" label="Loading family members..." />
          ) : isError ? (
            <div className="space-y-3">
              <Typography variant="p">
                {(error as Error)?.message ??
                  "Failed to load sharing settings."}
              </Typography>
              <Button type="button" variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : members.length === 0 ? (
            <Typography variant="muted" className="text-sm">
              No active family members are available. Add a family member before
              sharing this pet profile.
            </Typography>
          ) : (
            <>
              <label
                htmlFor={`share-pet-all-${pet.id}`}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 px-4 py-3"
              >
                <div>
                  <Typography variant="small" className="font-medium">
                    Share with all family members
                  </Typography>
                  <Typography variant="muted" className="text-xs">
                    Select every active member in your household.
                  </Typography>
                </div>
                <Checkbox
                  id={`share-pet-all-${pet.id}`}
                  checked={allSelected}
                  onCheckedChange={(checked) =>
                    setSelectedIds(
                      checked === true
                        ? members.map((member) => member.userId)
                        : []
                    )
                  }
                />
              </label>

              <div className="flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" aria-hidden />
                <Typography variant="small" className="font-medium">
                  Family members
                </Typography>
              </div>

              <ul className="space-y-2">
                {members.map((member) => {
                  const label =
                    `${member.firstName} ${member.lastName}`.trim() ||
                    member.email
                  return (
                    <li key={member.userId}>
                      <label
                        htmlFor={`share-pet-${pet.id}-${member.userId}`}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 px-4 py-3 hover:bg-muted/30"
                      >
                        <Checkbox
                          id={`share-pet-${pet.id}-${member.userId}`}
                          checked={selectedIds.includes(member.userId)}
                          onCheckedChange={(checked) =>
                            toggleMember(member.userId, checked === true)
                          }
                        />
                        <div className="min-w-0 flex-1">
                          <Typography variant="small" className="font-medium">
                            {label}
                          </Typography>
                          <Typography variant="muted" className="text-xs">
                            {member.relationship}
                          </Typography>
                        </div>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>

        {members.length > 0 && !isLoading && !isError ? (
          <DialogFooter className="border-t border-border/60 bg-muted/20 px-6 py-4 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || isPending || isFetching}
            >
              {isPending ? (
                <Loader variant="button" label="Saving..." />
              ) : (
                "Save sharing"
              )}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
