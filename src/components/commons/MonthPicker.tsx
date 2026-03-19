import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import { CalendarIcon } from "lucide-react";
import { CalendarMonth } from "@/components/calendars/CalendarMonth";

interface MonthPickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

export function MonthPicker({ value, onChange }: MonthPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "MMM yyyy") : <span>Pick a month</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <CalendarMonth onMonthSelect={onChange} selectedMonth={value} />
      </PopoverContent>
    </Popover>
  )
}
