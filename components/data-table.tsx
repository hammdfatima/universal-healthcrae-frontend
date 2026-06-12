"use client"

import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { type ReactNode, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type DataTableColumn<T> = {
  id: string
  header: string
  accessorKey?: keyof T & string
  cell?: (row: T) => ReactNode
  className?: string
  headerClassName?: string
  searchable?: boolean
}

export type DataTableFilter<T> = {
  id: string
  label: string
  placeholder?: string
  options: { label: string; value: string }[]
  accessorKey?: keyof T & string
  filterFn?: (row: T, value: string) => boolean
}

type DataTableProps<T extends Record<string, unknown>> = {
  title: string
  description?: string
  columns: DataTableColumn<T>[]
  data: T[]
  getRowId: (row: T) => string
  filters?: DataTableFilter<T>[]
  searchPlaceholder?: string
  pageSize?: number
  emptyMessage?: string
  actions?: ReactNode
  icon?: ReactNode
  className?: string
}

function getSearchableValue(value: unknown): string {
  if (value == null) return ""
  return String(value).toLowerCase()
}

export function DataTable<T extends Record<string, unknown>>({
  title,
  description,
  columns,
  data,
  getRowId,
  filters = [],
  searchPlaceholder = "Search records...",
  pageSize = 10,
  emptyMessage = "No records found.",
  actions,
  icon,
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [currentPage, setCurrentPage] = useState(1)

  const searchableKeys = useMemo(
    () =>
      columns
        .filter((col) => col.searchable !== false && col.accessorKey)
        .map((col) => col.accessorKey as keyof T & string),
    [columns]
  )

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase()

    return data.filter((row) => {
      const matchesSearch =
        !query ||
        searchableKeys.some((key) =>
          getSearchableValue(row[key]).includes(query)
        )

      if (!matchesSearch) return false

      return filters.every((filter) => {
        const value = filterValues[filter.id]
        if (!value || value === "all") return true

        if (filter.filterFn) return filter.filterFn(row, value)

        if (filter.accessorKey) {
          return String(row[filter.accessorKey] ?? "") === value
        }

        return true
      })
    })
  }, [data, search, searchableKeys, filters, filterValues])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, safePage, pageSize])

  function handleSearchChange(value: string) {
    setSearch(value)
    setCurrentPage(1)
  }

  function handleFilterChange(filterId: string, value: string) {
    setFilterValues((prev) => ({ ...prev, [filterId]: value }))
    setCurrentPage(1)
  }

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(1, page), totalPages))
  }

  return (
    <div className={cn(className)}>
      <CardHeader className="gap-4 space-y-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            {icon ? (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {icon}
              </span>
            ) : null}
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              {description ? (
                <CardDescription className="mt-1.5 max-w-2xl">
                  {description}
                </CardDescription>
              ) : null}
            </div>
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative w-full min-w-[200px] flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 bg-muted/40 pl-10"
              aria-label="Search table"
            />
          </div>

          {filters.map((filter) => (
            <Select
              key={filter.id}
              value={filterValues[filter.id] ?? "all"}
              onValueChange={(value) => handleFilterChange(filter.id, value)}
            >
              <SelectTrigger
                className="h-10 w-full min-w-[160px] sm:w-[200px]"
                aria-label={filter.label}
              >
                <SelectValue placeholder={filter.placeholder ?? filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-0 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                {columns.map((column) => (
                  <TableHead
                    key={column.id}
                    className={cn(
                      "h-11 px-4 font-semibold text-foreground",
                      column.headerClassName
                    )}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => (
                  <TableRow key={getRowId(row)} className="group">
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        className={cn("px-4 py-3", column.className)}
                      >
                        {column.cell
                          ? column.cell(row)
                          : column.accessorKey
                            ? String(row[column.accessorKey] ?? "—")
                            : "—"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end px-4 py-4 sm:px-0">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="size-9 rounded-full"
              aria-label="Previous page"
              disabled={safePage <= 1}
              onClick={() => goToPage(safePage - 1)}
            >
              <ChevronLeft className="size-4" aria-hidden />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="size-9 rounded-full"
              aria-label="Next page"
              disabled={safePage >= totalPages}
              onClick={() => goToPage(safePage + 1)}
            >
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  )
}
