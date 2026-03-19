import { Sprout } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Crop } from "@/types/alerts"

interface AlertDetailCropsProps {
  crops: Crop[]
}

export function AlertDetailCrops({ crops }: AlertDetailCropsProps) {
  return (
    <Card className="border-none shadow-xl shadow-slate-200/60 overflow-hidden transform transition-all hover:shadow-2xl pt-0 gap-0">
      <div className="bg-emerald-600 h-2 w-full" />
      <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0 pt-4">
        <CardTitle className="text-xl font-bold flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Sprout className="h-6 w-6 text-emerald-600" />
          </div>
          Cultivos en Riesgo
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex flex-wrap gap-3">
          {crops.map(crop => (
            <div key={crop.id} className="group relative">
              <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-400 to-green-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <Badge className="relative bg-white text-emerald-800 border-emerald-100 hover:bg-emerald-50 px-6 py-4 text-sm font-bold shadow-sm flex items-center gap-2 cursor-default">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {crop.name}
              </Badge>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate-500 italic">
          Agricultor, estos cultivos requieren atención inmediata debido a las condiciones climáticas previstas.
        </p>
      </CardContent>
    </Card>
  )
}
