import Link from "next/link"
import { MapPin, Calendar, Sprout } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Alert } from "@/types/metrics"
import { cn, riskToDisplay } from "@/lib/utils"
import { EVENT_TYPES } from "@/lib/data"

interface AlertCardProps {
  alert: Alert
}

const riskColors: Record<string, string> = {
  "MUY ALTO": "bg-red-600 hover:bg-red-700",
  "ALTO": "bg-orange-600 hover:bg-orange-700",
  "MEDIO": "bg-amber-500 hover:bg-amber-600",
  "BAJO": "bg-green-600 hover:bg-green-700",
  "MUY BAJO": "bg-emerald-500 hover:bg-emerald-600"
}

export function AlertCard({ alert }: AlertCardProps) {
  // Ensure we match case for risk color lookup
  const riskKey = alert.risk.toUpperCase()

  return (
    <Link href={`/alerta/${alert.id}`} className="block transition-transform hover:-translate-y-1">
      <Card className="h-full overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <CardHeader className="space-y-2 pb-2">
          <div className="flex justify-between items-start gap-2">
            <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 uppercase text-[10px]">
              {EVENT_TYPES.find(event => event.value === alert.event.id)?.label}
            </Badge>
            <Badge className={cn("text-white border-none text-[10px]", riskColors[riskKey] || "bg-slate-500")}>
              {riskToDisplay(alert.risk).toUpperCase()}
            </Badge>
          </div>

          <h3 className="font-bold text-lg leading-tight line-clamp-2 min-h-12">
            {alert.title}
          </h3>

          <div className="flex items-start gap-2 text-xs">
            <div className="flex flex-wrap gap-1">
              {alert.departments.slice(0, 3).map(dept => (
                <span key={dept} className="flex font-medium text-muted-foreground">
                  <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground shrink-0" />
                  &nbsp;{dept}
                </span>
              ))}
              {alert.departments.length > 3 && (
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  +{alert.departments.length - 3} más
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4 grow">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {alert.summary}
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Sprout className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Cultivos: </span>
              <span className="font-medium">{alert.crops.map(c => c.name).join(", ")}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between items-center text-[10px] text-muted-foreground border-t bg-slate-50/50">
          <div className="flex items-center gap-1.5 pt-4">
            <Calendar className="h-3 w-3" />
            <span>{alert.riskDate}</span>
          </div>
          <div className="flex items-center gap-1.5 pt-4">
            <span className="font-semibold uppercase">{alert.source}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
