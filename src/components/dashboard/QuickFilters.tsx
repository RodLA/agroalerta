"use client"

import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearchStore } from "@/store/useSearchStore"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { AdvancedFilterSheet } from "@/components/filters/AdvancedFilterSheet"
import { EVENT_TYPES, RISK_LEVELS } from "@/lib/data"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Filter, filterSchema } from "@/schemas/filterSchema"
import { FieldGroup } from "@/components/ui/field"
import { FormCombobox } from "../commons/FormCombobox"

export function QuickFilters() {
  const { filter, filterChange, departments } = useSearchStore()
  
  const departmentOptions = departments.map(dept => ({
    value: dept.ubigeo.toString(),
    label: dept.name
  }))

  const form = useForm<Filter>({
    resolver: zodResolver(filterSchema),
    values: filter
  })

  function onSubmit(data: Filter) {
    filterChange(data)
  }

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🔍</span>
        <h2 className="font-semibold text-lg">Filtros Rápidos</h2>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

            <div className="space-y-1.5">
              <FormCombobox
                form={form}
                name="department"
                items={departmentOptions}
                label="📍 Departamento"
                placeholder="Todos"
              />
            </div>

            <div className="space-y-1.5">
              <FormCombobox
                form={form}
                name="event"
                items={EVENT_TYPES}
                label="🌧️ Tipo de Evento"
                placeholder="Todos"
              />
            </div>

            <div className="space-y-1.5">
              <FormCombobox
                form={form}
                name="risk"
                items={RISK_LEVELS}
                label="⚠️ Nivel de Riesgo"
                placeholder="Todos"
              />
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 gap-2">
                <Search className="h-4 w-4" />
                Buscar
              </Button>
              <Sheet open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <AdvancedFilterSheet onClose={() => setIsAdvancedOpen(false)} />
              </Sheet>
            </div>
          </div>
        </FieldGroup>
      </form>

    </div>
  )
}
