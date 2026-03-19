import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Department } from "@/types/alerts"

interface AlertDetailZonesProps {
  departments: Department[]
}

export function AlertDetailZones({ departments }: AlertDetailZonesProps) {
  return (
    <Card className="border-none shadow-xl shadow-slate-200/60 overflow-hidden pt-0 gap-0">
      <div className="bg-red-600 h-2 w-full" />
      <CardHeader className="border-b bg-slate-50/50 pt-4 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <MapPin className="h-6 w-6 text-red-600" />
          </div>
          Zonas en Riesgo
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((dept) => (
            <div key={dept.id} className="p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
              <h4 className="font-black text-slate-900 mb-3 flex items-center justify-between">
                <span>{dept.name}</span>
                <Badge variant="outline" className="text-[10px] font-bold opacity-50">Dpto</Badge>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {dept.provinces.map(prov => (
                  <span key={prov.id} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-semibold group-hover:bg-white transition-colors">
                    {prov.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
