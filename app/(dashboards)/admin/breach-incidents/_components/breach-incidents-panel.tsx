"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Loader } from "@/components/ui/loader"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"
import {
  ADMIN_BREACH_INCIDENTS_API,
  ADMIN_BREACH_INCIDENTS_QUERY_KEYS,
  type BreachIncident,
  type BreachIncidentsList,
} from "@/lib/api/admin-breach-incidents"

const createSchema = z.object({
  title: z.string().min(1, "Title is required."),
  summary: z.string().min(1, "Summary is required."),
  affectedCountEst: z.coerce.number().int().min(0),
  dataCategories: z.string().optional(),
})

const defaultValues = {
  title: "",
  summary: "",
  affectedCountEst: 0,
  dataCategories: "",
}

function deadlineLabel(iso: string) {
  const deadline = new Date(iso)
  const daysLeft = Math.ceil(
    (deadline.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
  )
  return `${deadline.toLocaleString()} (${daysLeft}d remaining)`
}

export default function BreachIncidentsPanel() {
  const queryClient = useQueryClient()
  const [formKey, setFormKey] = useState(0)

  const listQuery = useFetch<BreachIncidentsList>({
    path: ADMIN_BREACH_INCIDENTS_API.list,
    queryKey: ADMIN_BREACH_INCIDENTS_QUERY_KEYS.list,
  })

  const createApi = useApi<{
    title: string
    summary: string
    affectedCountEst: number
    dataCategories: string[]
  }>({
    key: "create-breach-incident",
    method: "post",
    showSuccessToast: true,
  })

  const incidents = listQuery.data?.incidents ?? []

  return (
    <div className="space-y-8">
      <div>
        <Typography as="h1" variant="h3">
          Breach Center
        </Typography>
        <Typography variant="muted" className="mt-2 text-sm">
          Log suspected incidents, track estimated affected individuals, and
          watch the HIPAA 60-day notification clock.
        </Typography>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
        <Typography as="h2" variant="h5" className="mb-4">
          Open a new incident
        </Typography>
        <FormModified
          key={formKey}
          schema={createSchema}
          defaultValues={defaultValues}
          formKey={formKey}
          fieldsetProps={{ className: "space-y-4" }}
          onSubmit={(values) => {
            createApi.onRequest<BreachIncident>({
              path: ADMIN_BREACH_INCIDENTS_API.create,
              data: {
                title: values.title,
                summary: values.summary,
                affectedCountEst: values.affectedCountEst,
                dataCategories: (values.dataCategories ?? "")
                  .split(",")
                  .map((part) => part.trim())
                  .filter(Boolean),
              },
              onSuccess: () => {
                setFormKey((key) => key + 1)
                void queryClient.invalidateQueries({
                  queryKey: ADMIN_BREACH_INCIDENTS_QUERY_KEYS.list,
                })
              },
            })
          }}
        >
          {({ components: { Input: FormInput } }) => (
            <>
              <FormInput
                name="title"
                label="Title"
                placeholder="Incident title"
              />
              <FormInput
                name="summary"
                label="Summary"
                placeholder="What happened / current containment status"
              />
              <FormInput
                name="affectedCountEst"
                label="Estimated affected individuals"
                type="number"
              />
              <FormInput
                name="dataCategories"
                label="Data categories (comma-separated)"
                placeholder="names, emails, lab results"
              />
              <Button type="submit" disabled={createApi.isPending}>
                {createApi.isPending ? (
                  <Loader variant="button" color="white" />
                ) : (
                  "Create incident"
                )}
              </Button>
            </>
          )}
        </FormModified>
      </div>

      <div className="space-y-3">
        {listQuery.isLoading ? (
          <Loader variant="fetch" label="Loading incidents..." />
        ) : incidents.length === 0 ? (
          <Typography variant="muted" className="text-sm">
            No breach incidents recorded yet.
          </Typography>
        ) : (
          incidents.map((incident) => (
            <div
              key={incident.id}
              className="rounded-2xl border border-border/60 bg-card p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Typography as="h3" variant="h5">
                    {incident.title}
                  </Typography>
                  <Typography variant="muted" className="mt-1 text-sm">
                    {incident.summary}
                  </Typography>
                </div>
                <Badge variant="secondary" className="rounded-full capitalize">
                  {incident.status}
                </Badge>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <p>Affected (est.): {incident.affectedCountEst}</p>
                <p>
                  Categories:{" "}
                  {incident.dataCategories.length > 0
                    ? incident.dataCategories.join(", ")
                    : "—"}
                </p>
                <p>
                  Detected: {new Date(incident.detectedAt).toLocaleString()}
                </p>
                <p>
                  HIPAA 60-day deadline:{" "}
                  {deadlineLabel(incident.hipaa60dDeadline)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
