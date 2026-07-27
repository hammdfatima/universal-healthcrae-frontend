"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  ArrowLeft,
  FileText,
  PawPrint,
  Pencil,
  QrCode,
  Trash2,
} from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import PetDetailsPanel from "@/app/(dashboards)/patient/pets/_components/pet-details-panel"
import PetEmergencyQrPanel from "@/app/(dashboards)/patient/pets/_components/pet-emergency-qr-panel"
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
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useAuth } from "@/hooks/use-auth"
import { useFetch } from "@/hooks/use-fetch"
import {
  PETS_API,
  PETS_QUERY_KEYS,
  type PetsListResponse,
} from "@/lib/api/pets"
import { cn } from "@/lib/utils"

const validTabs = ["details", "qr"] as const
type PetDetailTab = (typeof validTabs)[number]

function isPetDetailTab(value: string | null): value is PetDetailTab {
  return validTabs.includes(value as PetDetailTab)
}

const tabTriggerClass = cn(
  "rounded-full px-4 py-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground",
  "text-foreground/75 hover:bg-secondary/60 hover:text-secondary-foreground"
)

export default function PetDetailPageContent() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const petId = params.id
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const isAccountOwner = !user?.isFamilyMemberAccount
  const [deleteOpen, setDeleteOpen] = useState(false)

  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState<PetDetailTab>(
    isPetDetailTab(tabParam) ? tabParam : "details"
  )

  const { data, isLoading, isError, refetch } = useFetch<PetsListResponse>({
    path: PETS_API.list,
    queryKey: PETS_QUERY_KEYS.list,
    enabled: isAccountOwner,
  })

  const pet = useMemo(
    () => data?.pets.find((item) => item.id === petId) ?? null,
    [data?.pets, petId]
  )

  const { onRequest: deletePet, isPending: isDeleting } = useApi<
    Record<string, never>
  >({
    key: "delete-pet",
    method: "delete",
  })

  useEffect(() => {
    if (isPetDetailTab(tabParam)) {
      setActiveTab(tabParam)
    } else if (!tabParam) {
      setActiveTab("details")
    }
  }, [tabParam])

  useEffect(() => {
    if (!user) return
    if (!isAccountOwner) {
      router.replace("/patient")
      return
    }
    if (isLoading) return
    if (!pet) {
      router.replace("/patient/pets" as Route)
    }
  }, [isAccountOwner, isLoading, pet, router, user])

  function handleTabChange(value: string) {
    const nextTab = isPetDetailTab(value) ? value : "details"
    setActiveTab(nextTab)
    const nextParams = new URLSearchParams(searchParams.toString())
    if (nextTab === "details") {
      nextParams.delete("tab")
    } else {
      nextParams.set("tab", nextTab)
    }
    const query = nextParams.toString()
    router.replace(
      (query
        ? `/patient/pets/${petId}?${query}`
        : `/patient/pets/${petId}`) as Route
    )
  }

  function handleDelete() {
    if (!pet) return

    deletePet({
      path: PETS_API.delete(pet.id),
      data: {},
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEYS.list })
        router.push("/patient/pets" as Route)
      },
    })
  }

  if (!user || !isAccountOwner || isLoading) {
    return <Loader variant="fetch" label="Loading pet..." />
  }

  if (isError || !pet) {
    return (
      <div className="space-y-4 p-4">
        <Typography variant="muted">Pet not found.</Typography>
        <Button type="button" variant="outline" asChild>
          <Link href={"/patient/pets" as Route}>Back to Pets</Link>
        </Button>
        {isError ? (
          <Button type="button" variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        ) : null}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Button type="button" variant="ghost" className="-ml-2 w-fit" asChild>
            <Link href={"/patient/pets" as Route}>
              <ArrowLeft className="size-4" aria-hidden />
              Back to Pets
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PawPrint className="size-5" aria-hidden />
            </span>
            <div>
              <Typography as="h1" variant="h3">
                {pet.name}
              </Typography>
              <Typography variant="muted" className="mt-1">
                View pet details and manage the emergency QR code.
              </Typography>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" aria-hidden />
            Delete
          </Button>
          <Button type="button" asChild>
            <Link href={`/patient/pets/${pet.id}/edit` as Route}>
              <Pencil className="size-4" aria-hidden />
              Edit Pet
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="thin-scrollbar h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl border border-border/60 bg-muted/40 p-1.5 sm:w-fit">
          <TabsTrigger value="details" className={tabTriggerClass}>
            <FileText className="mr-2 size-4" aria-hidden />
            Details
          </TabsTrigger>
          <TabsTrigger value="qr" className={tabTriggerClass}>
            <QrCode className="mr-2 size-4" aria-hidden />
            QR Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <PetDetailsPanel pet={pet} />
        </TabsContent>

        <TabsContent value="qr" className="mt-4">
          <PetEmergencyQrPanel petId={pet.id} petName={pet.name} />
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {pet.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes {pet.name}&apos;s veterinary records from
              your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isDeleting} onClick={handleDelete}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
