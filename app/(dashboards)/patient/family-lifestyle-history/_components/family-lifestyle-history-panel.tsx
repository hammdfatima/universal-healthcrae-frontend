"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Save } from "lucide-react"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"

import {
  createDefaultFamilyLifestyleHistory,
  DURATION_YEAR_OPTIONS,
  FAMILY_CONDITION_KEYS,
  FAMILY_CONDITION_LABELS,
  FAMILY_RELATION_KEYS,
  FAMILY_RELATION_LABELS,
  type FamilyConditionEntry,
  type FamilyConditionKey,
  type FamilyLifestyleHistory,
  SUBSTANCE_KEYS,
  SUBSTANCE_LABELS,
  type SubstanceEntry,
  type SubstanceKey,
} from "@/app/(dashboards)/patient/_lib/family-lifestyle-history"
import FamilyConditionDetailsDialog from "@/app/(dashboards)/patient/family-lifestyle-history/_components/family-condition-details-dialog"
import YesNoToggle from "@/app/(dashboards)/patient/family-lifestyle-history/_components/yes-no-toggle"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import {
  FAMILY_LIFESTYLE_HISTORY_API,
  FAMILY_LIFESTYLE_HISTORY_QUERY_KEYS,
  type FamilyLifestyleHistoryResponse,
  type UpsertFamilyLifestyleHistoryPayload,
} from "@/lib/api/family-lifestyle-history"
import { cn } from "@/lib/utils"
import { useVaultPatient } from "@/provider/vault-patient-provider"

function SectionCard({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm",
        className
      )}
    >
      <div className="border-b border-border/60 px-4 py-4 sm:px-6">
        <Typography as="h2" variant="h5">
          {title}
        </Typography>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  )
}

function TableHeaderCell({
  children,
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={cn(
        "bg-primary px-3 py-3 align-middle text-xs font-semibold text-primary-foreground",
        className
      )}
    >
      {children}
    </th>
  )
}

