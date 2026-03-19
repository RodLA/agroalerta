"use client"

import { useEffect, useRef } from "react"
import { AlertCard } from "@/components/alerts/AlertCard"
import { AlertCardSkeleton } from "./AlertCardSkeleton"
import { Pagination } from "@/components/dashboard/Pagination"
import { useSearchStore } from "@/store/useSearchStore"
import { getAlerts } from "@/actions/action"
import { Alert } from "@/types/metrics"
import { PaginatedResponse } from "@/types/api"

interface AlertFeedProps {
  initialData: PaginatedResponse<Alert>
}

export function AlertFeed({ initialData }: AlertFeedProps) {
  const { filter, currentPage, alerts, pagination, isLoading, setAlerts, setPaginationMeta, setIsLoading } = useSearchStore()
  const isInitialized = useRef(false)

  // Initialize with server data OR reaction to changes
  useEffect(() => {
    // 1. Initial hydration from server
    if (!isInitialized.current && initialData.success) {
      if (alerts.length === 0) {
        setAlerts(initialData.data)
        setPaginationMeta(initialData.meta)
      }
      isInitialized.current = true
      return
    }

    // 2. Subsequent reactions to filter/page changes
    async function fetchAlerts() {
      setIsLoading(true)
      try {
        const response = await getAlerts(filter, currentPage)
        if (response.success) {
          setAlerts(response.data)
          setPaginationMeta(response.meta)
        }
      } catch (error) {
        console.error("Error fetching alerts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isInitialized.current) {
      fetchAlerts()
    }
  }, [filter, currentPage, initialData, setAlerts, setPaginationMeta, setIsLoading])

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Resultados de la búsqueda</h2>
        <span className="text-sm text-muted-foreground">
          {isLoading ? "..." : (pagination.totalElements || initialData.meta.totalElements)} alertas encontradas
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          // Skeletons
          [...Array(6)].map((_, i) => (
            <AlertCardSkeleton key={i} />
          ))
        ) : (
          // Actual Data
          (alerts.length > 0 ? alerts : initialData.data).map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))
        )}
      </div>

      {!isLoading && alerts.length === 0 && !initialData.data.length && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed">
          <p className="text-muted-foreground">No se encontraron alertas con los filtros seleccionados.</p>
        </div>
      )}

      {!isLoading && <Pagination />}
    </section>
  )
}
