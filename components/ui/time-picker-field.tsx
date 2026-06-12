"use client"

import { format, isValid, parse } from "date-fns"
import { Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type TimePickerFieldProps = {
  value?: string
  onChange: (time: string) => void
  placeholder?: string
  disabled?: boolean
  id?: string
}

type TimeParts = {
  hour: string
  minute: string
  period: "AM" | "PM"
}

const HOURS = Array.from({ length: 12 }, (_, index) => String(index + 1))
const MINUTES = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0")
)
const PERIODS = ["AM", "PM"] as const

function parseTimeValue(value?: string): TimeParts | null {
  if (!value) return null

  const parsed = parse(value, "HH:mm", new Date())
  if (!isValid(parsed)) return null

  const hours24 = parsed.getHours()
  const period = hours24 >= 12 ? "PM" : "AM"
  const hour12 = hours24 % 12 || 12

  return {
    hour: String(hour12),
    minute: format(parsed, "mm"),
    period,
  }
}

function to24HourTime(
  hour: string,
  minute: string,
  period: "AM" | "PM"
): string {
  let hours24 = Number.parseInt(hour, 10)

  if (period === "AM") {
    if (hours24 === 12) hours24 = 0
  } else if (hours24 !== 12) {
    hours24 += 12
  }

  return `${String(hours24).padStart(2, "0")}:${minute}`
}

function formatDisplayTime(value?: string): string {
  if (!value) return ""

  const parsed = parse(value, "HH:mm", new Date())
  if (!isValid(parsed)) return value

  return format(parsed, "hh:mm a")
}

export default function TimePickerField({
  value,
  onChange,
  placeholder = "--:-- --",
  disabled,
  id,
}: TimePickerFieldProps) {
  const parts = parseTimeValue(value)

  function updatePart(update: Partial<TimeParts>) {
    const hour = update.hour ?? parts?.hour ?? "12"
    const minute = update.minute ?? parts?.minute ?? "00"
    const period = update.period ?? parts?.period ?? "AM"
    onChange(to24HourTime(hour, minute, period))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-10 w-full justify-start rounded-full px-4 text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 size-4 shrink-0" aria-hidden />
          {value ? formatDisplayTime(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="flex items-center gap-2">
          <Select
            value={parts?.hour ?? ""}
            onValueChange={(hour) => updatePart({ hour })}
          >
            <SelectTrigger className="w-[4.5rem]" aria-label="Hour">
              <SelectValue placeholder="HH" />
            </SelectTrigger>
            <SelectContent>
              {HOURS.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-muted-foreground">:</span>

          <Select
            value={parts?.minute ?? ""}
            onValueChange={(minute) => updatePart({ minute })}
          >
            <SelectTrigger className="w-[4.5rem]" aria-label="Minute">
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent className="max-h-48">
              {MINUTES.map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={parts?.period ?? ""}
            onValueChange={(period) =>
              updatePart({ period: period as "AM" | "PM" })
            }
          >
            <SelectTrigger className="w-[5rem]" aria-label="AM or PM">
              <SelectValue placeholder="--" />
            </SelectTrigger>
            <SelectContent>
              {PERIODS.map((period) => (
                <SelectItem key={period} value={period}>
                  {period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  )
}
