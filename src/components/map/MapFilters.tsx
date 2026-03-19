import { Button } from "@/components/ui/button"
import { useSearchStore } from "@/store/useSearchStore"
import { CROPS, RiskLevel } from "@/lib/mock-data"
import { Search, Filter as FilterIcon, Loader2 } from "lucide-react"
import { Combobox } from "@/components/commons/Combobox"
import { useForm } from "react-hook-form"
import { Filter, filterSchema } from "@/schemas/filterSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldGroup } from "@/components/ui/field"
import { RISK_LEVELS } from "@/lib/data"
import { FormCombobox } from "@/components/commons/FormCombobox"
import { FormMonthRangePicker } from "@/components/commons/FormMonthRangePicker"

interface MapFiltersProps {
  onGenerateReport: (data: Filter) => void
  onInteractiveCropChange: (crop: string) => void
  onInteractiveRiskChange: (risk: string) => void
  selectedInteractiveCrop: string
  selectedInteractiveRisk: string
  isLoading?: boolean
  availableCrops?: Array<{ id: string, name: string }>
}

export function MapFilters({
  onGenerateReport,
  onInteractiveCropChange,
  onInteractiveRiskChange,
  selectedInteractiveCrop,
  selectedInteractiveRisk,
  isLoading = false,
  availableCrops = []
}: MapFiltersProps) {
  const { filter, filterChange, departments } = useSearchStore()

  const departmentOptions = departments.map(dept => ({
    value: dept.ubigeo.toString(),
    label: dept.name
  }))

  const cropOptions = [
    { label: "Todos los cultivos", value: "Todos" },
    ...availableCrops.map(c => ({ label: c.name, value: c.id }))
  ]

  const riskOptions = [
    { label: "Todos", value: "Todos" },
    ...RISK_LEVELS
  ]

  const form = useForm<Filter>({
    resolver: zodResolver(filterSchema),
    values: filter
  })

  function onSubmit(data: Filter) {
    filterChange(data)
    onGenerateReport(data)
  }

  return (
    <div className="space-y-6">
      {/* Report Filters */}
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-primary" />
          Filtros de Reporte
        </h3>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div className="space-y-1.5">
                <FormCombobox
                  form={form}
                  name="department"
                  items={departmentOptions}
                  label="📍 Departamento"
                  placeholder="Todos"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-1.5">
                <FormMonthRangePicker
                  form={form}
                  name="range"
                  label="📅 Rango de Fechas"
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="sm:col-span-2 w-full gap-2" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Generar Reporte
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>

      {/* Interactive Map Filters */}
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
          <span className="text-primary">📍</span>
          Interactividad del Mapa
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Cultivos</label>
            <Combobox
              items={cropOptions}
              value={selectedInteractiveCrop}
              onChange={onInteractiveCropChange}
              placeholder="Todos los cultivos"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Nivel de Riesgo</label>
            <Combobox
              items={riskOptions}
              value={selectedInteractiveRisk}
              onChange={onInteractiveRiskChange}
              placeholder="Todos"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
