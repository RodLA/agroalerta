import { Suspense } from "react"
import { MetricCards } from "@/components/dashboard/MetricCards"
import { MetricCardsSkeleton } from "@/components/dashboard/MetricCardsSkeleton"
import { QuickFilters } from "@/components/dashboard/QuickFilters"
import { AlertFeed } from "@/components/alerts/AlertFeed"
import { getAlerts } from "@/actions/action"
import { filterDefaultValues } from "@/schemas/filterSchema"

export default async function Home() {
  // Fetch initial data on the server
  const initialAlerts = await getAlerts(filterDefaultValues, 0)

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-6 md:px-8 md:py-10 space-y-8">
        {/* Header Metrics */}
        <section>
          <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Alertas Agroclimáticas</h1>
          <p className="text-muted-foreground mb-4">Información actualizada de alertas climáticas para tu región</p>
          <Suspense fallback={<MetricCardsSkeleton />}>
            <MetricCards />
          </Suspense>
        </section>

        {/* Quick Filters */}
        <section>
          <h1 className="scroll-m-20 text-xl font-semibold tracking-tight mb-4">Buscar Alertas</h1>
          <QuickFilters />
        </section>

        {/* Alert Feed (Client Component with Initial Data) */}
        <AlertFeed initialData={initialAlerts} />
      </div>
    </div>
  )
}
