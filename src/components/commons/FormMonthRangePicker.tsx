import { Controller, Path, PathValue, UseFormReturn } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { MonthRangePicker } from "@/components/commons/MonthRangePicker";

interface FormMonthRangePickerProps<T extends Record<string, unknown>> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  disabled?: boolean
}

export function FormMonthRangePicker<T extends Record<string, unknown>>({
  form,
  name,
  label,
  disabled = false
}: FormMonthRangePickerProps<T>) {

  function onChange(value: { start: Date; end: Date }) {
    form.setValue(name, value as PathValue<T, Path<T>>)
  }

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }: { field: any; fieldState: any }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name} className="text-xs font-medium text-muted-foreground uppercase">
            {label}
          </FieldLabel>
          <MonthRangePicker
            value={field.value}
            onChange={onChange}
            disabled={disabled}
          />
        </Field>
      )}
    />
  )
}