export default function FamilyLifestyleHistoryPanel() {
  const queryClient = useQueryClient()
  const { withPatientQuery, vaultQueryKey, isViewingOwnVault, activePatient } =
    useVaultPatient()
  const [history, setHistory] = useState<FamilyLifestyleHistory>(
    createDefaultFamilyLifestyleHistory()
  )
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedConditionId, setSelectedConditionId] =
    useState<FamilyConditionKey | null>(null)

  const { data, isLoading, isError, error, refetch } =
    useFetch<FamilyLifestyleHistoryResponse>({
      path: withPatientQuery(FAMILY_LIFESTYLE_HISTORY_API.get),
      queryKey: vaultQueryKey(FAMILY_LIFESTYLE_HISTORY_QUERY_KEYS.detail),
    })

  const { onRequest: saveHistory, isPending: isSaving } =
    useApi<UpsertFamilyLifestyleHistoryPayload>({
      key: "upsert-family-lifestyle-history",
      method: "put",
    })

  useEffect(() => {
    if (data?.familyLifestyleHistory) {
      setHistory(data.familyLifestyleHistory)
    }
  }, [data?.familyLifestyleHistory])

  function updateSubstance(id: SubstanceKey, patch: Partial<SubstanceEntry>) {
    setHistory((current) => ({
      ...current,
      substances: current.substances.map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry
      ),
    }))
  }

  function updateFamilyCondition(
    id: FamilyConditionKey,
    patch: Partial<FamilyConditionEntry>
  ) {
    setHistory((current) => ({
      ...current,
      familyHistory: current.familyHistory.map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry
      ),
    }))
  }

  function toggleFamilyRelation(
    conditionId: FamilyConditionKey,
    relation: (typeof FAMILY_RELATION_KEYS)[number],
    checked: boolean
  ) {
    setHistory((current) => ({
      ...current,
      familyHistory: current.familyHistory.map((entry) =>
        entry.id === conditionId
          ? {
              ...entry,
              relations: {
                ...entry.relations,
                [relation]: checked,
              },
            }
          : entry
      ),
    }))
  }

  function openDetails(conditionId: FamilyConditionKey) {
    setSelectedConditionId(conditionId)
    setDetailsOpen(true)
  }

  function handleSave() {
    saveHistory({
      path: FAMILY_LIFESTYLE_HISTORY_API.upsert,
      data: {
        substances: history.substances,
        familyHistory: history.familyHistory,
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: FAMILY_LIFESTYLE_HISTORY_QUERY_KEYS.detail,
        })
        refetch()
      },
    })
  }

  const selectedCondition = history.familyHistory.find(
    (entry) => entry.id === selectedConditionId
  )

  if (isLoading) {
    return (
      <Loader variant="fetch" label="Loading family and lifestyle history..." />
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <Typography variant="small" className="font-semibold text-destructive">
          Could not load family and lifestyle history
        </Typography>
        <Typography variant="muted" className="mt-1 text-sm">
          {error instanceof Error ? error.message : "Please try again."}
        </Typography>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Typography variant="muted" className="text-sm">
            {isViewingOwnVault
              ? "Document substance use and hereditary conditions for your care team."
              : `Viewing family and lifestyle history for ${activePatient?.firstName ?? "family member"} ${activePatient?.lastName ?? ""}`.trim()}
          </Typography>
        </div>
        {isViewingOwnVault ? (
          <Button
            type="button"
            className="gap-1.5 self-start"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader variant="button" color="white" />
            ) : (
              <>
                <Save className="size-4" aria-hidden />
                Update
              </>
            )}
          </Button>
        ) : null}
      </div>

      <SectionCard title="Substance">
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full min-w-[920px] table-fixed border-collapse text-sm">
            <colgroup>
              <col className="w-[220px]" />
              <col className="w-[120px]" />
              <col className="w-[120px]" />
              <col />
              <col className="w-[140px]" />
              <col className="w-[140px]" />
            </colgroup>
            <thead>
              <tr>
                <TableHeaderCell className="rounded-tl-xl text-left">
                  Substance
                </TableHeaderCell>
                <TableHeaderCell className="text-center">
                  Currently Using
                </TableHeaderCell>
                <TableHeaderCell className="text-center">
                  Previously Using
                </TableHeaderCell>
                <TableHeaderCell className="text-left">
                  Type/Amount
                </TableHeaderCell>
                <TableHeaderCell className="text-center">
                  How Long (years)
                </TableHeaderCell>
                <TableHeaderCell className="rounded-tr-xl text-center">
                  If stopped, year
                </TableHeaderCell>
              </tr>
            </thead>
            <tbody>
              {SUBSTANCE_KEYS.map((substanceId) => {
                const entry = history.substances.find(
                  (item) => item.id === substanceId
                )

                if (!entry) return null

                return (
                  <tr
                    key={substanceId}
                    className="border-t border-border/60 bg-background"
                  >
                    <td className="px-3 py-4 font-medium">
                      {SUBSTANCE_LABELS[substanceId]}
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex justify-center">
                        <YesNoToggle
                          value={entry.currentlyUsing}
                          onChange={(value) =>
                            updateSubstance(substanceId, {
                              currentlyUsing: value,
                            })
                          }
                          disabled={!isViewingOwnVault}
                          ariaLabel={`Currently using ${SUBSTANCE_LABELS[substanceId]}`}
                        />
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex justify-center">
                        <YesNoToggle
                          value={entry.previouslyUsing}
                          onChange={(value) =>
                            updateSubstance(substanceId, {
                              previouslyUsing: value,
                            })
                          }
                          disabled={!isViewingOwnVault}
                          ariaLabel={`Previously using ${SUBSTANCE_LABELS[substanceId]}`}
                        />
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <Input
                        value={entry.typeAmount}
                        onChange={(event) =>
                          updateSubstance(substanceId, {
                            typeAmount: event.target.value,
                          })
                        }
                        placeholder="Type/Amount"
                        disabled={!isViewingOwnVault}
                      />
                    </td>
                    <td className="px-3 py-4">
                      <Select
                        value={String(entry.durationYears)}
                        onValueChange={(value) =>
                          updateSubstance(substanceId, {
                            durationYears: Number(value),
                          })
                        }
                        disabled={!isViewingOwnVault}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Years" />
                        </SelectTrigger>
                        <SelectContent>
                          {DURATION_YEAR_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-4">
                      <Input
                        value={entry.stoppedYear}
                        onChange={(event) =>
                          updateSubstance(substanceId, {
                            stoppedYear: event.target.value,
                          })
                        }
                        placeholder="Year"
                        disabled={!isViewingOwnVault}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Family History">
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full min-w-[1100px] table-fixed border-collapse text-sm">
            <colgroup>
              <col className="w-[240px]" />
              {FAMILY_RELATION_KEYS.map((relation) => (
                <col key={relation} className="w-[88px]" />
              ))}
              <col className="w-[130px]" />
            </colgroup>
            <thead>
              <tr>
                <TableHeaderCell
                  rowSpan={2}
                  className="rounded-tl-xl text-left"
                >
                  Illness/Condition
                </TableHeaderCell>
                <TableHeaderCell
                  colSpan={FAMILY_RELATION_KEYS.length}
                  className="border-b border-primary-foreground/20 px-2 py-2 text-center"
                >
                  Family
                </TableHeaderCell>
                <TableHeaderCell
                  rowSpan={2}
                  className="rounded-tr-xl text-center"
                >
                  Add Details
                </TableHeaderCell>
              </tr>
              <tr>
                {FAMILY_RELATION_KEYS.map((relation) => (
                  <TableHeaderCell
                    key={relation}
                    className="px-1 py-2 text-center text-[11px] leading-tight font-medium"
                  >
                    <span className="mx-auto block max-w-[72px]">
                      {FAMILY_RELATION_LABELS[relation]}
                    </span>
                  </TableHeaderCell>
                ))}
              </tr>
            </thead>
            <tbody>
              {FAMILY_CONDITION_KEYS.map((conditionId) => {
                const entry = history.familyHistory.find(
                  (item) => item.id === conditionId
                )

                if (!entry) return null

                return (
                  <tr
                    key={conditionId}
                    className="border-t border-border/60 bg-background"
                  >
                    <td className="px-3 py-4 font-medium">
                      {FAMILY_CONDITION_LABELS[conditionId]}
                    </td>
                    {FAMILY_RELATION_KEYS.map((relation) => (
                      <td key={relation} className="px-1 py-4">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={entry.relations[relation]}
                            onCheckedChange={(checked) =>
                              toggleFamilyRelation(
                                conditionId,
                                relation,
                                checked === true
                              )
                            }
                            disabled={!isViewingOwnVault}
                            aria-label={`${FAMILY_CONDITION_LABELS[conditionId]} in ${FAMILY_RELATION_LABELS[relation]}`}
                          />
                        </div>
                      </td>
                    ))}
                    <td className="px-3 py-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => openDetails(conditionId)}
                      >
                        Add Details
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {isViewingOwnVault ? (
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              className="gap-1.5"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader variant="button" color="white" />
              ) : (
                <>
                  <Save className="size-4" aria-hidden />
                  Update
                </>
              )}
            </Button>
          </div>
        ) : null}
      </SectionCard>

      <FamilyConditionDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        conditionId={selectedConditionId}
        details={selectedCondition?.details ?? ""}
        readOnly={!isViewingOwnVault}
        onSave={(details) => {
          if (!selectedConditionId) return
          updateFamilyCondition(selectedConditionId, { details })
        }}
      />
    </div>
  )
}
