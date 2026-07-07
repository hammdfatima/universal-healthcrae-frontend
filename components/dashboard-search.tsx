"use client"

import { Search } from "lucide-react"
import type { Route } from "next"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { useAdminPortalSearch } from "@/hooks/use-admin-portal-search"
import { usePatientPortalSearch } from "@/hooks/use-patient-portal-search"
import {
  filterSearchResults,
  groupSearchResults,
  type PortalSearchPortal,
} from "@/lib/dashboard-search/types"
import { cn } from "@/lib/utils"

type DashboardSearchProps = {
  portal: PortalSearchPortal
  placeholder: string
  className?: string
}

export default function DashboardSearch({
  portal,
  placeholder,
  className,
}: DashboardSearchProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const patientSearch = usePatientPortalSearch(open && portal === "patient")
  const adminSearch = useAdminPortalSearch(open && portal === "admin")
  const searchData = portal === "patient" ? patientSearch : adminSearch

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const filteredPages = useMemo(
    () => filterSearchResults(searchData.pages, query),
    [query, searchData.pages]
  )

  const filteredRecords = useMemo(
    () => filterSearchResults(searchData.records, query),
    [query, searchData.records]
  )

  const pageGroups = useMemo(
    () => groupSearchResults(filteredPages),
    [filteredPages]
  )

  const recordGroups = useMemo(
    () => groupSearchResults(filteredRecords),
    [filteredRecords]
  )

  function handleSelect(href: Route) {
    setOpen(false)
    setQuery("")
    router.push(href)
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setQuery("")
    }
  }

  return (
    <>
      <div className={cn("flex min-w-0 flex-1 items-center gap-2", className)}>
        <div className="relative hidden min-w-0 flex-1 md:block">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            readOnly
            value=""
            placeholder={placeholder}
            className="h-11 cursor-pointer bg-muted/40 pr-16 pl-11"
            aria-label={placeholder}
            onClick={() => setOpen(true)}
            onFocus={() => setOpen(true)}
          />
          <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline">
            Ctrl+K
          </kbd>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 shrink-0 md:hidden"
          aria-label="Open search"
          onClick={() => setOpen(true)}
        >
          <Search className="size-5" />
        </Button>
      </div>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title={`Search ${portal} portal`}
        description={`Search pages and records in the ${portal} portal.`}
        shouldFilter={false}
      >
        <CommandInput
          placeholder={placeholder}
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {pageGroups.map((group) => (
            <CommandGroup key={group.heading} heading={group.heading}>
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <CommandItem
                    key={item.id}
                    value={item.keywords}
                    onSelect={() => handleSelect(item.href)}
                  >
                    {Icon ? <Icon className="size-4" aria-hidden /> : null}
                    <div className="min-w-0 flex-1">
                      <span className="block truncate">{item.title}</span>
                      {item.subtitle ? (
                        <span className="block truncate text-xs text-muted-foreground">
                          {item.subtitle}
                        </span>
                      ) : null}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          ))}

          {searchData.isLoading ? (
            <CommandGroup heading="Records">
              <CommandItem disabled value="loading-records">
                Loading records...
              </CommandItem>
            </CommandGroup>
          ) : null}

          {!searchData.isLoading && recordGroups.length > 0 ? (
            <>
              <CommandSeparator />
              {recordGroups.map((group) => (
                <CommandGroup key={group.heading} heading={group.heading}>
                  {group.items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.keywords}
                      onSelect={() => handleSelect(item.href)}
                    >
                      <div className="min-w-0 flex-1">
                        <span className="block truncate">{item.title}</span>
                        {item.subtitle ? (
                          <span className="block truncate text-xs text-muted-foreground">
                            {item.subtitle}
                          </span>
                        ) : null}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </>
          ) : null}
        </CommandList>
      </CommandDialog>
    </>
  )
}
