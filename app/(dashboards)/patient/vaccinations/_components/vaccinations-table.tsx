"use client"

import { Eye, Plus, Syringe } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import {
  getAdministeredByFilterOptions,
  getPrescribedByFilterOptions,
  getVaccinationsFromStorage,
  initialVaccinations,
  saveVaccinationsToStorage,
  type Vaccination,
} from "@/app/(dashboards)/patient/_lib/vaccinations"
import VaccinationDetailsDialog from "@/app/(dashboards)/patient/vaccinations/_components/vaccination-details-dialog"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

export default function VaccinationsTable() {
  const router = useRouter()
  const [vaccinations, setVaccinations] =
    useState<Vaccination[]>(initialVaccinations)
  const [selectedVaccination, setSelectedVaccination] =
    useState<Vaccination | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    setVaccinations(getVaccinationsFromStorage())
  }, [])

  const prescribedByOptions = useMemo(
    () => getPrescribedByFilterOptions(vaccinations),
    [vaccinations]
  )

  const administeredByOptions = useMemo(
    () => getAdministeredByFilterOptions(vaccinations),
    [vaccinations]
  )

  function updateVaccinations(next: Vaccination[]) {
    setVaccinations(next)
    saveVaccinationsToStorage(next)
  }

  function openDetails(vaccination: Vaccination) {
    setSelectedVaccination(vaccination)
    setDetailsOpen(true)
  }

  function handleDelete(vaccination: Vaccination) {
    updateVaccinations(
      vaccinations.filter((item) => item.id !== vaccination.id)
    )
    setSelectedVaccination(null)
  }

  const columns: DataTableColumn<Vaccination>[] = [
    {
      id: "vaccineName",
      header: "Vaccine Name",
      accessorKey: "vaccineName",
      cell: (row) => (
        <Typography variant="small" className="font-medium">
          {row.vaccineName}
        </Typography>
      ),
    },
    {
      id: "date",
      header: "Date",
      accessorKey: "date",
      className: "hidden sm:table-cell tabular-nums",
      headerClassName: "hidden sm:table-cell",
    },
    {
      id: "time",
      header: "Time",
      accessorKey: "time",
      className: "hidden md:table-cell tabular-nums",
      headerClassName: "hidden md:table-cell",
    },
    {
      id: "prescribedBy",
      header: "Prescribed By",
      accessorKey: "prescribedBy",
      className: "hidden lg:table-cell",
      headerClassName: "hidden lg:table-cell",
    },
    {
      id: "administeredBy",
      header: "Administrated by",
      accessorKey: "administeredBy",
      className: "hidden xl:table-cell",
      headerClassName: "hidden xl:table-cell",
    },
    {
      id: "dosage",
      header: "Dosage",
      accessorKey: "dosage",
      className: "hidden xl:table-cell",
      headerClassName: "hidden xl:table-cell",
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
          aria-label={`View ${row.vaccineName}`}
          onClick={() => openDetails(row)}
        >
          <Eye className="size-4" aria-hidden />
        </Button>
      ),
    },
  ]

  const filters = [
    ...(prescribedByOptions.length > 0
      ? [
          {
            id: "prescribedBy",
            label: "Prescribed By",
            accessorKey: "prescribedBy" as const,
            options: prescribedByOptions,
          },
        ]
      : []),
    ...(administeredByOptions.length > 0
      ? [
          {
            id: "administeredBy",
            label: "Administrated by",
            accessorKey: "administeredBy" as const,
            options: administeredByOptions,
          },
        ]
      : []),
  ]

  return (
    <>
      <DataTable
        title="Immunizations"
        description="Track your vaccinations and immunization history."
        icon={<Syringe className="size-5" />}
        columns={columns}
        data={vaccinations}
        getRowId={(row) => row.id}
        searchPlaceholder="Search vaccinations..."
        filters={filters}
        actions={
          <Button onClick={() => router.push("/patient/vaccinations/new")}>
            <Plus className="size-4" aria-hidden />
            Add Vaccination
          </Button>
        }
        emptyMessage="No vaccinations found. Add your first immunization record to get started."
      />

      <VaccinationDetailsDialog
        vaccination={selectedVaccination}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onDelete={handleDelete}
      />
    </>
  )
}
