"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type DatePickerFieldProps = {
  value?: Date | null
  onChange: (date?: Date) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  maxDate?: Date
  minDate?: Date
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const

function toValidDate(value?: Date | null): Date | undefined {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    return undefined
  }

  return new Date(value.getFullYear(), value.getMonth(), value.getDate())
}

export default function DatePickerField({
  value,
  onChange,
  placeholder = "MM/DD/YYYY",
  disabled,
  id,
  maxDate,
  minDate,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Date | undefined>(() =>
    toValidDate(value)
  )
  const [displayMonth, setDisplayMonth] = useState<Date>(
    () => toValidDate(value) ?? toValidDate(new Date())!
  )

  useEffect(() => {
    const next = toValidDate(value)
    setSelected(next)
    if (next) {
      setDisplayMonth(next)
    }
  }, [value])

  const years = useMemo(() => {
    const latest = maxDate?.getFullYear() ?? new Date().getFullYear() + 20
    const earliest = minDate?.getFullYear() ?? 1920
    const list: number[] = []
    for (let year = latest; year >= earliest; year -= 1) {
      list.push(year)
    }
    return list
  }, [maxDate, minDate])

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (nextOpen) {
      setDisplayMonth(selected ?? toValidDate(new Date())!)
    }
  }

  function handleMonthChange(monthIndex: number) {
    setDisplayMonth(new Date(displayMonth.getFullYear(), monthIndex, 1))
  }

  function handleYearChange(year: number) {
    setDisplayMonth(new Date(year, displayMonth.getMonth(), 1))
  }

  function handleSelect(date?: Date) {
    const normalized = toValidDate(date)
    setSelected(normalized)
    if (normalized) {
      setDisplayMonth(normalized)
      onChange(normalized)
      setOpen(false)
      return
    }

    onChange(undefined)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-10 w-full justify-start rounded-full px-4 text-left font-normal",
            !selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 size-4 shrink-0" aria-hidden />
          {selected ? format(selected, "MM/dd/yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
        <div className="flex items-center gap-2 border-b border-border/60 px-3 pt-3 pb-2">
          <label className="sr-only" htmlFor={id ? `${id}-month` : undefined}>
            Month
          </label>
          <select
            id={id ? `${id}-month` : undefined}
            className="h-9 min-w-0 flex-1 rounded-full border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            value={displayMonth.getMonth()}
            onChange={(event) => handleMonthChange(Number(event.target.value))}
          >
            {MONTHS.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor={id ? `${id}-year` : undefined}>
            Year
          </label>
          <select
            id={id ? `${id}-year` : undefined}
            className="h-9 w-[5.5rem] shrink-0 rounded-full border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            value={displayMonth.getFullYear()}
            onChange={(event) => handleYearChange(Number(event.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <Calendar
          mode="single"
          selected={selected}
          month={displayMonth}
          onMonthChange={setDisplayMonth}
          onSelect={handleSelect}
          showYearSwitcher={false}
          startMonth={toValidDate(minDate) ?? new Date(1920, 0)}
          endMonth={
            toValidDate(maxDate) ?? new Date(new Date().getFullYear() + 20, 11)
          }
          disabled={[
            ...(minDate && toValidDate(minDate)
              ? [{ before: toValidDate(minDate)! }]
              : []),
            ...(maxDate && toValidDate(maxDate)
              ? [{ after: toValidDate(maxDate)! }]
              : []),
          ]}
          required
        />
      </PopoverContent>
    </Popover>
  )
}
