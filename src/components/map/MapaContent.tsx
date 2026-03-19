"use client"

import nextDynamic from "next/dynamic"
import { MapFilters } from "@/components/map/MapFilters"
import { MapLegend, MapInstructions } from "@/components/map/MapLegend"
import { useState, useEffect, useCallback } from "react"
import { getReportAction, getProvinces } from "@/actions/action"
import { ReportData } from "@/types/report"
import { Filter } from "@/schemas/filterSchema"
import { useSearchStore } from "@/store/useSearchStore"
import { toast } from "sonner"

const ReportMap = nextDynamic(() => import("@/components/map/ReportMap").then(mod => mod.ReportMap), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-slate-100 animate-pulse rounded-xl" />
})

export function MapaContent() {
  const { filter, departments, setProvinces } = useSearchStore()
  const [report, setReport] = useState<ReportData>({
    crops: [],
    sources: [],
    levels: [],
    locations: {}
  })
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Interactive Filters State
  const [selectedCrop, setSelectedCrop] = useState("Todos")
  const [selectedRisk, setSelectedRisk] = useState("Todos")

  const fetchReport = useCallback(async (filters: Filter) => {
    if (typeof window === "undefined") return
    setIsLoading(true)
    try {
      const response = await getReportAction(filters)

      if (response) {
        setReport(response)
        
        // Fetch provinces if department is selected
        if (filters.department && filters.department !== "Todos") {
          const selectedDept = departments.find(d => d.ubigeo.toString() === filters.department)
          if (selectedDept) {
            const provinces = await getProvinces(selectedDept.id)
            setProvinces(provinces)
          }
        } else {
          setProvinces([])
        }
      } else {
        toast.error("Error al obtener el reporte")
      }
    } catch (error) {
      toast.error("Error de conexión al obtener el reporte")
    } finally {
      setIsLoading(false)
    }
  }, [departments, setProvinces])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchReport(filter)
    }
  }, [mounted, fetchReport, filter])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
      {/* Main Map Area */}
      <div className="lg:col-span-6 space-y-6">
        <ReportMap 
          data={report} 
          dept={filter.department}
          selectedCrop={selectedCrop} 
          selectedRisk={selectedRisk} 
        />
        <MapInstructions />
      </div>

      {/* Sidebar Area */}
      <div className="lg:col-span-4 space-y-6">
        <MapFilters 
          onGenerateReport={fetchReport}
          onInteractiveCropChange={setSelectedCrop}
          onInteractiveRiskChange={setSelectedRisk}
          selectedInteractiveCrop={selectedCrop}
          selectedInteractiveRisk={selectedRisk}
          isLoading={isLoading}
          availableCrops={report.crops}
        />
        <MapLegend 
          crops={report.crops}
          sources={report.sources}
        />
      </div>
    </div>
  )
}
