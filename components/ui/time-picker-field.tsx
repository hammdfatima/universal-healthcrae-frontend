"use client"

import { format, isValid, parse } from "date-fns"
import { Clock } from "lucide-react"
import { useEffect, useState } from "react"

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

function parseTimeValue(value?: string): TimeParts | null {
  if (!value) return null

  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value.trim())
  if (!match) {
    const parsed = parse(value, "HH:mm", new Date())
    if (!isValid(parsed)) return null
    const hours24 = parsed.getHours()
    return {
      hour: String(hours24 % 12 || 12),
      minute: format(parsed, "mm"),
      period: hours24 >= 12 ? "PM" : "AM",
    }
  }

  const hours24 = Number(match[1])
  const minutes = match[2]

  return {
    hour: String(hours24 % 12 || 12),
    minute: minutes,
    period: hours24 >= 12 ? "PM" : "AM",
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

  return `${String(hours24).padStart(2, "0")}:${minute.padStart(2, "0")}`
}

function formatDisplayTime(value?: string): string {
  const parts = parseTimeValue(value)
  if (!parts) return value || ""

  return `${parts.hour.padStart(2, "0")}:${parts.minute} ${parts.period}`
}

const EMPTY_PARTS: TimeParts = {
  hour: "8",
  minute: "00",
  period: "AM",
}

export default function TimePickerField({
  value,
  onChange,
  placeholder = "--:-- --",
  disabled,
  id,
}: TimePickerFieldProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<TimeParts>(
    () => parseTimeValue(value) ?? EMPTY_PARTS
  )

  useEffect(() => {
    if (!open) {
      setDraft(parseTimeValue(value) ?? EMPTY_PARTS)
    }
  }, [value, open])

  function commit(next: TimeParts) {
    setDraft(next)
    onChange(to24HourTime(next.hour, next.minute, next.period))
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
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
      <PopoverContent
        className="w-auto p-3"
        align="start"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Select
              value={draft.hour}
              onValueChange={(hour) => commit({ ...draft, hour })}
            >
              <SelectTrigger className="w-[4.5rem]" aria-label="Hour">
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[70]">
                {HOURS.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-muted-foreground">:</span>

            <Select
              value={draft.minute}
              onValueChange={(minute) => commit({ ...draft, minute })}
            >
              <SelectTrigger className="w-[4.5rem]" aria-label="Minute">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[70] max-h-48">
                {MINUTES.map((minute) => (
                  <SelectItem key={minute} value={minute}>
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              size="sm"
              variant={draft.period === "AM" ? "default" : "outline"}
              onClick={() => commit({ ...draft, period: "AM" })}
            >
              AM
            </Button>
            <Button
              type="button"
              size="sm"
              variant={draft.period === "PM" ? "default" : "outline"}
              onClick={() => commit({ ...draft, period: "PM" })}
            >
              PM
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
