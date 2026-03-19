import { CheckCircle2, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Recommendation } from "@/types/alerts"

interface AlertDetailRecommendationsProps {
  recommendations: Recommendation[]
}

export function AlertDetailRecommendations({ recommendations }: AlertDetailRecommendationsProps) {
  return (
    <Card className="border-none shadow-xl shadow-green-100 border-l-[6px] border-l-green-600 overflow-hidden pt-0 gap-0">
      <CardHeader className="border-b bg-green-50/50 pt-6 pb-6 px-6">
        <CardTitle className="text-xl font-bold flex items-center gap-3 text-green-900">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
          Guía de Acción y Recomendaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8 px-6 pb-8">
        <div className="grid grid-cols-1 gap-6">
          {recommendations.map((rec, index) => (
            <div key={rec.id} className="flex gap-6 items-start relative pb-6 border-b border-green-50 last:border-0 last:pb-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white shadow-lg shadow-green-200">
                <span className="font-black text-lg">{index + 1}</span>
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-[10px] font-black uppercase tracking-wider">
                  <Globe className="h-3 w-3" />
                  {rec.domain}
                </div>
                <p className="text-slate-700 leading-relaxed font-medium text-sm sm:text-lg text-justify">
                  {rec.reco}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
