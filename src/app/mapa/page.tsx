import { MetricCards } from "@/components/dashboard/MetricCards"
import { MapaContent } from "@/components/map/MapaContent"
import { Suspense } from "react"
import { MetricCardsSkeleton } from "@/components/dashboard/MetricCardsSkeleton"

export default function MapaPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:px-8 space-y-8">
        {/* Header Metrics */}
        <section>
          <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Alertas Agroclimáticas</h1>
          <p className="text-muted-foreground mb-4">Información actualizada de alertas climáticas para tu región</p>
          <Suspense fallback={<MetricCardsSkeleton />}>
            <MetricCards />
          </Suspense>
        </section>

        <section>
          <h1 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight">🗺️ Mapa de Alertas</h1>
          <p className="text-muted-foreground mb-4">Información actualizada de alertas climáticas para tu región</p>
          <MapaContent />
        </section>
      </div>
    </div>
  )
}
