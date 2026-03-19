import { Badge } from "@/components/ui/badge"
import { RiskLevel } from "@/lib/mock-data"

const riskColors: Record<string, string> = {
  "MUY ALTO": "bg-red-600",
  "ALTO": "bg-orange-600",
  "MEDIO": "bg-amber-500",
  "BAJO": "bg-green-600",
  "MUY BAJO": "bg-emerald-500"
}

interface MapLegendProps {
  crops?: Array<{ id: string, name: string }>
  sources?: Array<{ site: string, siteName: string }>
}

export function MapLegend({ crops = [], sources = [] }: MapLegendProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Niveles de Riesgo</h4>
        <div className="space-y-2">
          {Object.keys(riskColors).map((risk) => (
            <div key={risk} className="flex items-center gap-2 text-xs">
              <div className={`w-3 h-3 rounded-full ${riskColors[risk] || "bg-slate-400"}`} />
              <span className="font-medium text-slate-700">{risk}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Cultivos en Riesgo</h4>
        <div className="flex flex-wrap gap-1.5">
          {crops.length > 0 ? (
            crops.map(crop => (
              <Badge key={crop.id} variant="outline" className="text-[10px]">{crop.name}</Badge>
            ))
          ) : (
            <>
              <Badge variant="outline" className="text-[10px]">Sin resultados</Badge>
            </>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Fuentes Oficiales</h4>
        <div className="space-y-1 text-[10px] text-muted-foreground">
          {sources.length > 0 ? (
            sources.map(source => (
              <div key={source.site}>
                <p className="font-bold">• {source.site}</p>
                <p className="text-xs text-muted-foreground">({source.siteName})</p>
              </div>
            ))
          ) : (
            <>
              <p>Sin resultados</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function MapInstructions() {
  return (
    <div className="bg-slate-100 p-6 rounded-xl border border-dashed border-slate-300">
      <h3 className="font-bold mb-2 flex items-center gap-2">
        <span>💡</span> ¿Cómo usar el mapa interactivo?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
        <p>
          <strong>Filtros:</strong> Utilice los paneles superiores para ajustar el reporte temporal o filtrar puntos específicos del mapa por cultivo y riesgo. El mapa se ajustará automáticamente.
        </p>
        <p>
          <strong>Interacción:</strong> Pase el cursor sobre los marcadores para una vista rápida o haga clic para ver detalles del departamento, provincia y nivel de riesgo máximo en la zona.
        </p>
      </div>
    </div>
  )
}
