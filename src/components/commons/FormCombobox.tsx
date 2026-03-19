import { Controller, Path, PathValue, UseFormReturn } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Combobox, ComboboxInput, ComboboxContent, ComboboxEmpty, ComboboxList, ComboboxItem } from "@/components/ui/combobox"

interface FormComboboxProps<T extends Record<string, unknown>> {
  form: UseFormReturn<T>
  name: Path<T>
  items: Array<{ label: string; value: string }>
  label: string
  placeholder: string
  emptyMessage?: string
  disabled?: boolean
}

export function FormCombobox<T extends Record<string, unknown>>({
  form,
  name,
  items,
  label,
  placeholder = "Seleccionar...",
  emptyMessage = "No se encontraron resultados.",
  disabled = false
}: FormComboboxProps<T>) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }: { field: any; fieldState: any }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name} className="text-xs font-medium text-muted-foreground uppercase">
            {label}
          </FieldLabel>
          <Combobox
            items={items}
            value={items.find((item) => item.value === field.value) || null}
            onValueChange={(item) => form.setValue(name, (item ? item.value : '') as PathValue<T, Path<T>>)}
            disabled={disabled}
          >
            <ComboboxInput placeholder={placeholder} showClear />
            <ComboboxContent
              className="pointer-events-auto"
              onWheel={(e) => e.stopPropagation()}
            >
              <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.value} value={item}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
      )}
    />
  )
}
