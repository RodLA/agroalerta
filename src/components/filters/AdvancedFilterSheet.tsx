"use client"

import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useSearchStore } from "@/store/useSearchStore"
import { EVENT_TYPES, RISK_LEVELS } from "@/lib/data"
import { FieldGroup } from "@/components/ui/field"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Filter, filterSchema } from "@/schemas/filterSchema"
import { FormCombobox } from "@/components/commons/FormCombobox"
import { FormMonthRangePicker } from "@/components/commons/FormMonthRangePicker"
import { useState, useEffect, useMemo, useCallback } from "react"
import { getProvinces } from "@/actions/action"

interface AdvancedFilterSheetProps {
  onClose: () => void
}

export function AdvancedFilterSheet({ onClose }: AdvancedFilterSheetProps) {
  const { filter, filterChange, resetFilters, departments, provinces, setProvinces } = useSearchStore()
  const [loadingProvinces, setLoadingProvinces] = useState(false)

  const form = useForm<Filter>({
    resolver: zodResolver(filterSchema),
    values: filter
  })

  const { watch, setValue, handleSubmit } = form
  const selectedDepartmentUbigeo = watch("department")

  // Memoized options
  const departmentOptions = useMemo(() =>
    departments.map(dept => ({
      value: dept.ubigeo.toString(),
      label: dept.name
    })), [departments])

  const provinceOptions = useMemo(() =>
    provinces.map(prov => ({
      value: prov.ubigeo.toString(),
      label: prov.name
    })), [provinces])

  // Effect to load provinces when department changes
  useEffect(() => {
    let isMounted = true

    async function loadProvinces(deptId: string) {
      setLoadingProvinces(true)
      try {
        const data = await getProvinces(deptId)
        if (isMounted) {
          setProvinces(data)
        }
      } catch (error) {
        console.error("Error loading provinces:", error)
        if (isMounted) setProvinces([])
      } finally {
        if (isMounted) setLoadingProvinces(false)
      }
    }

    if (!selectedDepartmentUbigeo) {
      setProvinces([])
      setValue("province", "")
      return
    }

    const dept = departments.find(d => d.ubigeo.toString() === selectedDepartmentUbigeo)
    if (dept) {
      // Important: Reset province field whenever department changes
      setValue("province", "")
      loadProvinces(dept.id)
    } else {
      setProvinces([])
      setValue("province", "")
    }

    return () => { isMounted = false }
  }, [selectedDepartmentUbigeo, departments, setValue, setProvinces])

  const onSubmit = useCallback((data: Filter) => {
    filterChange(data)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    onClose()
  }, [filterChange, onClose])

  const onReset = useCallback(() => {
    resetFilters()
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    onClose()
  }, [resetFilters, onClose])

  return (
    <SheetContent className="w-full! sm:max-w-md!">
      <SheetHeader className="border-b-2">
        <SheetTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">Búsqueda Avanzada</SheetTitle>
        <SheetDescription className="text-muted-foreground">
          Ajusta los criterios para encontrar alertas específicas.
        </SheetDescription>
      </SheetHeader>

      <form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
        <FieldGroup className="flex flex-col gap-0.5 p-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <FormCombobox
                form={form}
                name="department"
                items={departmentOptions}
                label="📍 Departamento"
                placeholder="Todos"
              />
            </div>

            <div className="space-y-2">
              <FormCombobox
                form={form}
                name="province"
                items={provinceOptions}
                label="📌 Provincia"
                placeholder={loadingProvinces ? "Cargando..." : "Todos"}
                disabled={!selectedDepartmentUbigeo || loadingProvinces}
              />
            </div>

            <div className="space-y-2">
              <FormCombobox
                form={form}
                name="event"
                items={EVENT_TYPES}
                label="🌧️ Tipo de Evento"
                placeholder="Todos"
              />
            </div>

            <div className="space-y-2">
              <FormCombobox
                form={form}
                name="risk"
                items={RISK_LEVELS}
                label="⚠️ Nivel de Riesgo"
                placeholder="Todos"
              />
            </div>

            <div className="space-y-2">
              <FormMonthRangePicker
                form={form}
                name="range"
                label="📅 Rango de Fechas"
              />
            </div>
          </div>
        </FieldGroup>


        <SheetFooter className="absolute bottom-6 left-6 right-6 flex-col gap-2 sm:flex-col">
          <Button className="w-full" type="submit">Aplicar Filtros</Button>
          <Button variant="outline" className="w-full" type="reset">Limpiar Todos</Button>
        </SheetFooter>

      </form>
    </SheetContent>
  )
}
