'use client'

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns/format"
import { CalendarMonthRange } from "@/components/calendars/CalendarMonthRange"

interface FormMonthRangePickerProps {
  value: { start: Date; end: Date }
  onChange: (value: { start: Date; end: Date }) => void
  disabled?: boolean
}

export function MonthRangePicker({ value, onChange, disabled = false }: FormMonthRangePickerProps) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant={"outline"} 
          className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? `${format(value.start, "MMM yyyy")} - ${format(value.end, "MMM yyyy")}` : <span>Pick a month range</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0"> {/* w-auto */}
        <CalendarMonthRange onMonthRangeSelect={onChange} selectedMonthRange={value} showQuickSelectors={false} />
      </PopoverContent>
    </Popover>
  )
}
