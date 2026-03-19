import Link from "next/link"
import { ChevronLeft, AlertTriangle, Calendar, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { EVENT_TYPES } from "@/lib/data"

interface AlertDetailHeaderProps {
  alertTitle: string
  eventType: string
  riskLevel: string
  riskLabels: Record<string, string>
  riskColors: Record<string, string>
  formattedDate: string
  deptCount: number
}

export function AlertDetailHeader({
  alertTitle,
  eventType,
  riskLevel,
  riskLabels,
  riskColors,
  formattedDate,
  deptCount
}: AlertDetailHeaderProps) {
  const riskClasses = riskColors[riskLevel] || "bg-slate-600"

  return (
    <div className={cn("w-full pt-6 pb-20 md:pt-10 md:pb-24 text-white relative overflow-hidden", riskClasses.split(' ')[0])}>
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-black/10 rounded-full blur-2xl" />

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-sm font-medium mb-8 backdrop-blur-sm border border-white/10 group">
          <ChevronLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Volver al Dashboard
        </Link>

        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-transparent backdrop-blur-md px-3 py-1 uppercase tracking-wider text-[10px] font-bold">
              {EVENT_TYPES.find((event) => event.value === eventType)?.label}
            </Badge>
            <Badge className="bg-black/20 text-white border-transparent backdrop-blur-md px-3 py-1 uppercase tracking-wider text-[10px] font-bold flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3" />
              Riesgo {riskLabels[riskLevel] || riskLevel}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-6xl font-black tracking-tight leading-tight mb-6">
            {alertTitle}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm md:text-base font-medium text-white/90">
            <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
              <Calendar className="h-5 w-5 opacity-80" />
              Vigencia: <span className="text-white font-bold">{formattedDate}</span>
            </span>
            <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
              <MapPin className="h-5 w-5 opacity-80" />
              {deptCount} Departamentos afectados
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
