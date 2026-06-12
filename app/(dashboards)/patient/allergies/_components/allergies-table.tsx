"use client"

import { AlertTriangle, Eye, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import {
  ALLERGY_TYPE_FOOD,
  type Allergy,
  formatSymptomsList,
  formatTriggersList,
  getAllergiesFromStorage,
  getAllergyTypeFilterOptions,
  initialAllergies,
  natureOptions,
  saveAllergiesToStorage,
} from "@/app/(dashboards)/patient/_lib/allergies"
import AllergyDetailsDialog from "@/app/(dashboards)/patient/allergies/_components/allergy-details-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

function getNatureBadgeClass(nature: string) {
  if (nature === "Very Severe" || nature === "Severe") {
    return "bg-destructive/10 text-destructive hover:bg-destructive/10"
  }
  if (nature === "Moderate") {
    return "bg-amber-100 text-amber-800 hover:bg-amber-100"
  }
  return "bg-muted text-muted-foreground hover:bg-muted"
}

export default function AllergiesTable() {
  const router = useRouter()
  const [allergies, setAllergies] = useState<Allergy[]>(initialAllergies)
  const [selectedAllergy, setSelectedAllergy] = useState<Allergy | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    setAllergies(getAllergiesFromStorage())
  }, [])

  const typeOptions = useMemo(
    () => getAllergyTypeFilterOptions(allergies),
    [allergies]
  )

  function updateAllergies(next: Allergy[]) {
    setAllergies(next)
    saveAllergiesToStorage(next)
  }

  function openDetails(allergy: Allergy) {
    setSelectedAllergy(allergy)
    setDetailsOpen(true)
  }

  function handleDelete(allergy: Allergy) {
    updateAllergies(allergies.filter((item) => item.id !== allergy.id))
    setSelectedAllergy(null)
  }

  const columns: DataTableColumn<Allergy>[] = [
    {
      id: "allergyType",
      header: "Allergy Type",
      accessorKey: "allergyType",
      cell: (row) => (
        <Typography variant="small" className="font-medium">
          {row.allergyType}
        </Typography>
      ),
    },
    {
      id: "nature",
      header: "Nature",
      accessorKey: "nature",
      cell: (row) => (
        <Badge className={cn("rounded-full", getNatureBadgeClass(row.nature))}>
          {row.nature}
        </Badge>
      ),
    },
    {
      id: "symptoms",
      header: "Symptoms",
      cell: (row) => (
        <Typography variant="muted" className="text-sm">
          {formatSymptomsList(row.symptoms)}
        </Typography>
      ),
      searchable: false,
      className: "hidden md:table-cell max-w-xs",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "triggers",
      header: "Triggers",
      cell: (row) => (
        <Typography variant="muted" className="text-sm">
          {row.allergyType === ALLERGY_TYPE_FOOD
            ? formatTriggersList(row.triggers)
            : "—"}
        </Typography>
      ),
      searchable: false,
      className: "hidden lg:table-cell",
      headerClassName: "hidden lg:table-cell",
    },
    {
      id: "actions",
      header: "",
      className: "w-12 text-right",
      headerClassName: "w-12 text-right",
      searchable: false,
      cell: (row) => (
        <Button
          type="button"
          variant="ghost"
          className="size-8 rounded-full"
          aria-label={`View ${row.allergyType} allergy`}
          onClick={() => openDetails(row)}
        >
          <Eye className="size-4" aria-hidden />
        </Button>
      ),
    },
  ]

  return (
    <>
      <DataTable
        title="Known Allergies"
        description="Track allergy types, severity, symptoms, and food triggers."
        icon={<AlertTriangle className="size-5" />}
        columns={columns}
        data={allergies}
        getRowId={(row) => row.id}
        searchPlaceholder="Search allergies..."
        filters={[
          {
            id: "allergyType",
            label: "Allergy Type",
            accessorKey: "allergyType",
            options: typeOptions,
          },
          {
            id: "nature",
            label: "Nature",
            accessorKey: "nature",
            options: natureOptions.map((option) => ({
              label: option.label,
              value: option.value,
            })),
          },
        ]}
        actions={
          <Button onClick={() => router.push("/patient/allergies/new")}>
            <Plus className="size-4" aria-hidden />
            Add Allergy
          </Button>
        }
        emptyMessage="No allergies found. Add your first allergy record to get started."
      />

      <AllergyDetailsDialog
        allergy={selectedAllergy}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onDelete={handleDelete}
      />
    </>
  )
}
