import { Combobox as BaseUICombobox, ComboboxContent as BaseUiComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxList, ComboboxItem } from '@/components/ui/combobox'

// interface ComboboxProps {
//   items: string[]
//   defaultValue: string
// }

interface ComboboxProps {
  items: Array<{ label: string; value: string }>
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
}

export function Combobox({
  items,
  value,
  onChange,
  placeholder = "Seleccionar...",
  emptyMessage = "No se encontraron resultados.",
  className,
  disabled = false
}: ComboboxProps) {
  const selectedItem = items.find(i => i.value === value) || null

  return (
    <BaseUICombobox
      items={items}
      value={selectedItem}
      onValueChange={(val: any) => {
        if (val) onChange(val.value)
      }}
      disabled={disabled}
    >
      <ComboboxInput placeholder={placeholder} showClear />
      <BaseUiComboboxContent className={className}>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </BaseUiComboboxContent>
    </BaseUICombobox>
  )
}

