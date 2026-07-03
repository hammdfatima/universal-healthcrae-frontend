import EmptyCard from "@/components/empty-card"
import ErrorCard from "@/components/error-card"
import { Loader } from "@/components/ui/loader"
import { cn } from "@/lib/utils"

type DataTableStateCellProps = {
  colSpan: number
  className?: string
}

export function DataTableLoadingState({
  colSpan,
  className,
  label = "Loading records...",
}: DataTableStateCellProps & { label?: string }) {
  return (
    <tr className="hover:bg-transparent">
      <td colSpan={colSpan} className={cn("p-0", className)}>
        <Loader variant="fetch" label={label} className="py-16" />
      </td>
    </tr>
  )
}

export function DataTableErrorState({
  colSpan,
  className,
  error,
  onRetry,
  isRetrying,
}: DataTableStateCellProps & {
  error: unknown
  onRetry?: () => void
  isRetrying?: boolean
}) {
  return (
    <tr className="hover:bg-transparent">
      <td colSpan={colSpan} className={cn("p-4", className)}>
        <ErrorCard error={error} onRetry={onRetry} isLoading={isRetrying} />
      </td>
    </tr>
  )
}

export function DataTableEmptyState({
  colSpan,
  className,
  title,
  description,
  action,
}: DataTableStateCellProps & {
  title?: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <tr className="hover:bg-transparent">
      <td colSpan={colSpan} className={cn("p-4", className)}>
        <EmptyCard title={title} description={description} action={action} />
      </td>
    </tr>
  )
}
