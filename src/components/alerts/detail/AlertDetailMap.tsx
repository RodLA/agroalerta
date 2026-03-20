import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DynamicMiniMap } from "@/components/map/DynamicMap"

interface AlertDetailMapProps {
  mapAlertData: any
}

export function AlertDetailMap({ mapAlertData }: AlertDetailMapProps) {
  return (
    <Card className="border-none shadow-xl shadow-slate-200/60 overflow-hidden group py-0 gap-0">
      <CardHeader className="p-4 bg-slate-100/80 border-b pt-4">
        <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">
          Mapa de la Alerta
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[350px] relative">
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-white/90 backdrop-blur shadow-sm text-slate-900 border-slate-200 hover:bg-white">
            Modo Referencial
          </Badge>
        </div>
        <DynamicMiniMap alerts={[mapAlertData]} />
      </CardContent>
    </Card>
  )
}
