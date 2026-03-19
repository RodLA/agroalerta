import { Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AlertDetailInfoProps {
  summary: string
  description: string
}

export function AlertDetailInfo({ summary, description }: AlertDetailInfoProps) {
  return (
    <Card className="border-none shadow-xl shadow-slate-200/60 overflow-hidden pt-0 gap-0">
      <CardHeader className="border-b bg-blue-600 text-white pt-6 pb-6 px-6">
        <CardTitle className="text-xl font-bold flex items-center gap-3">
          <Info className="h-6 w-6" />
          Información de la Alerta
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8 space-y-8 pb-8 px-6">
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-full" />
          <div className="pl-6">
            <h5 className="text-blue-600 font-black uppercase tracking-widest text-[10px] mb-2">Resumen</h5>
            <p className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">
              "{summary}"
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h5 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-4">Análisis Detallado</h5>
          <div className="prose prose-blue max-w-none">
            <p className="text-slate-700 leading-relaxed whitespace-pre-line text-base sm:text-lg text-justify">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
